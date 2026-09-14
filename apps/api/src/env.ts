import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().regex(/^\d+$/).default('3001'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().regex(/^\d+$/).default('5432'),
  DB_USER: z.string().default('server_civilization'),
  DB_PASSWORD: z.string().default('server_civilization'),
  DB_NAME: z.string().default('server_civilization'),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),
  DISCORD_OAUTH_REDIRECT_URI: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  ACTIVITY_ALLOWED_ORIGINS: z.string().optional(),
});

export const env = envSchema.parse(process.env);
