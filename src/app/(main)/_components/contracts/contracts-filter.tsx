'use client';

import { searchFiltersSchema } from '@/lib/validation';
import SearchFilters from '../forms/search-filters';

interface ContractsFilterProps {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

function ContractsFilter({ searchParams }: ContractsFilterProps) {
  const initialFilters = searchFiltersSchema.parse(searchParams);

  return (
    <div className='rounded-xl border border-slate-800 h-64'>
      <SearchFilters initialFilters={initialFilters} />
    </div>
  );
}

export default ContractsFilter;
