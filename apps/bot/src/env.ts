import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DISCORD_BOT_TOKEN: z.string().min(1),
});

export const env = envSchema.parse(process.env);
