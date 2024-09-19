'use client';

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
import {
  ContractStatus,
  contractStatusSchema,
  SearchFilters as ISearchFilters,
  searchFiltersSchema,
} from '@/lib/validation';
import { usePathname, useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

interface SearchFiltersrProps {
  initialFilters?: {
    status: ContractStatus;
    year: string;
  };
}

function SearchFilters({ initialFilters }: SearchFiltersrProps) {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm<ISearchFilters>({
    defaultValues: {
      status: initialFilters?.status || 'ALL',
    },
  });

  const onSubmit: SubmitHandler<ISearchFilters> = (data) => {
    const url = new URL(window.location.href);
    console.log(url);
    const query = new URLSearchParams(data);
    url.search = query.toString();
    router.push(url.toString());
  };

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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select contract status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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

          <Button type='submit'>Apply</Button>
        </form>
      </Form>
    </div>
  );
}
export default SearchFilters;
