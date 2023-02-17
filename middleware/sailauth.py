from swift.common.swob import HTTPUnauthorized, Request, Response
from swift.common.utils import get_logger, register_swift_info


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
        self.authentication_url = conf.get('authentication_url', None)
        if self.authentication_url is None:
            raise Exception('No authentication URL provided')

        # Grab the authorization URL which will be use to check if the user
        # is authorized to perform the requested action
        self.authorization_url = conf.get('authorization_url', None)
        if self.authorization_url is None:
            raise Exception('No authorization URL provided')

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
        provided_token = req.headers.get('x-auth-token', None)
        if provided_token is None:
            return HTTPUnauthorized(request=req, body='No token provided')(env, start_response)

        # Make the request agains the SAIL authentication system
        if not self.authenticate_jwt(provided_token):
            return HTTPUnauthorized(request=req, body='Invalid token')(env, start_response)

        # Otherwise set the REMOTE_USER to the token and add in the
        # authroization handler
        env['REMOTE_USER'] = provided_token
        env['swift.authorize'] = self.authorize

        # Pass the request to the next middleware
        return self.app(env, start_response)


    def handle_auth(self, env, start_response):
        """
        Handles authentication requests, will authenticate the key provided
        is a valid JWT against the SAIL auth system then will return that
        value as a token
        """
        # Make a request object for the environment
        req = Request(env)

        # Grab the key from the request and make sure it exists
        provided_key = req.headers.get('x-auth-key', None)
        if provided_key is None:
            self.logger.info('Failed to provide key')
            return HTTPUnauthorized(request=req, body='No key provided')(env, start_response)

        # Make the request agains the SAIL authentication system
        self.logger.info('Validating token: {}'.format(provided_key))
        if not self.authenticate_jwt(provided_key):
            self.logger.info('Provided invalid or expired key')
            return HTTPUnauthorized(request=req, body='Invalid key')(env, start_response)

        # JWT was authenticated, now return the key as a token
        # TODO: Grab expiration time from JWT
        # TODO: Get correct storage URL
        response = Response(request=req, headers={
            'x-auth-token': provided_key,
            'x-storage-token': provided_key,
            'x-auth-token-expires': '86400',
            'x-storage-url': 'http://127.0.0.1:12345/v1/AUTH_{}'.format(provided_key),
        })
        req.response = response
        return req.response(env, start_response)

    def authenticate_jwt(self, token):
        """
        Check to see if the JWT is valid

        :returns: True if the JWT is valid, false otherwise
        :rtype: boolean
        """
        return True

    def authorize(self, req):
        """
        Check to see if the user is authorized to access the given resource
        """
        # Get the token from the request
        token = req.headers.get('x-auth-token', None)
        if token is None:
            return HTTPUnauthorized(request=req, body='No token provided')
        self.logger.info('Authorization token: {}'.format(token))
        return None



def filter_factory(global_conf, **local_conf):
    """ Factory for exposing the middleware """
    conf = global_conf.copy()
    conf.update(local_conf)
    register_swift_info('nistauth', account_acls=True)
    def auth_filter(app):
        return SAILAuth(app, conf)
    return auth_filter
