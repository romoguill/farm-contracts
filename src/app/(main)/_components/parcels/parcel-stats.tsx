'use client';

import { getLastContractForParcel } from '@/actions/contracts.actions';
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
      </ul>
    </article>
  );
}

export default ParcelStats;
