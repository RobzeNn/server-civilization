import type { CitizenRow, CivilizationRow, ResourceRow } from '@server-civilization/db';
import {
  citizenSchema,
  civilizationResponseSchema,
  type Citizen,
  type CivilizationResponse,
} from '@server-civilization/shared';

export function formatCitizen(row: CitizenRow): Citizen {
  return citizenSchema.parse({
    id: row.id,
    civilizationId: row.civilizationId,
    discordUserId: row.discordUserId,
    displayName: row.displayName,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

export function formatCivilizationResponse(
  civilization: CivilizationRow,
  resources: ResourceRow,
): CivilizationResponse {
  return civilizationResponseSchema.parse({
    id: civilization.id,
    discordGuildId: civilization.discordGuildId,
    name: civilization.name,
    currentDay: civilization.currentDay,
    createdAt: civilization.createdAt.toISOString(),
    updatedAt: civilization.updatedAt.toISOString(),
    resources: {
      food: resources.food,
      wood: resources.wood,
      stone: resources.stone,
      gold: resources.gold,
      population: resources.population,
    },
  });
}
