import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CreateContractForm from '../../_components/forms/create-contract-form';

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
