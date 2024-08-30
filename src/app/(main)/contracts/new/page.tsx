import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CreateContractForm from '../../_components/forms/create-contract';

async function NewContractPage() {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <div>
      NewContractPage
      <CreateContractForm />
    </div>
  );
}
export default NewContractPage;
