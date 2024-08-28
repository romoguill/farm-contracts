import { Lucia } from 'lucia';
import { db } from './dbClient';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { session, user } from '@/db/schema';
import { Google } from 'arctic';

const adapter = new DrizzlePostgreSQLAdapter(db, session, user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes(attributes) {
    return {
      googleId: attributes.google_id,
      username: attributes.username,
    };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  google_id: number;
  username: string;
}

// OAUTH
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URL!
);
