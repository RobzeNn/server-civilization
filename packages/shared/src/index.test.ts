import { describe, expect, it } from 'vitest';
import {
  authResponseSchema,
  civilizationResponseSchema,
  discordAuthRequestSchema,
  resourcesSchema,
} from './index.js';

describe('shared schemas', () => {
  it('validates a Discord auth request', () => {
    const result = discordAuthRequestSchema.safeParse({
      code: 'abc123',
      redirectUri: 'https://example.com/callback',
      guildId: '123456789012345678',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid Discord snowflake', () => {
    const result = discordAuthRequestSchema.safeParse({
      code: 'abc',
      redirectUri: 'https://example.com/callback',
      guildId: 'not-a-snowflake',
    });
    expect(result.success).toBe(false);
  });

  it('validates initial resources', () => {
    const result = resourcesSchema.safeParse({
      food: 100,
      wood: 100,
      stone: 50,
      gold: 0,
      population: 1,
    });
    expect(result.success).toBe(true);
  });

  it('validates a civilization response', () => {
    const result = civilizationResponseSchema.safeParse({
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      discordGuildId: '123456789012345678',
      name: "Server's Civilization",
      currentDay: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resources: { food: 100, wood: 100, stone: 50, gold: 0, population: 1 },
    });
    expect(result.success).toBe(true);
  });

  it('validates an auth response', () => {
    const result = authResponseSchema.safeParse({
      token: 'jwt',
      expiresAt: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });
});
