'use client';

import { getParcels } from '@/actions/parcels/actions';
import CustomLoader from '@/components/custom-loader';
import { Button } from '@/components/ui/button';
import { Parcel } from '@/db/schema';
import { useQuery } from '@tanstack/react-query';

// Pass all props except render that is handled inside this custom component
// interface SelectParcelsInputProps
//   extends Omit<Parameters<typeof FormField>[0], 'render'> {}

interface SelectParcelsInputProps {
  onChange: (ids: string[]) => void;
  values: string[];
  parcels: Parcel[];
}

function SelectParcelsInput({
  onChange,
  values,
  parcels,
}: SelectParcelsInputProps) {
  return (
    <div>
      <div className='flex gap-2'>
        {parcels.map((parcel) => (
          <span key={parcel.label} className='bg-slate-500 p-2 rounded-xl'>
            {parcel.label}
          </span>
        ))}
      </div>
    </div>
  );
}
export default SelectParcelsInput;
