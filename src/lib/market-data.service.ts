import { crop } from '@/db/schema';
import 'server-only';
import { z } from 'zod';
import { Crops, cropsSchema } from './validation';

interface MatbaTokens {
  access: string | null;
  refresh: string | null;
}

const MATBA_API_LOGIN = 'https://api.matbarofex.com.ar/v2/token/';
// const MATBA_API_REFRESH = 'https://api.matbarofex.com.ar/v2/token/refresh/';
const MATBA_API_SYMBOL = 'https://api.matbarofex.com.ar/v2/symbol/';
const CROPS_API: Record<Crops, string> = {
  CORN: 'I.MAIZ',
  WHEAT: 'I.TRIGO',
  SOY: 'I.SOJA',
};

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

const symbolResponseSchema = z.array(
  z.object({
    crop: cropsSchema,
    data: z.object({
      indexValue: z.number(),
      maturity: z.number(),
      mdEntryDateTime: z.string(),
      unixTimestamp: z.number(),
      name: z.string(),
    }),
  })
);

export async function getMarketDataSoyPrice(accessToken: string) {
  const responsePromises = cropsSchema.options.map(async (crop) => {
    const response = await fetch(`${MATBA_API_SYMBOL}${crop}/`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(
        `API responded with an error: Status: ${
          response.status
        }, Error: ${await response.text()}`
      );
    }

    return {
      crop,
      data: await response.json(),
    };
  });

  try {
    const data = await Promise.all(responsePromises);
    const { data: cropData, error } = symbolResponseSchema.safeParse(data);

    if (error) {
      throw new Error(`API response corrupted. Response: ${cropData}`);
    }

    return cropData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Something went wrong');
  }
}
