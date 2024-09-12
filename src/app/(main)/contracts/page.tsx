import { getContracts } from '@/actions/contracts.actions';
import MainTitle from '@/components/main-title';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';

async function ContractsPage() {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <div>
      <MainTitle>Contracts</MainTitle>
    </div>
  );
}
export default ContractsPage;
