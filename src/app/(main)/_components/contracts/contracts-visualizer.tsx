'use client';

import { getContractsForDashboard } from '@/actions/contracts.actions';
import { getSoyCurrentMarketData } from '@/actions/market.actions';
import CustomLoader from '@/components/custom-loader';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import ContractCard from './contract-card';
import { useSearchParams } from 'next/navigation';
import { SearchFilters, searchFiltersSchema } from '@/lib/validation';
import { getContractStatus } from '@/lib/utils';

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

    const status = getContractStatus(contract.startDate, contract.endDate);

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

const filterByParcel: FilterFunction<ContractDashboard> = (
  contracts,
  filter
) => {
  return contracts.filter((contract) => {
    if (filter.parcel === 'ALL' || filter.parcel === null) return true;

    return contract.contractToParcel.some(
      (ctp) => ctp.parcel.label === filter.parcel
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
    const filtersObj = Object.fromEntries(filters);
    const { error, data: filtersParsed } =
      searchFiltersSchema.safeParse(filtersObj);

    // If url query is invalid, just return all contracts
    if (error) return contracts;

    return applyFilters<ContractDashboard>(
      contracts,
      [filterByStatus, filterByYear, filterByParcel],
      filtersParsed
    );
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
