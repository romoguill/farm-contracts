import { getContractForDashboard } from '@/actions/contracts.actions';
import { getSoyCurrentMarketData } from '@/actions/market.actions';
import { formatDateFromCalendar } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export async function useContractDetail(contractId: string) {
  const {
    data: contract,
    isPending: isPendingContracts,
    isError: isErrorContracts,
  } = useQuery({
    queryKey: ['contracts', contractId],
    queryFn: async () => getContractForDashboard(contractId),
  });

  const {
    data: soyPrice,
    isPending: isPendingPrice,
    isError: isErrorPrice,
  } = useQuery({
    queryKey: ['soyPrice', formatDateFromCalendar(new Date(Date.now()))],
    queryFn: () => getSoyCurrentMarketData(new Date(Date.now())),
  });

  const totalValue = useMemo(() => {
    if (!contract) return [];

    // Days of contract: miliseconds difference to days
    const contractDurationInDays = Math.floor(
      (contract.endDate.getTime() - contract.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    // Get the proportional pay per day based on the contract month
    return {
      id: contract.id,
      value: soyPrice
        ? contractDurationInDays * ((soyPrice.price * contract.soyKgs) / 365)
        : 0,
    };
  }, [soyPrice, contracts]);

  const remainingValue = useMemo(() => {
    if (!contracts) return [];

    return contracts.map((contract) => {
      // Days of contract: miliseconds difference to days
      const contractDurationInDays = Math.floor(
        (contract.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      // Get the proportional pay per day based on the contract month
      return {
        id: contract.id,
        value: soyPrice
          ? contractDurationInDays * ((soyPrice.price * contract.soyKgs) / 365)
          : 0,
      };
    });
  }, [contracts, soyPrice]);

  return {
    id: contract,
  };
}
