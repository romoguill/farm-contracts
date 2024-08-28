'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function OAuthGoogleButton() {
  const router = useRouter();
  const createAuthURL = () =>
    fetch('/auth/login/google')
      .then((res) => res.json())
      .then(({ url }) => url && router.push(url));

  return <Button onClick={createAuthURL}>Sign in with Google</Button>;
}
