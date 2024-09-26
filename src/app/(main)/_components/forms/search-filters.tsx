'use client';

import { getOldestContract } from '@/actions/contracts.actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { calculateAvailableYears } from '@/lib/utils';
import {
  contractStatusSchema,
  SearchFilters as ISearchFilters,
} from '@/lib/validation';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

interface SearchFiltersrProps {
  initialFilters?: ISearchFilters;
}

function SearchFilters({ initialFilters }: SearchFiltersrProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    data: firstContract,
    isPending: isFirstContractPending,
    isError: isFirstContractError,
  } = useQuery({
    queryKey: ['contracts', 'first'],
    queryFn: () => getOldestContract(),
  });

  const form = useForm<ISearchFilters>({
    defaultValues: {
      status: initialFilters?.status || 'ALL',
      year: initialFilters?.year || 'ALL',
    },
  });

  const onSubmit: SubmitHandler<ISearchFilters> = (data) => {
    const url = new URL(window.location.href);
    console.log(url);
    const query = new URLSearchParams(data);
    url.search = query.toString();
    router.push(url.toString());
  };

  const availableYears = calculateAvailableYears(
    firstContract?.startDate.getFullYear()
  );

  return (
    <div className='rounded-xl border border-slate-800 h-64'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={'ALL'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select contract status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={'ALL'}>ALL</SelectItem>
                    {contractStatusSchema.options
                      .sort((a, b) => a.localeCompare(b))
                      .map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='year'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={'ALL'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select year' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={'ALL'}>ALL</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button type='submit'>Apply</Button>
        </form>
      </Form>
    </div>
  );
}
export default SearchFilters;
