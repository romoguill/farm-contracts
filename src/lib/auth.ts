import { Lucia, Session, User } from 'lucia';
import { db } from './dbClient';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { emailVerificationCode, session, user } from '@/db/schema';
import { Google } from 'arctic';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { TimeSpan, createDate } from 'oslo';
import { generateRandomString, alphabet } from 'oslo/crypto';

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
      email: attributes.email,
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
  email: string;
}

// HASHING OPTIONS
export const HASHING_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

// OAUTH
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URL!
);

// AUTH GUARD FOR SERVER STUFF
export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}
    return result;
  }
);

// EMAIL CODE GENERATOR
export async function generateEmailVerificationCode(
  userId: string,
  email: string
): Promise<string> {
  // Delete previous generated codes, only one valid per user
  await db
    .delete(emailVerificationCode)
    .where(eq(emailVerificationCode.userId, userId));

  const code = generateRandomString(8, alphabet('0-9'));
  await db.insert(emailVerificationCode).values({
    userId,
    email,
    code,
    expiresAt: createDate(new TimeSpan(15, 'm')),
  });

  return code;
}
