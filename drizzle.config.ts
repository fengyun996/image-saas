import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
export default defineConfig({
  schema: './src/server/db/schema.ts',
  driver: 'pg',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: process.env.DATABASE_NAME!,
    password: process.env.DATABASE_PWD!,
    database: 'nextjs',
  },
  verbose: true,
  strict: true,
});
