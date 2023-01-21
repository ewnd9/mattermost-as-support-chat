# `mattermost-as-support-chat`

Custom UI implementation for mattermost

## Install

```sh
$ yarn install
```

## Usage

```sh
$ docker-compose up mattermost &
$ yarn start:dev # http://localhost:8080
```

## Production

```sh
$ yarn build
$ docker-compose up --build
# http://localhost:8065 - mattermost
# http://localhost:8080 - our frontend
```
