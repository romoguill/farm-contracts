'use client';

import {
  getNewestContract,
  getOldestContract,
} from '@/actions/contracts.actions';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useReducer, useState } from 'react';

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

interface YearPickerProps {
  defaultValue: number;
  onChange: (value: number) => void;
}

function YearPicker({ defaultValue, onChange }: YearPickerProps) {
  const [year, dispatch] = useReducer(reducer, defaultValue);

  const { data: oldestContract } = useQuery({
    queryKey: ['contracts', 'first'],
    queryFn: () => getOldestContract(),
  });

  const { data: newestContract } = useQuery({
    queryKey: ['contracts', 'last'],
    queryFn: () => getNewestContract(),
  });

  useEffect(() => {
    onChange(year);
  }, [year, onChange]);

  return (
    <div className='mx-auto flex items-center justify-center gap-6'>
      <Button
        variant='secondary'
        size='icon'
        className='h-6 w-6 bg-secondary text-secondary-foreground'
        disabled={
          oldestContract
            ? year <= oldestContract?.startDate.getFullYear()
            : year <= new Date().getFullYear() // disable selecting years prior to oldest contract
        }
        onClick={() => dispatch({ type: 'previous_year' })}
      >
        <ChevronLeft size={16} />
      </Button>

      <span className='text-base'>{year}</span>

      <Button
        variant='secondary'
        size='icon'
        className='h-6 w-6'
        disabled={
          newestContract &&
          year >=
            Math.max(
              newestContract?.endDate.getFullYear(),
              new Date(Date.now()).getFullYear()
            )
        } // disable selection contracts past the latest contract OR the current year
        onClick={() => dispatch({ type: 'next_year' })}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
export default YearPicker;
