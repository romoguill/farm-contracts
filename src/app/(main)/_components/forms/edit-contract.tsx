'use client';

import {
  editContract,
  getContractById,
  getContractPdfUrls,
} from '@/actions/contracts.actions';
import { getParcels } from '@/actions/parcels.actions';
import { getTenants } from '@/actions/tenants.actions';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  cn,
  convertFileUrlToObject,
  formatDateFromCalendar,
} from '@/lib/utils';
import {
  CreateContract,
  createContractSchema,
  EditContract,
  editContractSchema,
} from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RefObject, useEffect, useRef, useState, useTransition } from 'react';
import {
  DefaultValues,
  SubmitHandler,
  useForm,
  UseFormProps,
} from 'react-hook-form';
import { toast } from 'sonner';
import ContractUploader from './contract-uploader';
import SelectParcelsInput from './select-parcels-input';

const defaultValues = {
  title: '',
  tenantId: '',
  startDate: new Date(),
  endDate: new Date(),
  soyKgs: 0,
  parcelIds: [],
  files: [],
};

interface EditContractFormProps {
  contractId?: string;
}

export default function EditContractForm({
  contractId,
}: EditContractFormProps) {
  const [editValues, setEditValues] = useState<CreateContract | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const uploaderRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const contractQueryOptions = queryOptions({
    queryKey: ['contracts', contractId],
    queryFn: () => getContractById(contractId!), // assert since query will be disabled if contractId is undefined
    enabled: Boolean(contractId),
  });

  const { data: contract } = useQuery(contractQueryOptions);

  const { data: pdfUrls } = useQuery({
    queryKey: ['pdfUrls', contractId],
    queryFn: () => getContractPdfUrls(contract!.files), // assert since this query is dependant on the previous result
    enabled: Boolean(contract),
    staleTime: Infinity,
    placeholderData: [],
  });

  const form = useForm<CreateContract>({
    resolver: zodResolver(editContractSchema),
    defaultValues,
    values: editValues || undefined,
  });

  // Some issues on GitHub, couldn't find a better way to explicitlly delete files in input
  const resetFiles = (ref: RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.value = '';
    }
  };

  // <
  //   void,
  //   Error,
  //   {
  //     id: string;
  //     data: Omit<CreateContract, 'files'>;
  //     filesSerialized: FormData;
  //   }
  // >

  type EditPayload = {
    id: string;
    data: Omit<CreateContract, 'files'>;
    filesSerialized: FormData;
  };

  const { mutate, error: submitError } = useMutation({
    mutationFn: (data: EditContract) => {
      if (!contract) throw Error;
      // This part I'm not so sure if it's the best thing to do
      // I could convert all data to FormData but it's simpler to just serialize the files
      const { files, ...rest } = data;
      const formData = new FormData();
      files?.forEach((file) => formData.append('files', file));

      return editContract({
        id: contract.id,
        data: rest,
        filesSerialized: formData,
      });
    },
    onMutate: async (data: EditContract) => {
      await queryClient.cancelQueries(contractQueryOptions);
      const previousContract = queryClient.getQueryData(
        contractQueryOptions.queryKey
      );
      if (!contract) throw Error;

      const { files, ...rest } = data;
      // Set update optimistically the cache. Only problem are files that need further processing.
      // Kind of a hack is to only set the values needed for UI, so that when updating at least the file previwes doesn't go to previous state
      if (previousContract) {
        queryClient.setQueryData(contractQueryOptions.queryKey, {
          ...previousContract,
          ...rest,
          files:
            data.files?.map((file) => ({
              contractId: contract.id,
              id: '',
              name: file.name,
              s3Id: '',
            })) || [],
        });
      }

      return { previousContract };
    },

    onSuccess: () => {
      toast.success('Contract updated');
      form.reset();
      resetFiles(uploaderRef);
      router.refresh();
    },
    onError: (_err, _variables, context) => {
      if (context?.previousContract) {
        queryClient.setQueryData(
          ['contracts', contractId],
          context.previousContract
        );
      }
      toast.error('Error updating contract');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts', contractId] });
    },
  });

  console.log({ submitError });

  useEffect(() => {
    if (!contract) return;
    // // Files will be handled separetly
    const { files, contractToParcel, ...rest } = contract;

    const parcelIds = contractToParcel.map((ctp) => ctp.parcelId);
    console.log({ contract, parcelIds });

    const { data: payloadWithoutFiles, error: validationError } =
      editContractSchema.safeParse({
        parcelIds,
        ...rest,
      });

    console.log({ payloadWithoutFiles });

    if (validationError) return;

    const convertPromises = pdfUrls?.map((url) => convertFileUrlToObject(url));

    if (convertPromises) {
      Promise.all(convertPromises)
        .then((files) => {
          if (files.some((file) => file === undefined)) return;

          setEditValues({
            ...payloadWithoutFiles,
            files: files as File[], //Checked above. TS can't infer boolean filter
          });
          // Default values are cached in react hook form. Need to reset them
          form.reset();
        })
        .catch(console.error);
    }
  }, [contract, pdfUrls, form]);

  console.log({ editValues });

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

  if (!contract || isErrorParcels || isErrorTenants) {
    return (
      <p>Oops! There was an error setting up the from. Try again later.</p>
    );
  }

  const onSubmit: SubmitHandler<CreateContract> = (data) => {
    mutate(data);
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
                  value={field.value}
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
                    ({field.value?.length || 0} selected)
                  </span>
                </FormLabel>
                <SelectParcelsInput
                  onChange={field.onChange}
                  values={field.value || []}
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
