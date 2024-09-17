import { marketData } from '@/db/schema';
import { db } from '@/lib/dbClient';
import { getMarketDataSoyPrice, loginMatba } from '@/lib/market-data.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  // Access token only last 24 hours, so it's not usefull to store it, cron will run once a day
  try {
    const { access: accessToken } = await loginMatba();

    const data = await getMarketDataSoyPrice(accessToken);

    await db.insert(marketData).values({
      price: data.indexValue,
    });

    return NextResponse.json('ok', { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message });
    } else {
      return NextResponse.json(
        { error: 'Something went wrong with API' },
        { status: 500 }
      );
    }
  }
}
