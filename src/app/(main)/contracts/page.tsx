import MainContainer from '@/components/main-container';
import MainTitle from '@/components/main-title';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ContractsFilter from '../_components/contracts/contracts-filter';
import ContractsVisualizer from '../_components/contracts/contracts-visualizer';

interface ContractsPageProps {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

async function ContractsPage({ searchParams }: ContractsPageProps) {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <MainContainer>
      <MainTitle>Contracts</MainTitle>
      <ContractsFilter searchParams={searchParams} />
      <ContractsVisualizer />
    </MainContainer>
  );
}
export default ContractsPage;
