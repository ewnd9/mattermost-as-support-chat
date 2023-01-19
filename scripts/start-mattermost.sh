#!/bin/sh

docker run \
  --name mattermost-preview \
  --publish 8065:8065 \
  --volume $PWD/scripts/config.json:/mm/mattermost/config/config_docker.json \
  --volume $PWD/data:/mm/mattermost-data \
  mattermost/mattermost-preview
