'use client';

import { Button } from '@/components/ui/button';
import { Parcel } from '@/db/schema';
import { cn } from '@/lib/utils';

// Pass all props except render that is handled inside this custom component
// interface SelectParcelsInputProps
//   extends Omit<Parameters<typeof FormField>[0], 'render'> {}

interface SelectParcelsInputProps {
  onChange: (ids: string[]) => void;
  values: string[];
  parcels: Parcel[];
  disabled?: boolean;
}

function SelectParcelsInput({
  onChange,
  values,
  parcels,
  disabled = false,
}: SelectParcelsInputProps) {
  const handleParcelSelect = (parcel: Parcel) => {
    if (values.includes(parcel.id)) {
      onChange(values.filter((values) => values !== parcel.id));
    } else {
      onChange([...values, parcel.id]);
    }
  };
  // 'border-2 border-green-600 hover:border-green-400 transition-colors',
  //   'bg-green-600 hover:border-green-400 hover:bg-green-600':
  //   values.includes(parcel.id),
  // 'hover:border-inherit': disabled,
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
              'border-2 transition-colors hover:bg-inherit cursor-default',
              {
                'bg-slate-400 border-slate-500 hover:bg-slate-400 hover:border-slate-500':
                  values.includes(parcel.id),
                'border-green-600 hover:border-green-400 cursor-pointer':
                  !disabled,
                'bg-green-600 hover:border-green-400 hover:bg-green-600 cursor-pointer':
                  values.includes(parcel.id) && !disabled,
              }
            )}
            onClick={() => !disabled && handleParcelSelect(parcel)}
          >
            {parcel.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
export default SelectParcelsInput;
