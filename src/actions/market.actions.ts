'use server';

import { marketData } from '@/db/schema';
import { db } from '@/lib/dbClient';
import { and, between, gt, lte } from 'drizzle-orm';

export async function getSoyCurrentMarketData(date: Date) {
  const dayBefore = new Date(date.valueOf() - 1000 * 60 * 60 * 24);

  const data = await db.query.marketData.findFirst({
    where: and(gt(marketData.date, dayBefore), lte(marketData.date, date)),
  });

  return data;
}
