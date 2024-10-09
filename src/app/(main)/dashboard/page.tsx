import MainContainer from '@/components/main-container';
import MainTitle from '@/components/main-title';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ChartDashboard from '../_components/charts/chart-dashboard';
import CurrentContracts from '../_components/contracts/current-contracts';
import CurrencyConverter from '../_components/dasboard/currency-converter';
import ParcelViewer from '../_components/parcels/parcel-viewer';
import { getParcels } from '@/actions/parcels.actions';

async function DashboardPage() {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  const parcels = await getParcels();

  return (
    <MainContainer>
      <MainTitle>Dashboard</MainTitle>
      <section className='flex flex-col gap-5 md:flex-row'>
        <ChartDashboard />
        <CurrencyConverter />
      </section>
      <section className='flex flex-col gap-5 md:flex-row'>
        <CurrentContracts />
        <ParcelViewer parcels={parcels} />
      </section>
    </MainContainer>
  );
}
export default DashboardPage;
