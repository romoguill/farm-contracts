import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';

// or
const pool = new Pool({
  host: process.env.POSTGRES_HOSTADDR,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  ssl: false,
});

export const db = drizzle(pool, { schema });

// --- Drizzle, to my knowledge, doesn't have a clean way as Prisma to infer types of a query with relations. This could be a way to do it until implemented.
// type TablesWithRealtions = ExtractTablesWithRelations<typeof schema>;

// type a = Parameters<(typeof db)['query']['contract']['findFirst']>[0];
// type b = NonNullable<a>;

// export type ContractView = BuildQueryResult<
//   TablesWithRealtions,
//   TablesWithRealtions['contract'],
//   { parcel: true }
// >;
