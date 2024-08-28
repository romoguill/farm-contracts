import { google } from '@/lib/auth';
import { generateCodeVerifier, generateState } from 'arctic';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ['userinfo.email', 'userinfo.profile'],
  });

  cookies().set('google_oauth_state', state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
  });

  cookies().set('google_code_verifier', codeVerifier, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
  });

  return NextResponse.redirect(url);
}
