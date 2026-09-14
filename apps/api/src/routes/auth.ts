import type { FastifyPluginAsync } from 'fastify';
import { discordAuthRequestSchema, authResponseSchema, userSchema } from '@server-civilization/shared';
import { env } from '../env.js';
import {
  exchangeCode,
  fetchDiscordGuilds,
  fetchDiscordUser,
  makeAvatarUrl,
} from '../services/discord.js';
import { findOrCreateCivilizationAndCitizen } from '../services/civilization.js';
import { formatCitizen } from '../serialization.js';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/discord', async (request, reply) => {
    const body = discordAuthRequestSchema.parse(request.body);

    const token = await exchangeCode(
      body.code,
      body.redirectUri,
      env.DISCORD_CLIENT_ID,
      env.DISCORD_CLIENT_SECRET,
    );

    const [discordUser, guilds] = await Promise.all([
      fetchDiscordUser(token.access_token),
      fetchDiscordGuilds(token.access_token),
    ]);

    const guild = guilds.find((g) => g.id === body.guildId);
    if (!guild) {
      return reply.status(403).send({ error: 'You are not a member of this server' });
    }

    const displayName = discordUser.global_name ?? discordUser.username;
    const avatarUrl = makeAvatarUrl(discordUser.id, discordUser.avatar);

    const context = await findOrCreateCivilizationAndCitizen({
      discordGuildId: guild.id,
      guildName: guild.name,
      discordUserId: discordUser.id,
      displayName,
      avatarUrl,
    });

    const jwtToken = app.jwt.sign(
      {
        citizenId: context.citizen.id,
        civilizationId: context.civilization.id,
        discordUserId: context.citizen.discordUserId,
      },
      { expiresIn: '7d' },
    );

    const userDto = userSchema.parse({
      id: context.citizen.id,
      discordUserId: context.citizen.discordUserId,
      displayName: context.citizen.displayName,
      avatarUrl: context.citizen.avatarUrl,
    });

    return authResponseSchema.parse({
      token: jwtToken,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
      citizen: formatCitizen(context.citizen),
      user: userDto,
    });
  });
};

export default authRoutes;
