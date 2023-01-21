import fastify from 'fastify';
import metricsPlugin from 'fastify-metrics';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import websocketPlugin from '@fastify/websocket';

import { env } from './config';
import { appRouter } from './trpc/routes';
import { createContext } from './trpc/context';
import { createWebsocketProxyPlugin } from './websocket-proxy';

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
  await server.register(websocketPlugin);
  await server.register(createWebsocketProxyPlugin());

  server.get('/', async () => {
    return 'ok\n';
  });

  server.listen({ port: env.PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      server.log.error(err)
      process.exit(1);
    }
  });
}
