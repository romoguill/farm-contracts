'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducer, useState } from 'react';

type PickerActions = {
  type: 'next_year' | 'previous_year';
};

const reducer = (state: number, action: PickerActions) => {
  if (action.type === 'next_year') {
    return state + 1;
  }

  if (action.type === 'previous_year') {
    return state - 1;
  }

  return state;
};

function YearPicker() {
  const [state, dispatch] = useReducer(
    reducer,
    new Date(Date.now()).getFullYear()
  );

  return (
    <div className='mx-auto flex items-center justify-center gap-6'>
      <Button
        variant='outline'
        size='icon'
        className='h-8'
        onClick={() => dispatch({ type: 'previous_year' })}
      >
        <ChevronLeft />
      </Button>

      <span className='text-xl'>{state}</span>

      <Button
        variant='outline'
        size='icon'
        className='h-8'
        onClick={() => dispatch({ type: 'next_year' })}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
export default YearPicker;
