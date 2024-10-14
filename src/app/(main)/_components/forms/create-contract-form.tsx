'use client';

import { getParcels } from '@/actions/parcels.actions';
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
import { CalendarIcon, FileTextIcon } from 'lucide-react';
import { RefObject, useRef, useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import ContractUploader from './contract-uploader';
import SelectParcelsInput from './select-parcels-input';
import { createContract } from '@/actions/contracts.actions';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getTenants } from '@/actions/tenants.actions';
import { useRouter } from 'next/navigation';

interface CreateContractFormProps {
  contractId?: string;
}

export default function CreateContractForm({
  contractId,
}: CreateContractFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const uploaderRef = useRef<HTMLInputElement>(null);

  const { data: contract } = useQuery({
    queryKey: ['contracts', contractId],
    enabled: Boolean(contractId),
  });

  const form = useForm<CreateContract>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      title: '',
      tenantId: '',
      startDate: new Date(),
      endDate: new Date(),
      soyKgs: 0,
      parcelIds: [],
      files: [],
    },
  });

  // QUERIES
  const {
    data: parcels,
    isPending: isPendingParcels,
    isError: isErrorParcels,
  } = useQuery({
    queryKey: ['parcels'],
    queryFn: () => getParcels(),
  });

  const {
    data: tenants,
    isPending: isPendingTenants,
    isError: isErrorTenants,
  } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => getTenants(),
  });

  if (isPendingParcels || isPendingTenants) {
    return <CustomLoader size='lg' />;
  }

  if (isErrorParcels || isErrorTenants) {
    return (
      <p>Oops! There was an error setting up the from. Try again later.</p>
    );
  }

  // Some issues in GitHub, couldn't find a better way to explicitlly delete files in input
  const resetFiles = (ref: RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.value = '';
    }
  };

  const onSubmit: SubmitHandler<CreateContract> = (data) => {
    startTransition(async () => {
      // This part I'm not so sure if it's the best thing to do
      // I could convert all data to FormData but it's simpler to just serialize the files
      const { files, ...rest } = data;
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const { error } = await createContract({
        data: rest,
        filesSerialized: formData,
      });
      if (!error) {
        toast.success('Contract created');
        form.reset();
        resetFiles(uploaderRef);
        router.refresh();
      } else {
        toast.error('Error creating contract');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-3'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <Input
                  {...field}
                  placeholder='Descriptive title. (e.g. John wheat 2025 summer)'
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='tenantId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tenant</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a tenant' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                        <span className='text-xs text-muted-foreground ml-4'>
                          ({String(tenant.cuit)})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
            name='parcelIds'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Parcels
                  <span className='ml-1 text-muted-foreground'>
                    ({field.value.length} selected)
                  </span>
                </FormLabel>
                <SelectParcelsInput
                  onChange={field.onChange}
                  values={field.value}
                  parcels={parcels}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='files'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Files
                  <span className='ml-1 text-muted-foreground'>
                    ({field.value.length} selected)
                  </span>
                </FormLabel>
                <FormControl>
                  <ContractUploader
                    files={field.value}
                    onChange={(files: File[]) => field.onChange(files)}
                    ref={uploaderRef}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root?.message && (
            <SubmitError message={form.formState.errors.root.message} />
          )}
        </div>

        <LoadingButton isLoading={isPending} className='w-full mt-6'>
          Create
        </LoadingButton>
      </form>
    </Form>
  );
}
