import dotenv from 'dotenv';
dotenv.config({
  path: './.env.local',
});

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    database: process.env.POSTGRES_DB!,
    host: process.env.POSTGRES_HOST!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    port: Number(process.env.POSTGRES_PORT!),
    ssl: process.env.NODE_ENV === 'production' ? true : false,
  },
});
