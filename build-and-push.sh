#!/bin/bash
set -o allexport
source .env
set +o allexport

# Exit if there are errors
set -e

echo "Starting Build Process"

# Build and push the container
echo "Building Container"
docker buildx build --platform linux/amd64,linux/arm64 -t $DOCKER_LOGIN/$CONTAINER_NAME:$VERSION . --no-cache
echo "Container built successfully"
docker push $DOCKER_LOGIN/$CONTAINER_NAME:$VERSION
echo "Container pushed successfully"

# Clear the cache
docker image prune --all --force
docker buildx prune --all --force

echo "Cache cleared successfully"
echo "Build and push process completed successfully"
