import fastify from 'fastify';
import metricsPlugin from 'fastify-metrics';

import { env } from './config';

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
