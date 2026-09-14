import { and, eq } from 'drizzle-orm';
import { citizens, civilizations, db, resources } from '@server-civilization/db';
import { civilizationNameFromGuild } from '@server-civilization/game-core';

export interface CivilizationContext {
  civilization: typeof civilizations.$inferSelect;
  resources: typeof resources.$inferSelect;
  citizen: typeof citizens.$inferSelect;
}

export async function findOrCreateCivilizationAndCitizen(input: {
  discordGuildId: string;
  guildName: string;
  discordUserId: string;
  displayName: string;
  avatarUrl: string;
}): Promise<CivilizationContext> {
  return db.transaction(async (tx) => {
    let [civilization] = await tx
      .select()
      .from(civilizations)
      .where(eq(civilizations.discordGuildId, input.discordGuildId));

    if (!civilization) {
      [civilization] = await tx
        .insert(civilizations)
        .values({
          discordGuildId: input.discordGuildId,
          name: civilizationNameFromGuild(input.guildName),
        })
        .returning();

      await tx.insert(resources).values({ civilizationId: civilization.id });
    }

    const [resourceRow] = await tx
      .select()
      .from(resources)
      .where(eq(resources.civilizationId, civilization.id));

    if (!resourceRow) {
      throw new Error('Resources row missing for civilization');
    }

    let [citizen] = await tx
      .select()
      .from(citizens)
      .where(
        and(
          eq(citizens.civilizationId, civilization.id),
          eq(citizens.discordUserId, input.discordUserId),
        ),
      );

    if (!citizen) {
      [citizen] = await tx
        .insert(citizens)
        .values({
          civilizationId: civilization.id,
          discordUserId: input.discordUserId,
          displayName: input.displayName,
          avatarUrl: input.avatarUrl,
        })
        .returning();

      const population = await tx.$count(
        citizens,
        eq(citizens.civilizationId, civilization.id),
      );
      await tx
        .update(resources)
        .set({ population })
        .where(eq(resources.civilizationId, civilization.id));
      resourceRow.population = population;
    }

    return { civilization, resources: resourceRow, citizen };
  });
}

export async function getCivilizationWithResources(civilizationId: string) {
  const [civilization] = await db
    .select()
    .from(civilizations)
    .where(eq(civilizations.id, civilizationId));

  if (!civilization) {
    return null;
  }

  const [resourceRow] = await db
    .select()
    .from(resources)
    .where(eq(resources.civilizationId, civilization.id));

  if (!resourceRow) {
    throw new Error('Resources row missing for civilization');
  }

  return { ...civilization, resources: resourceRow };
}

export async function getCitizensForCivilization(civilizationId: string) {
  return db
    .select()
    .from(citizens)
    .where(eq(citizens.civilizationId, civilizationId))
    .orderBy(citizens.createdAt);
}
