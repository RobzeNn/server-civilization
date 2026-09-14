import 'dotenv/config';
import { buildApp } from './app.js';
import { env } from './env.js';

async function main() {
  const app = await buildApp();
  await app.listen({ host: '0.0.0.0', port: Number(env.PORT) });
  app.log.info(`API listening on port ${env.PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
