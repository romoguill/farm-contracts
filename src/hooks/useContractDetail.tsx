import { getContractForDashboard } from '@/actions/contracts.actions';
import { getSoyCurrentMarketData } from '@/actions/market.actions';
import { formatDateFromCalendar } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useContractDetail(contractId: string) {
  const {
    data: contract,
    isPending: isPendingContracts,
    isError: isErrorContracts,
  } = useQuery({
    queryKey: ['contracts', contractId],
    queryFn: async () => getContractForDashboard(contractId),
  });

  const {
    data: marketData,
    isPending: isPendingMarket,
    isError: isErrorMarket,
  } = useQuery({
    queryKey: ['marketData', formatDateFromCalendar(new Date(Date.now()))],
    queryFn: () => getSoyCurrentMarketData(new Date(Date.now())),
  });

  const totalValue = useMemo(() => {
    if (!contract || !marketData) return;

    // Days of contract: miliseconds difference to days
    const contractDurationInDays = Math.floor(
      (contract.endDate.getTime() - contract.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    // Get the proportional pay per day based on the contract month
    return marketData
      ? contractDurationInDays * ((marketData.price * contract.soyKgs) / 365)
      : 0;
  }, [marketData, contract]);

  const remainingValue = useMemo(() => {
    if (!contract || !marketData) return;

    // Days of contract: miliseconds difference to days
    const contractDurationInDays = Math.max(
      Math.floor(
        (contract.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ),
      0
    );
    // Get the proportional pay per day based on the contract month
    return marketData
      ? contractDurationInDays * ((marketData.price * contract.soyKgs) / 365)
      : 0;
  }, [contract, marketData]);

  if (isPendingContracts || isPendingMarket) {
    return {
      isPending: true,
      isError: false,
      data: undefined,
    };
  }

  if (isErrorContracts || isErrorMarket) {
    return {
      isPending: false,
      isError: true,
      data: undefined,
    };
  }

  if (!contract) {
    return {
      isPending: false,
      isError: false,
      data: undefined,
    };
  }

  return {
    isPending: false,
    isError: false,
    data: {
      id: contract.id,
      startDate: contract.startDate,
      endDate: contract.endDate,
      soyKgs: contract.soyKgs,
      parcels: contract.contractToParcel.map((item) => ({ ...item.parcel })),
      totalValue,
      remainingValue,
    },
  };
}
