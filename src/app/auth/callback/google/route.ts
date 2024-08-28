import { google, lucia } from '@/lib/auth';
import { db } from '@/lib/dbClient';
import { OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { user as userTable } from '../../../../db/schema';

interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const storedState = cookies().get('google_oauth_state')?.value ?? null;
  const codeVerifier = cookies().get('google_code_verifier')?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    !codeVerifier ||
    state !== storedState
  ) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    // Code validation
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    // Get user profile
    const response = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    const user: GoogleUser = await response.json();

    // Check user in DB
    const existingUser = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.googleId, user.sub),
    });

    // If exists, create session and log the user
    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return NextResponse.redirect(process.env.APP_URL!);
    }

    // Else create user in DB and repeat steps to log in
    const userId = generateIdFromEntropySize(10);

    await db.insert(userTable).values({
      id: userId,
      email: user.email,
      googleId: user.sub,
      username: user.name,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return NextResponse.redirect(process.env.APP_URL!);
  } catch (error) {
    console.error(error);
    if (error instanceof OAuth2RequestError) {
      return new NextResponse(null, { status: 400 });
    }

    return new NextResponse(null, { status: 500 });
  }
}
