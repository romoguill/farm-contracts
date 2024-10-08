'use client';

import { getActiveContractsAndParcels } from '@/actions/contracts.actions';
import { useQuery } from '@tanstack/react-query';
import ContractCard from './contract-card';

function CurrentContracts() {
  const { data: activeContracts } = useQuery({
    queryKey: ['contracts', 'active'],
    queryFn: () => getActiveContractsAndParcels(),
  });

  console.log(activeContracts);

  return (
    <div>
      {activeContracts?.map((contract) => (
        <ContractCard key={contract.id} contractId={contract.id} />
      ))}
    </div>
  );
}
export default CurrentContracts;
