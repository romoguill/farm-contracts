import { getContracts } from '@/actions/contracts.actions';

async function ContractsPage() {
  const { data, error } = await getContracts();

  return <div>{JSON.stringify(data)}</div>;
}
export default ContractsPage;
