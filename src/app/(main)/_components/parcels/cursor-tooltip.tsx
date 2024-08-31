'use client';

import { useMouse } from '@/hooks/useMouse';
import { forwardRef, Ref } from 'react';

const CursorTooltip = forwardRef<HTMLDivElement>((props, ref) => {
  const position = useMouse();

  return (
    <div
      ref={ref}
      className='bg-yellow-500 w-4 h-4'
      {...props}
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    />
  );
});

CursorTooltip.displayName = 'CursorTooltip';

export default CursorTooltip;
