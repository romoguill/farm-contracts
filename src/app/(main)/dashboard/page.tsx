import MainContainer from '@/components/main-container';
import MainTitle from '@/components/main-title';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ChartDashboard from '../_components/charts/chart-dashboard';
import CurrentContracts from '../_components/contracts/current-contracts';

async function DashboardPage() {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <MainContainer>
      <MainTitle>Dashboard</MainTitle>
      <ChartDashboard />
      <CurrentContracts />
    </MainContainer>
  );
}
export default DashboardPage;
