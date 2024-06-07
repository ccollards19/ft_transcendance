#!/bin/bash
# Prepare docker folder in goinfre
mkdir -p ~/goinfre/docker
rm -rf ~/Library/Containers/com.docker.docker
ln -s ~/goinfre/docker ~/Library/Containers/com.docker.docker
# Start docker daemon and wait until it's running
open --background -a Docker && while ! docker system info > /dev/null 2>&1; do sleep 1; done
