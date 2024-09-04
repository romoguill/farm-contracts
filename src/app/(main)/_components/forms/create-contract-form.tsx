'use client';

import { getParcels } from '@/actions/parcels/actions';
import CustomLoader from '@/components/custom-loader';
import SubmitError from '@/components/forms/submit-error';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, formatDateFromCalendar } from '@/lib/utils';
import { CreateContract, createContractSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { CalendarIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import SelectParcelsInput from './select-parcels-input';

interface CreateContractFormProps {}

export default function CreateContractForm({}: CreateContractFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<CreateContract>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      soyKgs: 0,
      parcelId: [],
    },
  });
  const {
    data: parcels,
    isPending: isPendingParcels,
    isError: isErrorParcels,
  } = useQuery({
    queryKey: ['parcels'],
    queryFn: () => getParcels(),
  });

  if (isPendingParcels) {
    return <CustomLoader size='lg' />;
  }

  if (isErrorParcels) {
    return (
      <p>Oops! There was an error setting up the from. Try again later.</p>
    );
  }

  const onSubmit: SubmitHandler<CreateContract> = (data) => {
    startTransition(async () => {
      console.log(data);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-3'>
          <FormField
            control={form.control}
            name='startDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          formatDateFromCalendar(field.value)
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='endDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          formatDateFromCalendar(field.value)
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='soyKgs'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kgs of soy / (Ha x Month)</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='parcelId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kgs of soy / (Ha x Month)</FormLabel>
                <SelectParcelsInput
                  onChange={field.onChange}
                  values={field.value}
                  parcels={parcels}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root?.message && (
            <SubmitError message={form.formState.errors.root.message} />
          )}
        </div>

        <LoadingButton isLoading={isPending} className='w-full mt-6'>
          Sign Up
        </LoadingButton>
      </form>
    </Form>
  );
}
