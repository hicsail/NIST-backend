from setuptools import setup, find_packages


setup(
    name='sailauth',
    version='0.1.0',
    description='Custom authentication middleware for the NIST system',
    py_modules=['sailauth'],
    packages=find_packages(),
    entry_points={
        'paste.filter_factory': [
            'sailauth = sailauth:filter_factory',
        ]
    }
)
