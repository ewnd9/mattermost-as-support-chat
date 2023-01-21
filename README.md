# `mattermost-as-support-chat`

Custom UI implementation for mattermost

## Install

```sh
$ yarn install
```

## Usage

```sh
$ yarn start:dev
$ ./scripts/start-mattermost.sh
```

## Production

```sh
$ yarn build
$ docker-compose up --build
# http://localhost:8065 - mattermost
# http://localhost:8080 - our frontend
```
