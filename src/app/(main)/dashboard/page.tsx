import MainContainer from '@/components/main-container';
import MainTitle from '@/components/main-title';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ChartDashboard from '../_components/charts/chart-dashboard';
import CurrentContracts from '../_components/contracts/current-contracts';
import CurrencyConverter from '../_components/dasboard/currency-converter';

async function DashboardPage() {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <MainContainer>
      <MainTitle>Dashboard</MainTitle>
      <section className='flex flex-col gap-5 md:flex-row'>
        <ChartDashboard />
        <CurrencyConverter />
      </section>
      <CurrentContracts />
    </MainContainer>
  );
}
export default DashboardPage;
