import { z } from 'zod';

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export const uuidSchema = z.string().uuid();

export const snowflakeSchema = z
  .string()
  .min(16)
  .regex(/^\d+$/, 'Expected a Discord snowflake');

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const discordAuthRequestSchema = z.object({
  code: z.string().min(1),
  redirectUri: z.string().url(),
  guildId: snowflakeSchema,
  channelId: snowflakeSchema.optional(),
});

export type DiscordAuthRequest = z.infer<typeof discordAuthRequestSchema>;

export const authResponseSchema = z.object({
  token: z.string(),
  expiresAt: z.string().datetime(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

// ---------------------------------------------------------------------------
// User / Citizen
// ---------------------------------------------------------------------------

export const userSchema = z.object({
  id: uuidSchema,
  discordUserId: snowflakeSchema,
  displayName: z.string().min(1),
  avatarUrl: z.string().url().nullable(),
});

export type User = z.infer<typeof userSchema>;

export const citizenSchema = z.object({
  id: uuidSchema,
  civilizationId: uuidSchema,
  discordUserId: snowflakeSchema,
  displayName: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Citizen = z.infer<typeof citizenSchema>;

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

export const resourcesSchema = z.object({
  food: z.number().int().min(0),
  wood: z.number().int().min(0),
  stone: z.number().int().min(0),
  gold: z.number().int().min(0),
  population: z.number().int().min(0),
});

export type Resources = z.infer<typeof resourcesSchema>;

export const resourcesResponseSchema = resourcesSchema;
export type ResourcesResponse = Resources;

// ---------------------------------------------------------------------------
// Civilization
// ---------------------------------------------------------------------------

export const civilizationSchema = z.object({
  id: uuidSchema,
  discordGuildId: snowflakeSchema,
  name: z.string().min(1),
  currentDay: z.number().int().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Civilization = z.infer<typeof civilizationSchema>;

export const civilizationResponseSchema = civilizationSchema.extend({
  resources: resourcesResponseSchema,
});

export type CivilizationResponse = z.infer<typeof civilizationResponseSchema>;

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  version: z.string(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
