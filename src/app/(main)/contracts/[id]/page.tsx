import MainContainer from '@/components/main-container';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CreateContractForm from '../../_components/forms/create-contract-form';
import EditContractForm from '../../_components/forms/edit-contract';

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
      <EditContractForm contractId={id} />
    </MainContainer>
  );
}

export default ContractDetailPage;
