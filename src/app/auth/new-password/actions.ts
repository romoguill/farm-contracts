'use server';

import { passwordResetSession, session, user } from '@/db/schema';
import {
  deletePasswordResetSessionTokenCookie,
  getCurrentPasswordResetSession,
  HASHING_OPTIONS,
  lucia,
} from '@/lib/auth';
import { db } from '@/lib/dbClient';
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function changePassword(newPassword: string) {
  const resetSession = await getCurrentPasswordResetSession();

  if (!resetSession) {
    return { error: 'Not authenticated' };
  }

  if (!resetSession.emailVerified) {
    return { error: 'Code not verified' };
  }

  const passwordHashed = await hash(newPassword, HASHING_OPTIONS);

  // Update password in db
  await db
    .update(user)
    .set({
      passwordHashed,
    })
    .where(eq(user.id, resetSession.userId));

  // Remove special session for recovery from db
  await db
    .delete(passwordResetSession)
    .where(eq(passwordResetSession.userId, resetSession.userId));

  // Remove just in case main sessions from db
  await db.delete(session).where(eq(session.userId, resetSession.userId));

  // After password change directly login user
  const newSession = await lucia.createSession(resetSession.userId, {});
  const sessionCookie = lucia.createSessionCookie(newSession.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  // Delete special recovery session cookie
  deletePasswordResetSessionTokenCookie();

  return { error: null };
}
