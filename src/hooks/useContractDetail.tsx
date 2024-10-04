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

    // // Days of contract: miliseconds difference to days
    // const contractDurationInDays = Math.floor(
    //   (contract.endDate.getTime() - contract.startDate.getTime()) /
    //     (1000 * 60 * 60 * 24)
    // );

    // Total hectares (a.k.a sum of area of all parcels in contract)
    const parcelsHasTotal = contract.contractToParcel.reduce((prev, curr) => {
      return (prev += Number(curr.parcel.area));
    }, 0);

    return marketData
      ? (marketData.price * contract.soyKgs * parcelsHasTotal) / 1000
      : 0;
  }, [marketData, contract]);

  const remainingValue = useMemo(() => {
    if (!contract || !marketData) return;

    const totalDays =
      Math.floor(contract.endDate.getTime() - contract.startDate.getTime()) /
      (1000 * 60 * 60 * 24);

    // Days of contract: miliseconds difference to days
    const remainingDays = Math.min(
      Math.max(
        Math.floor(
          (contract.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        ),
        0
      ),
      totalDays
    );

    // Total hectares (a.k.a sum of area of all parcels in contract)
    const parcelsHasTotal = contract.contractToParcel.reduce((prev, curr) => {
      return (prev += Number(curr.parcel.area));
    }, 0);
    console.log({ totalDays, remainingDays });
    // Get the proportional pay per day based on the contract month
    return marketData
      ? (remainingDays / totalDays) *
          ((marketData.price * contract.soyKgs * parcelsHasTotal) / 1000)
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
      title: contract.title,
      tenant: contract.tenant,
      status: contract.endDate > new Date(Date.now()) ? 'ONGOING' : 'FINISHED',
      startDate: contract.startDate,
      endDate: contract.endDate,
      soyKgs: contract.soyKgs,
      parcels: contract.contractToParcel.map((item) => ({ ...item.parcel })),
      totalValue,
      remainingValue,
    },
  };
}
