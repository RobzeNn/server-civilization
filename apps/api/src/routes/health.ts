import type { FastifyPluginAsync } from 'fastify';
import { env } from '../env.js';

const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async () => ({
    status: 'ok' as const,
    version: env.NODE_ENV === 'test' ? '0.1.0-test' : '0.1.0',
  }));
};

export default healthRoutes;
