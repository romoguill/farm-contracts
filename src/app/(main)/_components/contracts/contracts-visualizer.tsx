'use client';

import { getContractsForDashboard } from '@/actions/contracts.actions';
import { getSoyCurrentMarketData } from '@/actions/market.actions';
import CustomLoader from '@/components/custom-loader';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import ContractCard from './contract-card';

function ContractsVisualizer() {
  const {
    data: contracts,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => getContractsForDashboard(),
  });

  if (isPending) {
    return <CustomLoader />;
  }

  if (isError) {
    return (
      <p className='text-muted-foreground'>
        There was a problem getting contracts information.
      </p>
    );
  }

  return (
    <div>
      <ul>
        {contracts.map((contract) => (
          <ContractCard key={contract.id} contractId={contract.id} />
        ))}
      </ul>
    </div>
  );
}
export default ContractsVisualizer;
