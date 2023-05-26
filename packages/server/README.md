# NIST Backend

## Introduction

The NIST Backend provides storage of organization information for the NIST-Racer project.

## Installation

```bash
$ npm install
```

## Running the app

The following environment variables are required to have the application run.

| Variable            | Purpose                                   | Sample Value                                      |
| ------------------- | ----------------------------------------- | ------------------------------------------------- |
| AUTH_PUBLIC_KEY_URL | URL to where the public key is accessible | `https://test-auth-service.sail.codes/public-key` |
| CARGO_URI           | URL to the GraphQL endpoint               | `https://cargo-staging.sail.codes/graphql`        |

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Building the App

A Dockerfile is provided to build the application. The application still requires a running instance of MongoDB. See the root level README for more information.
