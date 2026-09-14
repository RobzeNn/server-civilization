import { describe, expect, it } from 'vitest';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DISCORD_BOT_TOKEN: z.string().min(1),
});

describe('bot env', () => {
  it('requires a bot token', () => {
    const result = envSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('accepts a valid environment', () => {
    const result = envSchema.safeParse({ DISCORD_BOT_TOKEN: 'test-token' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.DISCORD_BOT_TOKEN).toBe('test-token');
      expect(result.data.NODE_ENV).toBe('development');
    }
  });
});
