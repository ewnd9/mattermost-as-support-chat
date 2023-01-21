import { FastifyInstance } from 'fastify';
import WebSocket from 'ws';

import { env } from './config';
import { mapMattermostPost } from './mappers/map-mattermost-user';

// https://github.com/fastify/fastify-websocket#readme
export function createWebsocketProxyPlugin() {
  return async function (server: FastifyInstance) {
    server.get('/websocket', { websocket: true }, (connection, req) => {
      const ws = new WebSocket(env.MATTERMOST_WEBSOCKET, {
        headers: {
          cookie: req.headers.cookie,
        }
      });

      connection.socket.on('close', () => {
        ws.close();
      });

      ws.on('message', (data) => {
        try {
          const dataStr = data.toString();
          const json = JSON.parse(dataStr);

          if (json.event === 'posted') {
            const newPost = JSON.parse(json.data.post);
            connection.socket.send(JSON.stringify({
              type: 'new-post',
              post: mapMattermostPost(newPost)
            }));
          } else {
            server.log.info('ignoring event', json.event);
          }
        } catch (err) {
          server.log.error(err);
        }
      });
    })
  }
}

