'use client';

import { searchFiltersSchema } from '@/lib/validation';
import SearchFilters from '../forms/search-filters';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useState } from 'react';

interface ContractsFilterProps {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

function ContractsFilter({ searchParams }: ContractsFilterProps) {
  const [accordionOpen, setAccordionOpen] = useState('');

  const initialFilters = searchFiltersSchema.parse(searchParams);

  return (
    <div className='rounded-md bg-muted'>
      <Accordion
        type='single'
        collapsible
        value={accordionOpen}
        onValueChange={() => setAccordionOpen('filter')}
      >
        <AccordionItem value='filter' className='border-none'>
          <AccordionTrigger className='bg-muted rounded-md px-2 text-lg font-semibold'>
            Filters
          </AccordionTrigger>
          <AccordionContent className='rounded-md'>
            <SearchFilters
              initialFilters={initialFilters}
              setAccordionOpen={setAccordionOpen}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default ContractsFilter;
