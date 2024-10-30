'use client';

import {
  getAverageValueContract,
  getBestValueContract,
  getLastContractForParcel,
} from '@/actions/contracts.actions';
import CustomLoader from '@/components/custom-loader';
import { Skeleton } from '@/components/ui/skeleton';
import { Parcel } from '@/db/schema';
import { useQuery } from '@tanstack/react-query';

interface ParcelStatsProps {
  parcel: Parcel;
}

function ParcelStats({ parcel }: ParcelStatsProps) {
  const { data: lastContract, isPending: isPendingLastContract } = useQuery({
    queryKey: ['lastContractOfParcel', parcel.id],
    queryFn: () => getLastContractForParcel(parcel.id),
  });

  const { data: bestValue, isPending: isPendingBestValue } = useQuery({
    queryKey: ['bestValue', parcel.id],
    queryFn: () => getBestValueContract(parcel.id),
  });

  const { data: avgValue, isPending: isPendingAvgValue } = useQuery({
    queryKey: ['avgValue', parcel.id],
    queryFn: () => getAverageValueContract(parcel.id),
  });

  const kgsFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  });

  if (isPendingLastContract || isPendingBestValue || isPendingAvgValue) {
    return <CustomLoader className='mt-8' />;
  }

  return (
    <article className='border mt-5 border-slate-300 shadow-md rounded-2xl p-3 w-[350px] col-start-2 justify-self-end'>
      <h3 className='text-lg'>{`Parcel ${parcel.label} Summary`}</h3>
      <ul>
        <li className='flex justify-between'>
          Area: <span>{parcel.area}</span>
        </li>
        <li className='flex justify-between'>
          {/* TODO */}
          Last contract:{' '}
          <span className='text-end'>{lastContract?.contractName}</span>
        </li>
        <li className='flex justify-between'>
          {/* TODO */}
          Best value:{' '}
          <span className='text-end'>
            {kgsFormatter.format(bestValue?.contractSoyKgs || 0)} kgs/ha
          </span>
        </li>
        <li className='flex justify-between'>
          {/* TODO */}
          Average value:{' '}
          <span className='text-end'>
            {kgsFormatter.format(Number(avgValue?.contractSoyKgs) || 0)} kgs/ha
          </span>
        </li>
      </ul>
    </article>
  );
}

export default ParcelStats;
