import { eq } from 'drizzle-orm';
import { citizens, db } from '@server-civilization/db';
import { userSchema } from '@server-civilization/shared';
import type { FastifyPluginAsync } from 'fastify';
import { formatCitizen } from '../serialization.js';

const meRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (request, reply) => {
    const payload = request.user;

    const [citizen] = await db
      .select()
      .from(citizens)
      .where(eq(citizens.id, payload.citizenId));

    if (!citizen) {
      return reply.status(404).send({ error: 'Citizen not found' });
    }

    const user = userSchema.parse({
      id: citizen.id,
      discordUserId: citizen.discordUserId,
      displayName: citizen.displayName,
      avatarUrl: citizen.avatarUrl,
    });

    return {
      user,
      citizen: formatCitizen(citizen),
    };
  });
};

export default meRoutes;
