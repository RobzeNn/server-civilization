import { randomUUID } from 'crypto';

// ---------------------------------------------------------------------------
// Domain models
// ---------------------------------------------------------------------------

export interface Resources {
  food: number;
  wood: number;
  stone: number;
  gold: number;
  population: number;
}

export interface Civilization {
  id: string;
  discordGuildId: string;
  name: string;
  currentDay: number;
  createdAt: Date;
  updatedAt: Date;
  resources: Resources;
  citizens: Citizen[];
}

export interface Citizen {
  id: string;
  civilizationId: string;
  discordUserId: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Building {
  id: string;
  civilizationId: string;
  type: string;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

export type GameAction =
  | { type: 'gather'; resource: keyof Omit<Resources, 'population'> }
  | { type: 'build'; buildingType: string }
  | { type: 'elect'; candidateId: string };

export type GameEvent =
  | { type: 'resourceChanged'; resource: keyof Resources; amount: number }
  | { type: 'buildingConstructed'; buildingType: string }
  | { type: 'disaster'; name: string };

// ---------------------------------------------------------------------------
// Pure functions
// ---------------------------------------------------------------------------

export function createInitialResources(): Resources {
  return {
    food: 100,
    wood: 100,
    stone: 50,
    gold: 0,
    population: 1,
  };
}

export function createCivilization(input: {
  id?: string;
  discordGuildId: string;
  name: string;
  now?: Date;
}): Civilization {
  const now = input.now ?? new Date();
  return {
    id: input.id ?? randomUUID(),
    discordGuildId: input.discordGuildId,
    name: input.name,
    currentDay: 1,
    createdAt: now,
    updatedAt: now,
    resources: createInitialResources(),
    citizens: [],
  };
}

export function createCitizen(input: {
  id?: string;
  civilizationId: string;
  discordUserId: string;
  displayName: string;
  now?: Date;
}): Citizen {
  const now = input.now ?? new Date();
  return {
    id: input.id ?? randomUUID(),
    civilizationId: input.civilizationId,
    discordUserId: input.discordUserId,
    displayName: input.displayName,
    createdAt: now,
    updatedAt: now,
  };
}

export function addCitizen(civilization: Civilization, citizen: Citizen): Civilization {
  if (civilization.citizens.some((c) => c.discordUserId === citizen.discordUserId)) {
    return civilization;
  }
  return {
    ...civilization,
    updatedAt: citizen.createdAt,
    citizens: [...civilization.citizens, citizen],
    resources: {
      ...civilization.resources,
      population: civilization.resources.population + 1,
    },
  };
}

export function civilizationNameFromGuild(guildName: string): string {
  const trimmed = guildName.trim();
  if (!trimmed) return 'Unnamed Civilization';
  return `${trimmed}'s Civilization`;
}
