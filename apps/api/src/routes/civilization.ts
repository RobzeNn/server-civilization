import type { FastifyPluginAsync } from 'fastify';
import {
  getCitizensForCivilization,
  getCivilizationWithResources,
} from '../services/civilization.js';
import { formatCitizen, formatCivilizationResponse } from '../serialization.js';

const civilizationRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (request, reply) => {
    const payload = request.user;
    const result = await getCivilizationWithResources(payload.civilizationId);

    if (!result) {
      return reply.status(404).send({ error: 'Civilization not found' });
    }

    return formatCivilizationResponse(result, result.resources);
  });

  app.get('/citizens', async (request) => {
    const payload = request.user;
    const rows = await getCitizensForCivilization(payload.civilizationId);
    return rows.map(formatCitizen);
  });
};

export default civilizationRoutes;
