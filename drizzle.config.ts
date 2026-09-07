import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
export default defineConfig({
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_NAME!,
    password: process.env.DATABASE_PWD!,
    database: 'nextjs',
    ssl: false,
  },
  verbose: true,
  strict: true,
});
