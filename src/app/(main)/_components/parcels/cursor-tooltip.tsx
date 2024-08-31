'use client';

import { Parcel } from '@/db/schema';
import { useMouse } from '@/hooks/useMouse';
import { forwardRef, Ref } from 'react';

interface CursorTooltipProps {
  data: Pick<Parcel, 'label' | 'area'>;
}

const CursorTooltip = forwardRef<HTMLDivElement, CursorTooltipProps>(
  ({ data, ...props }, ref) => {
    const offset = 10;
    const position = useMouse();

    return (
      <div
        ref={ref}
        className='bg-slate-600 shadow-lg w-24 h-18 fixed -translate-x-1/2 -translate-y-full rounded-xl flex flex-col gap-2 items-center justify-center p-2 border-slate-800 border-2'
        {...props}
        style={{
          top: `${position.y - offset}px`,
          left: `${position.x}px`,
        }}
      >
        <span className='text-slate-50'>{data.label}</span>
        <span className='text-slate-50 text-sm'>{data.area} has.</span>
      </div>
    );
  }
);

CursorTooltip.displayName = 'CursorTooltip';

export default CursorTooltip;
