'use server';

import { user } from '@/db/schema';
import {
  generateEmailVerificationCode,
  HASHING_OPTIONS,
  lucia,
  validateRequest,
} from '@/lib/auth';
import { db } from '@/lib/dbClient';
import {
  LoginCredentials,
  loginCredentialsSchema,
  SignUpCredentials,
  signUpCredentialsSchema,
} from '@/lib/validation';
import { hash, verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sendEmail } from '../emails/actions';
import CodeVerification from '../emails/_templates/code-verification';

export async function signUpWithCredentials(payload: SignUpCredentials) {
  const { email, name, password } = signUpCredentialsSchema.parse(payload);

  const passwordHashed = await hash(password, HASHING_OPTIONS);
  const userId = generateIdFromEntropySize(10);

  try {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (existingUser) {
      return { error: 'Email already in use.' };
    }

    await db.insert(user).values({
      id: userId,
      email,
      name,
      passwordHashed,
    });

    const verificationCode = await generateEmailVerificationCode(userId, email);
    const { error: emailError } = await sendEmail(
      process.env.DOMAIN_SENDER!,
      [email],
      'Verification Code',
      CodeVerification({ name, code: verificationCode })
    );

    if (emailError) {
      console.error(emailError.message);
      return { error: 'There was a problem sending verification code' };
    }

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect('/auth/email-verification');
  } catch (error) {
    console.error(error);
    return { error: 'Something went wrong when creating user' };
  }
}

export async function loginWithCredentials(payload: LoginCredentials) {
  const { email, password } = loginCredentialsSchema.parse(payload);

  try {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!existingUser) {
      return { error: 'Invalid credentials' };
    }

    // For users created with oauth, there will be no password
    if (!existingUser.passwordHashed) {
      return { error: 'Try logging in with Google ' };
    }

    const isValidPassword = await verify(
      existingUser.passwordHashed,
      password,
      HASHING_OPTIONS
    );

    if (!isValidPassword) {
      return { error: 'Invalid credentials' };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return { error: null };
  } catch (error) {
    console.error(error);
    return { error: 'Something went wrong when creating your user' };
  }
}

export async function logout() {
  const { session } = await validateRequest();

  if (!session) {
    return;
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect('/auth/login');
}
