'use client';

import { getOldestContract } from '@/actions/contracts.actions';
import { getParcels } from '@/actions/parcels.actions';
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
import useQueryFilters from '@/hooks/useQueryFilters';
import { calculateAvailableYears } from '@/lib/utils';
import {
  contractStatusSchema,
  SearchFilters as ISearchFilters,
} from '@/lib/validation';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { SetStateAction } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface SearchFiltersrProps {
  initialFilters?: ISearchFilters;
  setAccordionOpen: React.Dispatch<SetStateAction<string>>;
}

function SearchFilters({
  initialFilters,
  setAccordionOpen,
}: SearchFiltersrProps) {
  const router = useRouter();
  const filters = useQueryFilters();

  const { data: firstContract } = useQuery({
    queryKey: ['contracts', 'first'],
    queryFn: () => getOldestContract(),
  });

  const { data: parcels } = useQuery({
    queryKey: ['parcels'],
    queryFn: () => getParcels(),
  });

  const form = useForm<ISearchFilters>({
    defaultValues: {
      status: initialFilters?.status || filters.status,
      year: initialFilters?.year || filters.year,
      parcel: initialFilters?.parcel || filters.parcel,
    },
  });

  const onSubmit: SubmitHandler<ISearchFilters> = (data) => {
    const url = new URL(window.location.href);
    const query = new URLSearchParams(data);
    url.search = query.toString();
    router.push(url.toString());
    setAccordionOpen('');
  };

  const availableYears = calculateAvailableYears(
    firstContract?.startDate.getFullYear()
  );

  return (
    <div className='rounded-md px-2'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='capitalize'>
                      <SelectValue placeholder='Select contract status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={'ALL'}>All</SelectItem>
                    {contractStatusSchema.options
                      .sort((a, b) => a.localeCompare(b))
                      .map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className='capitalize'
                        >
                          {status.toLocaleLowerCase()}
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select year' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={'ALL'}>All</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {String(year)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='parcel'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parcel</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder='Select parcel'
                        className='capitalize'
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={'ALL'}>All</SelectItem>
                    {parcels?.map((parcel) => (
                      <SelectItem key={parcel.label} value={parcel.label}>
                        {parcel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button type='submit' className='block ml-auto mt-4'>
            Apply
          </Button>
        </form>
      </Form>
    </div>
  );
}
export default SearchFilters;
