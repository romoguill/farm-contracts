'use client';

import {
  getBestValueContract,
  getLastContractForParcel,
} from '@/actions/contracts.actions';
import { Parcel } from '@/db/schema';
import { useQuery } from '@tanstack/react-query';

interface ParcelStatsProps {
  parcel: Parcel;
}

function ParcelStats({ parcel }: ParcelStatsProps) {
  const { data: lastContract } = useQuery({
    queryKey: ['lastContractOfParcel', parcel.id],
    queryFn: () => getLastContractForParcel(parcel.id),
  });

  const { data: bestValue } = useQuery({
    queryKey: ['bestValue', parcel.id],
    queryFn: () => getBestValueContract(parcel.id),
  });

  const kgsFormatter = new Intl.NumberFormat('en-US');

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
      </ul>
    </article>
  );
}

export default ParcelStats;
