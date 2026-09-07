import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
export default defineConfig({
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: process.env.DATABASE_NAME!,
    password: process.env.DATABASE_PWD!,
    database: 'nextjs',
    ssl: false,
  },
  verbose: true,
  strict: true,
});
