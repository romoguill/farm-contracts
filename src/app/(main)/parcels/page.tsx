import { getParcels } from '@/actions/parcels.actions';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ParcelViewer from '../_components/parcels/parcel-viewer';
import ParcelStats from '../_components/parcels/parcel-stats';
import MainContainer from '@/components/main-container';

async function ParcelsPage() {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  const parcels = await getParcels();

  return (
    <MainContainer>
      <ParcelViewer parcels={parcels} />
    </MainContainer>
  );
}
export default ParcelsPage;
