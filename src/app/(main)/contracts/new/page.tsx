import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CreateContractForm from '../../_components/forms/create-contract-form';
import MainContainer from '@/components/main-container';

async function NewContractPage() {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <MainContainer>
      <CreateContractForm />
    </MainContainer>
  );
}
export default NewContractPage;
