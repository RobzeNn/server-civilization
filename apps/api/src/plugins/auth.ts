import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyRequest } from 'fastify';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      citizenId: string;
      civilizationId: string;
      discordUserId: string;
    };
  }
}

interface AuthPluginOptions {
  publicRoutes: Set<string>;
}

const authPlugin: FastifyPluginAsync<AuthPluginOptions> = async (app, options) => {
  app.addHook('onRequest', async (request: FastifyRequest, reply) => {
    const routePath = request.routeOptions.url ?? '';
    if (options.publicRoutes.has(routePath)) {
      return;
    }
    try {
      await request.jwtVerify();
    } catch {
      void reply.status(401).send({ error: 'Unauthorized' });
    }
  });
};

export default fp(authPlugin, { name: 'authPlugin' });
