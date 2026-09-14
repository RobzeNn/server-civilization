import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';

dotenv.config({ path: ['../../.env', './.env'] });
import { Pool } from 'pg';
import * as schema from './schema.js';

const pool = new Pool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? 'server_civilization',
  password: process.env.DB_PASSWORD ?? 'server_civilization',
  database: process.env.DB_NAME ?? 'server_civilization',
});

export const db = drizzle(pool, { schema });

export * from './schema.js';

export async function closeDb(): Promise<void> {
  await pool.end();
}
