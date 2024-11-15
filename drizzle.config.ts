import { defineConfig } from 'drizzle-kit';

// Kind of hack for the way I setup the migrations in deploy workflow. In production envs will be already set and dotenv will no be installed
if (
  !process.env.POSTGRES_DB ||
  !process.env.POSTGRES_HOSTADDR ||
  !process.env.POSTGRES_USER ||
  !process.env.POSTGRES_PASSWORD ||
  !process.env.POSTGRES_PORT
) {
  import('dotenv').then((dotenv) => {
    dotenv.config({
      path: './.env.local',
    });
  });
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    database: process.env.POSTGRES_DB!,
    host: process.env.POSTGRES_HOSTADDR!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    port: Number(process.env.POSTGRES_PORT!),
    ssl: false,
  },
});
