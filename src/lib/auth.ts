import { Lucia } from 'lucia';
import { db } from './dbClient';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { session, user } from '@/db/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, session, user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
  }
}
