'use client';

import { Parcel } from '@/db/schema';
import { cn, getRgbString } from '@/lib/utils';

interface ParcelListProps {
  parcels: Parcel[];
}

function ParcelList({ parcels }: ParcelListProps) {
  return (
    <article className='p-4 max-w-[400px] mx-auto grid grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))] gap-2'>
      {parcels.map((parcel) => (
        <div key={parcel.label} className='flex items-center gap-1'>
          <span
            className={cn('rounded-sm h-5 w-5 flex-shrink-0')}
            style={{ backgroundColor: getRgbString(parcel.color) }}
          />
          <span className='text-sm font-bold text-muted-foreground flex-shrink-0'>
            {parcel.label}
          </span>
        </div>
      ))}
    </article>
  );
}
export default ParcelList;
