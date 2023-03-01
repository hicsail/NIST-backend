from swift.common.swob import HTTPUnauthorized, Request, Response
from swift.common.utils import get_logger, register_swift_info
from swift.common.middleware.acl import clean_acl
import requests


class SAILAuth(object):
    """
    WSGI filter for handling authentication as a Sift middleware.

    Purpose
    -------
    This middleware handles authentication against the SAIL provided
    authentication system. The SAIL authentication system makes use of JWTs
    and thus this middleware expects JWTs to be provided.

    Auth Requests
    -------------
    This middleware does not directly JWT generation. Thus the user will need
    to get the JWT from the SAIL authentication system before making requests
    against Swift. However, in order to support existing Swift tools, calls
    made to the auth_prefix will assume the user has provided the JWT token
    as the key and will authenticate the JWT against the SAIL backend before
    returning it back to the user as a Swift token.

    Authenticationr requests are handled via ~SAILAuth.handle_auth~
    """

    def __init__(self, app, conf):
        self.app = app
        self.conf = conf
        self.logger = get_logger(conf, log_route='sailauth')

        # Grab the authentication URL which will be used to authenticate
        # user request
        self.auth_url = conf.get('auth_url', None)
        if self.auth_url is None:
            raise Exception('No authentication URL provided')

        # Prefix to request path which is associated with authentication
        # via user and key. This middleware doesn't directly handle
        # token generation however.
        self.auth_prefix = conf.get('auth_prefix', '/auth')


    def __call__(self, env, start_response):
        """
        Main entry point which is called by the WSGI server.

        Handles authentication using a JWT token that is passed into the
        request.

        :param env: The request environment populated by prior middleware
        :param start_response: The begining reponse information
        """
        # Check if the request even needs authentication
        if env.get('swift.authorization_override', False) or env.get('swift_owner', False):
            return self.app(env, start_response)

        # Handle a request against the auth prefix
        if env.get('PATH_INFO', '').startswith(self.auth_prefix):
            return self.handle_auth(env, start_response)

        # Make a request object for the environment
        req = Request(env)

        # Grab the token from the request and make sure it exists
        provided_token = self.get_token(env)
        if provided_token is None:
            return HTTPUnauthorized(request=req, body='No token provided')(env, start_response)

        # Make the request agains the SAIL authentication system
        if not self.authenticate_jwt(provided_token):
            return HTTPUnauthorized(request=req, body='Invalid token')(env, start_response)

        self.logger.info('Token Provided: {}'.format(provided_token))

        # Otherwise set the REMOTE_USER to the token and add in the
        # authroization handler
        env['REMOTE_USER'] = provided_token
        env['swift.authorize'] = self.authorize
        env['swift.clean_acl'] = clean_acl

        # Pass the request to the next middleware
        return self.app(env, start_response)

    def get_token(self, env):
        """
        Get the token from the request regardless if its a S3 requst or a plain
        Swift request.

        :param env: The request environment
        :return: The token (JWT) as a string or None if no token was provided
        """
        # First see if its an S3 request
        s3 = env.get('s3api.auth_details', None)
        if s3:
            return env.get('HTTP_SAIL_JWT', None)

        # Otherwise check for a normal Swift request
        return env.get('HTTP_X_AUTH_TOKEN', None)

    def get_account(self, env):
        """ In the future, this will be based on JWT """
        return 'test'

    def handle_auth(self, env, start_response):
        """
        Handles authentication requests, will authenticate the key provided
        is a valid JWT against the SAIL auth system then will return that
        value as a token
        """
        # Make a request object for the environment
        req = Request(env)

        # Grab the key from the request and make sure it exists
        provided_key = env.get('HTTP_X_AUTH_KEY', None)
        if provided_key is None:
            self.logger.info('Failed to provide key')
            return HTTPUnauthorized(request=req, body='No key provided')(env, start_response)

        # Make the request agains the SAIL authentication system
        self.logger.info('Validating token: {}'.format(provided_key))
        if not self.authenticate_jwt(provided_key):
            self.logger.info('Provided invalid or expired key')
            return HTTPUnauthorized(request=req, body='Invalid key')(env, start_response)

        account = self.get_account(env )

        # JWT was authenticated, now return the key as a token
        # TODO: Grab expiration time from JWT
        # TODO: Get correct storage URL
        response = Response(request=req, headers={
            'x-auth-token': provided_key,
            'x-storage-token': provided_key,
            'x-auth-token-expires': '86400',
            'x-storage-url': 'http://127.0.0.1:8080/v1/{}'.format(account),
        })
        req.response = response
        return req.response(env, start_response)

    def authenticate_jwt(self, token):
        """
        Check to see if the JWT is valid

        :returns: True if the JWT is valid, false otherwise
        :rtype: boolean
        """
        query = 'query { authenticate }'
        headers = { 'Authorization': 'Bearer {}'.format(token) }
        try:
            response = requests.post(self.auth_url, json={'query': query}, headers=headers).json()

            # Handle when the request went through and data was provided
            if response['data'] is not None:
                # Make sure the payload matches what is expected
                if response['data']['authenticate']:
                    return True
                else:
                    self.logger.error('Unexpected response data on authenticate: {}'.format(response['data']))
                    return False
            # Handle when an error message is present on the payload
            return False

        except Exception as e:
            self.logger.error('Failed authentication request with error: {}'.format(e))
            return False

    def get_updated_path(self, path, account):
        parts = path.split('/')
        if len(parts) > 2:
            parts[2] = account
        return '/'.join(parts)

    def get_resource_request(self, req):
        """
        Construct the resource request that is being made. This is in a format
        that can be ingested by the authorization backend.
        """
        target_resource = req.swift_entity_path.split('/')
        resource = {
            'account': None,
            'bucket': None,
            'object': None,
            'method': req.method
        }

        resource['account'] = target_resource[1]
        if len(target_resource) > 2:
            resource['bucket'] = target_resource[2]
        if len(target_resource) > 3:
            resource['object'] = '/'.join(target_resource[3:])
        return resource

    def make_authorize_request(self, req, token):
        """
        Make a request to the authorization backend to see if the request is
        authorized.
        """
        resource_req = self.get_resource_request(req)

        try:
            query = 'query authorize($resource: ResourceRequest!) { authorize(resource: $resource) }'
            variables = {
                'resource': resource_req
            }
            headers = { 'Authorization': 'Bearer {}'.format(token) }

            r = requests.post(self.auth_url, json={'query': query, 'variables': variables}, headers=headers)
            return r.json()['data']['authorize']
        except Exception as e:
            self.logger.error('Failed to authorize against backend')
            self.logger.error(e)
        return False


    def authorize(self, req):
        """
        Check to see if the user is authorized to access the given resource
        """
        # Get the token from the request
        token = self.get_token(req.environ)
        if token is None:
            return HTTPUnauthorized(request=req, body='No token provided')

        # TODO: When evaulating how to handle accounts, update this
        # req.environ['PATH_INFO'] = self.get_updated_path(req.environ['PATH_INFO'], self.get_account(req.environ))

        if not self.make_authorize_request(req, token):
            return HTTPUnauthorized(request=req, body='Unauthorized')

        self.logger.info('Authorization token: {}'.format(token))
        return None



def filter_factory(global_conf, **local_conf):
    """ Factory for exposing the middleware """
    conf = global_conf.copy()
    conf.update(local_conf)
    register_swift_info('nistauth', account_acls=False)
    def auth_filter(app):
        return SAILAuth(app, conf)
    return auth_filter
