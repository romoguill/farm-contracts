import MainContainer from '@/components/main-container';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CreateContractForm from '../../_components/forms/create-contract-form';

async function ContractDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <MainContainer>
      <CreateContractForm contractId={id} />
    </MainContainer>
  );
}

export default ContractDetailPage;
