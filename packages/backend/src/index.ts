import fastify from 'fastify';
import metricsPlugin from 'fastify-metrics';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { createProxyMiddleware } from 'http-proxy-middleware';
import expressMiddlewareSupportPlugin from '@fastify/express';

import { env } from './config';
import { appRouter } from './routes';
import { createContext } from './context';

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

async function main() {
  const server = fastify({
    logger: true,
  });
  await server.register(metricsPlugin, { endpoint: '/metrics' });
  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  });
  await server.register(expressMiddlewareSupportPlugin);

  server.get('/', async () => {
    return 'ok\n';
  });

  server.use('/websocket', createWebsocketProxyMiddleware());

  server.listen({ port: env.PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      server.log.error(err)
      process.exit(1);
    }
  });
}

function createWebsocketProxyMiddleware() {
  return createProxyMiddleware({
    target: env.MATTERMOST_HOST,
    ws: true,
    changeOrigin: true,
    pathRewrite: {
      '^/websocket': '/api/v4/websocket',
    },
    onProxyReq() {
      console.log('hereere');
    }
  });
}
