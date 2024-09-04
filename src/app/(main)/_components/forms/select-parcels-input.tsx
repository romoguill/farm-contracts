'use client';

import { getParcels } from '@/actions/parcels/actions';
import CustomLoader from '@/components/custom-loader';
import { Button } from '@/components/ui/button';
import { Parcel } from '@/db/schema';
import { cn } from '@/lib/utils';
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
  const handleParcelSelect = (parcel: Parcel) => {
    if (values.includes(parcel.id)) {
      onChange(values.filter((values) => values !== parcel.id));
    } else {
      onChange([...values, parcel.id]);
    }
  };

  return (
    <div>
      <div className='flex gap-2'>
        {parcels.map((parcel) => (
          <Button
            type='button'
            size='icon'
            variant='outline'
            key={parcel.label}
            className={cn(
              'border-2 border-green-600 hover:border-green-500 transition-colors',
              {
                'bg-green-600 hover:border-green-500 hover:bg-green-600':
                  values.includes(parcel.id),
              }
            )}
            onClick={() => handleParcelSelect(parcel)}
          >
            {parcel.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
export default SelectParcelsInput;
