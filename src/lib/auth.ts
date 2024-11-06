import { Lucia, Session, User } from 'lucia';
import { db } from './dbClient';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import {
  emailVerificationCode,
  passwordResetSession,
  session,
  user,
} from '@/db/schema';
import { Google } from 'arctic';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { TimeSpan, createDate } from 'oslo';
import { generateRandomString, alphabet, sha256 } from 'oslo/crypto';
import { encodeHex, Base32Encoding } from 'oslo/encoding';

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
      email: attributes.email,
      name: attributes.name,
      username: attributes.username,
      googleId: attributes.google_id,
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
  name: string;
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

    let result:
      | {
          user: User;
          session: Session;
        }
      | {
          user: null;
          session: null;
        } = { user: null, session: null };

    try {
      result = await lucia.validateSession(sessionId);
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

export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  const encoding32 = new Base32Encoding('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567');
  const token = encoding32.encode(tokenBytes);
  return token;
}

export async function createPasswordResetSession(
  token: string,
  userId: string,
  email: string
) {
  const sessionId = encodeHex(await sha256(new TextEncoder().encode(token)));

  const [session] = await db
    .insert(passwordResetSession)
    .values({
      id: sessionId,
      userId,
      email,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      code: generateRandomString(8, alphabet('0-9')),
      emailVerified: false,
    })
    .returning();

  return session;
}

export function setPasswordResetSessionTokenCookie(
  token: string,
  expiresAt: Date
): void {
  cookies().set('password_reset_session', token, {
    expires: expiresAt,
    sameSite: 'lax',
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
}

export function deletePasswordResetSessionTokenCookie(): void {
  cookies().set('password_reset_session', '', {
    maxAge: 0,
    sameSite: 'lax',
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
}

export const getCurrentPasswordResetSession = cache(async () => {
  const token = cookies().get('password_reset_session')?.value ?? null;
  if (token === null) {
    return null;
  }

  const sessionId = encodeHex(await sha256(new TextEncoder().encode(token)));

  const session = await db.query.passwordResetSession.findFirst({
    where: eq(passwordResetSession.id, sessionId),
  });

  return session;
});
