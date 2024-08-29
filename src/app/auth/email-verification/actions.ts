'use server';

import { emailVerificationCode } from '@/db/schema';
import { lucia, validateRequest } from '@/lib/auth';
import { db } from '@/lib/dbClient';
import { eq } from 'drizzle-orm';
import { isWithinExpirationDate } from 'oslo';
import { user as userTable } from '../../../db/schema';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function emailVerification(code: string) {
  const { user } = await validateRequest();

  if (!user) {
    return { error: 'Invalid credentials' };
  }

  // Validate code sent and the one stored in DB
  const [storedCode] = await db
    .delete(emailVerificationCode)
    .where(eq(emailVerificationCode.userId, user.id))
    .returning({
      code: emailVerificationCode.code,
      expiresAt: emailVerificationCode.expiresAt,
      email: emailVerificationCode.email,
    });

  if (!storedCode) {
    return { error: 'User has no code associated' };
  }

  if (storedCode.code !== code) {
    return { error: 'Invalid code' };
  }

  if (!isWithinExpirationDate(storedCode.expiresAt)) {
    return { error: 'Code expired' };
  }

  if (storedCode.email !== user.email) {
    return { error: 'Invalid credentials' };
  }

  await lucia.invalidateUserSessions(user.id);
  await db
    .update(userTable)
    .set({ emailVerified: true })
    .where(eq(userTable.id, user.id));

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect('/dashboard');
}
