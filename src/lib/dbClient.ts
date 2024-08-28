import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

// or
const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === 'production',
});

await client.connect();

export const db = drizzle(client);
