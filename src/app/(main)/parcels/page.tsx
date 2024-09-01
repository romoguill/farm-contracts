import { getParcels } from '@/actions/parcels/actions';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ParcelViewer from '../_components/parcels/parcel-viewer';

async function ParcelsPage() {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  const parcels = await getParcels();

  return (
    <div className='w-full h-full'>
      <ParcelViewer parcels={parcels} viewerWidth={623} />
    </div>
  );
}
export default ParcelsPage;
