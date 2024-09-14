import MainContainer from '@/components/main-container';
import MainTitle from '@/components/main-title';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ContractsFilter from '../_components/contracts/contracts-filter';
import ContractsVisualizer from '../_components/contracts/contracts-visualizer';

async function ContractsPage() {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <MainContainer>
      <MainTitle>Contracts</MainTitle>
      <ContractsFilter />
      <ContractsVisualizer />
    </MainContainer>
  );
}
export default ContractsPage;
