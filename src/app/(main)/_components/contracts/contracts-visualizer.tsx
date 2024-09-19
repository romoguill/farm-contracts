'use client';

import { getContractsForDashboard } from '@/actions/contracts.actions';
import { getSoyCurrentMarketData } from '@/actions/market.actions';
import CustomLoader from '@/components/custom-loader';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import ContractCard from './contract-card';
import { useSearchParams } from 'next/navigation';

function ContractsVisualizer() {
  const filters = useSearchParams();
  const {
    data: contracts,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => getContractsForDashboard(),
  });

  const dataFiltered = useMemo(() => {
    if (!contracts) return [];
    const filterStatus = filters.get('status');

    return contracts.filter((contract) => {
      if (filterStatus === 'ALL' || filterStatus === null) return true;

      const status =
        contract.endDate > new Date(Date.now()) ? 'ONGOING' : 'FINISHED';

      return status === filterStatus;
    });
  }, [contracts, filters]);

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
        {dataFiltered.map((contract) => (
          <ContractCard key={contract.id} contractId={contract.id} />
        ))}
      </ul>
    </div>
  );
}
export default ContractsVisualizer;
