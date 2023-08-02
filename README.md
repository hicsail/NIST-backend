# NIST

## Introduction

The NIST-Racer project is an effort to provide a platform for working on the COVID-19 Antigen across many research groups. This code base contains the server logic for providing the shared data backbone.

## Project Structure

| Name            | Path                  | Purpose                               |
| --------------- | --------------------- | ------------------------------------- |
| NIST-Backend    | `packages/server`     | NIST backend and project data storage |
| NIST-Gateway    | `packages/gateway`    | NIST gateway for GraphQL interface    |
| NIST-JupyterHub | `packages/jupyterhub` | NIST Deployment of JupyterHub

## Running the Application

The NIST-Backend and NIST-Gateway each have their own Dockerfile, refer to each corresponding package directory for further information. Two Docker compose files are provided, one for production, the other for staging. Both will run the NIST-Backend, NIST-Gateway, and MongoDB instance. Environment variables are loaded from a file `stack.env`.
