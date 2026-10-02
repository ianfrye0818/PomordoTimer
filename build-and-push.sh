#!/bin/bash
# VERSION (tag) is REQUIRED - no default to prevent accidental production pushes
DOCKER_LOGIN='ianfrye'
PREV_RELEASE_VERSION=$(cat previous_release_version.txt)
APP_NAME='pomodoro-timer'

# READ RELEASE VERSION FROM package.json
RELEASE_VERSION=$(cat package.json | grep -o '"version": "[^"]*"' | cut -d'"' -f4)

#exit if there are errors
set -e

if [[ -z "$RELEASE_VERSION" ]]; then
  echo "ERROR: Please set a release version in package.json and try again."
  exit 1
fi

if [[ -z "$PREV_RELEASE_VERSION" ]]; then
  echo $RELEASE_VERSION >previous_release_version.txt
  echo "Previous release version set to $RELEASE_VERSION"
fi

# If the prev release version is the same as the current release version throw an error
if [[ "$PREV_RELEASE_VERSION" == "$RELEASE_VERSION" ]]; then
  echo "ERROR: Previous release version of "$PREV_RELEASE_VERSION" and current release version of "$RELEASE_VERSION" are the same. Please increment the release version in package.json and try again."
  exit 1
fi

# Show usage if help is requested
if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
  echo "Usage: $0 <TAG>"
  echo "  TAG: Docker image tag (REQUIRED - e.g. test, prod, v2.6.9)"
  echo ""
  echo "Examples:"
  echo "  $0 test            # Build and push to test"
  echo "  $0 prod            # Build and push to production"
  echo "  $0 v2.6.9          # Build and push with version v2.6.9"
  exit 0
fi

# Require tag to prevent accidental production pushes
if [[ -z "$1" ]]; then
  echo "Error: TAG is required. Specify the target tag (e.g. test, prod)."
  echo ""
  echo "Usage: $0 <TAG>"
  echo "  Run '$0 --help' for more information."
  exit 1
fi

VERSION="$1"

echo "Starting Build Process"

echo "Building and pushing $APP_NAME..."
docker buildx build --platform linux/amd64 --load -f ./dockerfile -t $DOCKER_LOGIN/$APP_NAME:$VERSION .
docker push $DOCKER_LOGIN/$APP_NAME:$VERSION
docker tag $DOCKER_LOGIN/$APP_NAME:$VERSION $DOCKER_LOGIN/$APP_NAME:$RELEASE_VERSION
docker push $DOCKER_LOGIN/$APP_NAME:$RELEASE_VERSION
echo "$APP_NAME built and pushed successfully"

#clear the cache
docker buildx prune -af
docker image prune -af

# Update the previous release version to the current release version
echo $RELEASE_VERSION >previous_release_version.txt

echo "Cache cleared successfully"
echo "Build and push process completed successfully"
