import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CreateContractForm from '../../_components/forms/create-contract-form';
import { getParcels } from '@/actions/parcels/actions';
import { Suspense } from 'react';
import CustomLoader from '@/components/custom-loader';

async function NewContractPage() {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <div className='w-full h-full'>
      <CreateContractForm />
    </div>
  );
}
export default NewContractPage;
