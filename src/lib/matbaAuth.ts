import 'server-only';
import { z } from 'zod';

interface MatbaTokens {
  access: string | null;
  refresh: string | null;
}

const MATBA_API_LOGIN = 'https://api.matbarofex.com.ar/v2/token/';
const MATBA_API_REFRESH = 'https://api.matbarofex.com.ar/v2/token/refresh/';
const MATBA_API_SOY_PRICE = 'https://api.matbarofex.com.ar/v2/symbol/I.SOJA/';

const loginSchema = z.object({
  access: z.string(),
  refresh: z.string(),
});

export async function loginMatba() {
  const payload = {
    username: process.env.MATBA_API_USER!,
    password: process.env.MATBA_API_PASSWORD!,
  };

  const response = await fetch(MATBA_API_LOGIN, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const data = await response.json();

    const { data: tokens, error } = loginSchema.safeParse(data);

    if (error) {
      throw new Error(`API response not compatible. Response: ${data}`);
    }

    return tokens;
  } else {
    throw new Error(`Error during login to API`);
  }
}
