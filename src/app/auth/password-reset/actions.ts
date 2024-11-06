'use server';

import CodeVerification from '@/app/emails/_templates/code-verification';
import PasswordResetEmail from '@/app/emails/_templates/password-reset';
import { sendEmail } from '@/app/emails/actions';
import { passwordResetSession, user } from '@/db/schema';
import {
  createPasswordResetSession,
  generateEmailVerificationCode,
  generateSessionToken,
  getCurrentPasswordResetSession,
  setPasswordResetSessionTokenCookie,
} from '@/lib/auth';
import { db } from '@/lib/dbClient';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function sendPasswordResetEmail(email: string, code: string) {
  const { error } = await sendEmail(
    process.env.DOMAIN_SENDER!,
    [email],
    'Password Reset',
    PasswordResetEmail({ code })
  );

  return { error: error?.message ?? null };
}

export async function forgotPassword(formData: FormData) {
  const validator = z.string().email();
  const email = formData.get('email');

  const { data: emailValidated, error: validationError } =
    validator.safeParse(email);

  if (validationError) {
    return { error: 'Invalid email' };
  }

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, emailValidated),
  });

  if (!existingUser) {
    return { error: 'Email not found' };
  }

  // Delete previous recovery sessions
  await db
    .delete(passwordResetSession)
    .where(eq(passwordResetSession.userId, existingUser.id));

  const sessionToken = generateSessionToken();
  const session = await createPasswordResetSession(
    sessionToken,
    existingUser.id,
    existingUser.email
  );

  await sendPasswordResetEmail(existingUser.email, session.code);
  setPasswordResetSessionTokenCookie(sessionToken, session.expiresAt);

  return redirect('/auth/password-reset/verify-email');
}

export async function verifyPasswordResetEmail(formData: FormData) {
  const validator = z.string();
  const code = formData.get('code');

  const { data: codeValidated, error: validationError } =
    validator.safeParse(code);

  if (validationError) {
    return { error: 'Corrupted code' };
  }

  const session = await getCurrentPasswordResetSession();

  if (!session) {
    return { error: 'Unauthenticated' };
  }

  if (session.code !== codeValidated) {
    return { error: 'Invalid code' };
  }

  redirect('/auth/new-password');
}
