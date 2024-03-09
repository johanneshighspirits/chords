import dotenv from 'dotenv';
dotenv.config({ path: '.env.development.local' });
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL || '',
  },
  verbose: true,
  strict: true,
});
