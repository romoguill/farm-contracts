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
    queryKey: ['contracts', 'first'],
    queryFn: () => getNewestContract(),
  });

  useEffect(() => {
    onChange(year);
  }, [year, onChange]);

  return (
    <div className='mx-auto flex items-center justify-center gap-6'>
      <Button
        variant='outline'
        size='icon'
        className='h-8'
        disabled={
          oldestContract && year <= oldestContract?.startDate.getFullYear() // disable selecting years prior to oldest contract
        }
        onClick={() => dispatch({ type: 'previous_year' })}
      >
        <ChevronLeft />
      </Button>

      <span className='text-xl'>{year}</span>

      <Button
        variant='outline'
        size='icon'
        className='h-8'
        disabled={
          newestContract &&
          year >= newestContract?.endDate.getFullYear() &&
          year >= new Date(Date.now()).getFullYear()
        } // disable selection contracts past the latest contract OR the current year
        onClick={() => dispatch({ type: 'next_year' })}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
export default YearPicker;
