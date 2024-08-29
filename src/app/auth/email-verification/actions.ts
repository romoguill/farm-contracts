'use server';

import { emailVerificationCode } from '@/db/schema';
import { lucia, validateRequest } from '@/lib/auth';
import { db } from '@/lib/dbClient';
import { eq } from 'drizzle-orm';
import { isWithinExpirationDate } from 'oslo';

export async function emailVerification(code: string) {
  const { user } = await validateRequest();

  if (!user) {
    return { error: 'Invalid credentials' };
  }

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

  return { error: null };
}
