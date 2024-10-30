import MainContainer from '@/components/main-container';
import MainTitle from '@/components/main-title';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ContractsFilter from '../_components/contracts/contracts-filter';
import ContractsVisualizer from '../_components/contracts/contracts-visualizer';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <div className='flex justify-between items-center'>
        <MainTitle>Contracts</MainTitle>
        <Link
          href='/contracts/new'
          className={cn(buttonVariants({ variant: 'secondary' }), 'gap-1')}
        >
          <span>
            <FilePlus size={16} />
          </span>
          Create
        </Link>
      </div>
      <ContractsFilter searchParams={searchParams} />
      <ContractsVisualizer />
    </MainContainer>
  );
}
export default ContractsPage;
