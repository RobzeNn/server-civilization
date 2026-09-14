import dotenv from 'dotenv';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

dotenv.config({ path: ['../../.env', './.env'] });
import { db } from './index.js';

async function main() {
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations complete');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed', err);
  process.exit(1);
});
