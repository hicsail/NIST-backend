# Swift Auth Middleware

## Summary

This folder contains the code for a custom authentication middleware. The
middleware is a WSGI filter which can be added into the Swift pipeline. The
authentication supports both base Swift authentication as well as the S3
support. Authentication takes place against the NIST backend.

## Development Notes

The Swift middleware still requires Python 2.7

## Building and Installing

1. With a Python 2.7 environment, install the required packages

```bash
pip install -r requirements.txt
```

2. Build the distribution egg

```bash
python setup.py bdist_egg
```

3. Copy the egg to the Swift distribution and install the egg

```bash
python -m easy_install sailauth-X.X.X-py2.7.egg
```

4. Update the Swift proxy config adding the custom auth to the pipeline

```bash
vim /etc/swift/proxy-server.conf
```

Add the following, note depending on the specific pipeline, the pipeline
may have slightly different components. The important part is if S3
compatibility is included that the custom auth comes after the S3 pipeline
element.

```
pipeline = catch_errors gatekeeper healthcheck proxy-logging cache swift3 bulk tempurl slo dlo ratelimit crossdomain sailauth staticweb container-quotas account-quotas proxy-logging proxy-server
```

Then add the filter config for the custom auth.

```
[filter:sailauth]
use = egg:sailauth#sailauth
authentication_url=<authentication endpoint>
authorization_url=<authorization endpoint>
```

:warning: The `authentication_url` and `authorization_url` are not used yet

5. Restart the proxy service

```bash
service swift-proxy restart
```
