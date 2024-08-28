'use server';

import { HASHING_OPTIONS, lucia, validateRequest } from '@/lib/auth';
import { Credentials, credentialsSchema } from '@/lib/validation';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { hash } from '@node-rs/argon2';
import { generateIdFromEntropySize } from 'lucia';
import { db } from '@/lib/dbClient';
import { user } from '@/db/schema';

export async function signUpWithCredentials(payload: Credentials) {
  const { email, name, password } = credentialsSchema.parse(payload);

  const passwordHashed = await hash(password, HASHING_OPTIONS);
  const userId = generateIdFromEntropySize(10);

  try {
    await db.insert(user).values({
      id: userId,
      email,
      name,
      passwordHashed,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    console.error(error);
    return { error: 'Something went wrong when creating user' };
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
