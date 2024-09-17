'use client';

import { getContractsForDashboard } from '@/actions/contracts.actions';
import { getSoyCurrentMarketData } from '@/actions/market.actions';
import CustomLoader from '@/components/custom-loader';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

function ContractsVisualizer() {
  const {
    data: contracts,
    isPending: isPendingContracts,
    isError: isErrorContracts,
  } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () =>
      getContractsForDashboard().catch((e) => {
        throw e;
      }),
  });

  const {
    data: soyPrice,
    isPending: isPendingPrice,
    isError: isErrorPrice,
  } = useQuery({
    queryKey: ['soyPrice'],
    queryFn: () => getSoyCurrentMarketData(new Date(Date.now())),
  });

  const totalValue = useMemo(() => {
    if (!contracts) return [];

    return contracts.map((contract) => {
      // Days of contract: miliseconds difference to days
      const contractDurationInDays = Math.floor(
        (contract.endDate.getTime() - contract.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      // Get the proportional pay per day based on the contract month
      return {
        id: contract.id,
        totalValue: soyPrice
          ? contractDurationInDays * ((soyPrice.price * contract.soyKgs) / 365)
          : 0,
      };
    });
  }, [soyPrice, contracts]);

  if (isPendingContracts || isPendingPrice) {
    return <CustomLoader />;
  }

  if (isErrorContracts || isErrorPrice) {
    return <p>There was an error. Please try again later</p>;
  }

  return (
    <div>
      <ul>
        {contracts.map((contract) => (
          <li key={contract.id}>
            <div>
              <span>Id: {contract.id}</span>
              <span>Soy kgs: {contract.soyKgs}</span>
              <span>
                Total value (today):{' '}
                {
                  totalValue.find((value) => value.id === contract.id)
                    ?.totalValue
                }
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ContractsVisualizer;
