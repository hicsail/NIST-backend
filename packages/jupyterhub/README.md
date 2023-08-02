# NIST JupyterHub

## Introduction

This folder contains the needed logic for running a custom deployment of
JupyterHub. The deployment sets up access for the NIST backend to act as
a service account, this allowing the NIST backend to manage user Jupyter
Notebook servers. Additionally, the custom deployment contains code for a
JupyterHub spawner that creates Jupyter Notebook instances in containers with
a provided file already included in the instance

For information on the settings the instance is running with, refer to
`./jupyterhub_config.py`.

## Development Instructions

1. Create network

```bash
docker network create jupyterhub
```

2. Create volume

```bash
docker volume create jupyterhub
```

3. Build Docker Image

```bash
docker build -t hub . --no-cache
```

4. Run the deployment

```bash
docker run --rm -it \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v jupyterhub:/srv/jupyterhub \
  --net jupyterhub \
  --name jupyterhub \
  -p8000:8000\
  hub
```
