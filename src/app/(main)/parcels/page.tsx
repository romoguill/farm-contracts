import { getParcels } from '@/actions/parcels/actions';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ParcelViewer from '../_components/parcels/parcel-viewer';
import ParcelStats from '../_components/parcels/parcel-stats';

async function ParcelsPage() {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  const parcels = await getParcels();

  return (
    <div className='w-full h-full flex'>
      <ParcelViewer parcels={parcels} viewerWidth={'md'} />
    </div>
  );
}
export default ParcelsPage;
