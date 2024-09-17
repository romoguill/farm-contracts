import { getSoyCurrentMarketData } from '@/actions/market.actions';
import LogoutButton from '@/app/auth/_components/logout-button';
import { marketData } from '@/db/schema';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/dbClient';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

async function DashboardPage() {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  // const data = await fetch('http://localhost:3000/crons/market-data');

  return (
    <div>
      DashboardPage
      <LogoutButton />
    </div>
  );
}
export default DashboardPage;
