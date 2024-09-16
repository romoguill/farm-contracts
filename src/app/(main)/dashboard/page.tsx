import LogoutButton from '@/app/auth/_components/logout-button';
import { validateRequest } from '@/lib/auth';
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
