'use server';

import { marketData } from '@/db/schema';
import { db } from '@/lib/dbClient';
import { and, between, eq, gt, lte } from 'drizzle-orm';

export async function getSoyCurrentMarketData(date: Date) {
  const dayBefore = new Date(date.valueOf() - 1000 * 60 * 60 * 24);

  const data = await db.query.marketData.findFirst({
    where: and(
      gt(marketData.date, dayBefore),
      lte(marketData.date, date),
      eq(marketData.crop, 'SOY')
    ),
  });

  // React query gives error if value returned is undefined
  return data ?? null;
}

export async function getMarketData(date: Date) {
  const dayBefore = new Date(date.valueOf() - 1000 * 60 * 60 * 24);

  const data = await db.query.marketData.findMany({
    where: and(gt(marketData.date, dayBefore), lte(marketData.date, date)),
  });

  // React query gives error if value returned is undefined
  return data ?? null;
}
