'use client';

import { Form } from '@/components/ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import SearchFilters from '../forms/search-filters';

function ContractsFilter() {
  return (
    <div className='rounded-xl border border-slate-800 h-64'>
      <SearchFilters />
    </div>
  );
}
export default ContractsFilter;
