import { drizzle } from 'drizzle-orm/node-postgres';
import { Client, Pool } from 'pg';
import * as schema from '../db/schema';
import { ExtractTablesWithRelations } from 'drizzle-orm';

// or
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  ssl: process.env.NODE_ENV === 'production',
});

export const db = drizzle(pool, { schema });

type TablesWithRealtions = ExtractTablesWithRelations<typeof schema>;

type a = Parameters<(typeof db)['query']['contract']['findFirst']>[0];
type b = NonNullable<a>;

export type ContractView = BuildQueryResult<
  TablesWithRealtions,
  TablesWithRealtions['contract'],
  { parcel: true }
>;
