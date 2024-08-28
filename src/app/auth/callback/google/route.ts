import { google } from '@/lib/auth';
import { OAuth2RequestError } from 'arctic';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const response = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    const user = await response.json();

    console.log({ user });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof OAuth2RequestError) {
      return new NextResponse(null, { status: 400 });
    }

    return new NextResponse(null, { status: 500 });
  }
}
