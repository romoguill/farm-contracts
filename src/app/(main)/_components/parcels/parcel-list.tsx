'use client';

import { Parcel } from '@/db/schema';
import { cn, getRgbString } from '@/lib/utils';

interface ParcelLegendProps {
  parcels: Parcel[];
  onFocus: (parcel: Parcel | null) => void;
  selectedParcel: Parcel | null;
  onSelect: (parcel: Parcel | null) => void;
}

function ParcelLegend({
  parcels,
  onFocus,
  selectedParcel,
  onSelect,
}: ParcelLegendProps) {
  const handleClick = (parcel: Parcel) => {
    if (!selectedParcel) {
      onSelect(parcel);
      return;
    }

    if (selectedParcel.id === parcel.id) {
      onSelect(null);
    } else {
      onSelect(parcel);
      return;
    }
  };

  return (
    <article className='p-4 max-w-[400px] mx-auto grid grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))] gap-2'>
      {parcels.map((parcel) => (
        <div
          key={parcel.label}
          className={cn(
            'flex items-center gap-1 cursor-pointer w-fit hover:bg-slate-100 rounded-lg p-2',
            {
              'outline outline-slate-700':
                selectedParcel && selectedParcel.id === parcel.id,
            }
          )}
          onMouseEnter={() => onFocus(parcel)}
          onMouseLeave={() => onFocus(null)}
          onClick={(e) => handleClick(parcel)}
        >
          <span
            className={cn('rounded-sm h-5 w-5 flex-shrink-0 opacity-80')}
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
export default ParcelLegend;
