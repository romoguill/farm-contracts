'use client';

import { getContractsForDashboard } from '@/actions/contracts.actions';
import { getSoyCurrentMarketData } from '@/actions/market.actions';
import CustomLoader from '@/components/custom-loader';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import ContractCard from './contract-card';
import { useSearchParams } from 'next/navigation';
import { SearchFilters } from '@/lib/validation';

// ------ FILTERING UTILS ------
// Utils for filtering and cleaner code
type ContractDashboard = Awaited<
  ReturnType<typeof getContractsForDashboard>
>[number];
type FilterFunction<T> = (items: T[], filter: SearchFilters) => T[];

const filterByStatus: FilterFunction<ContractDashboard> = (
  contracts,
  filter
) => {
  return contracts.filter((contract) => {
    if (filter.status === 'ALL' || filter.status === null) return true;

    const status =
      contract.endDate > new Date(Date.now()) ? 'ONGOING' : 'FINISHED';

    return status === filter.status;
  });
};

const filterByYear: FilterFunction<ContractDashboard> = (contracts, filter) => {
  return contracts.filter((contract) => {
    if (filter.year === 'ALL' || filter.year === null) return true;

    return (
      String(contract.startDate.getFullYear()) <= filter.year &&
      String(contract.endDate.getFullYear()) >= filter.year
    );
  });
};

const applyFilters = <T,>(
  items: T[],
  filtersCbs: FilterFunction<T>[],
  filter: SearchFilters
): T[] => {
  return filtersCbs.reduce(
    (filteredItems, filterCb) => filterCb(filteredItems, filter),
    items
  );
};

// ------ COMPONENT ------
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
    const filterYear = filters.get('year');

    return c;
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
