import { getMarketDataSoyPrice, loginMatba } from '@/lib/market-data.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  // Access token only last 24 hours, so it's not usefull to store it, cron will run once a day
  try {
    const { access: accessToken } = await loginMatba();

    const marketData = await getMarketDataSoyPrice(accessToken);

    return NextResponse.json({ data: marketData });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message });
    } else {
      return NextResponse.json({ error: 'Something went wrong with API' });
    }
  }
}
