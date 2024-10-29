import MainContainer from '@/components/main-container';
import MainTitle from '@/components/main-title';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ChartDashboard from '../_components/charts/chart-dashboard';
import CurrentContracts from '../_components/contracts/current-contracts';
import CurrencyConverter from '../_components/dasboard/currency-converter';
import ParcelViewer from '../_components/parcels/parcel-viewer';
import { getParcels } from '@/actions/parcels.actions';
import { getActiveContractsAndParcels } from '@/actions/contracts.actions';
import { Mukta } from 'next/font/google';
import { cn } from '@/lib/utils';
import MarketTable from '../_components/dasboard/market-table';

const font = Mukta({ weight: '700', subsets: ['latin'] });

async function DashboardPage() {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  const parcels = await getParcels();
  const activeContractsAndParcels = await getActiveContractsAndParcels();
  // Get only active parcels to pass it to parcelviewer
  const activeParcels = activeContractsAndParcels
    .flatMap((activeContract) => activeContract.contractToParcel)
    .map((ctp) => ctp.parcel);

  return (
    <MainContainer>
      <MainTitle>Dashboard</MainTitle>
      <section className='flex flex-col gap-5 md:flex-row'>
        <ChartDashboard />
        <div>
          <CurrencyConverter />
          <MarketTable />
        </div>
      </section>
      <section className='flex flex-col gap-5 md:flex-row'>
        <article>
          <h3 className={cn('font-bold text-xl text-center', font.className)}>
            Active Contracts
          </h3>
          <CurrentContracts />
        </article>
        <article>
          <h3 className={cn('font-bold text-xl text-center', font.className)}>
            Active Parcels
          </h3>
          <ParcelViewer
            parcels={parcels}
            forDashboard
            defaultSelected={activeParcels}
          />
        </article>
      </section>
    </MainContainer>
  );
}
export default DashboardPage;
