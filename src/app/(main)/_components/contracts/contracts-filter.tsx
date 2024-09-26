'use client';

import { searchFiltersSchema } from '@/lib/validation';
import SearchFilters from '../forms/search-filters';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ContractsFilterProps {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

function ContractsFilter({ searchParams }: ContractsFilterProps) {
  const initialFilters = searchFiltersSchema.parse(searchParams);

  return (
    <div className='rounded-xl bg-muted'>
      <Accordion type='single' collapsible>
        <AccordionItem value='filter' className='border-none'>
          <AccordionTrigger className='bg-muted rounded-md px-2'>
            Filters
          </AccordionTrigger>
          <AccordionContent>
            <SearchFilters initialFilters={initialFilters} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default ContractsFilter;
