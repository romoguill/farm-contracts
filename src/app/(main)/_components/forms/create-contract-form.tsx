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
import { useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import ContractUploader from './contract-uploader';
import SelectParcelsInput from './select-parcels-input';

interface CreateContractFormProps {}

export default function CreateContractForm({}: CreateContractFormProps) {
  const [fileUpload, setFileUpload] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const form = useForm<CreateContract>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      soyKgs: 0,
      parcelIds: [],
      files: [],
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

  // const handleUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   const formData = new FormData();

  //   if (file) {
  //     const url = URL.createObjectURL(file);
  //     setFileUpload(file);
  //     setFileUrl(url);
  //     formData.append('pdfUpload', file);
  //     const { error, fileIds } = await uploadContractPdf(formData);
  //     if (error !== null) {
  //       toast.error('Failed to upload file');
  //       return;
  //     }

  //     form.setValue('fileIds', fileIds);
  //   }
  // };

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
      // const { error } = await createContract(data);
      // if (!error) {
      //   toast.success('Contract created');
      // } else {
      //   toast.error('Error creating contract');
      // }
      console.log({ data });
      console.log(fileUpload);
    });
  };

  console.log(form.getValues());

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
            name='parcelIds'
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

          <FormField
            control={form.control}
            name='files'
            render={({ field }) => (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <ContractUploader
                    files={field.value}
                    onChange={(e) =>
                      e.target.files &&
                      field.onChange(Array.from(e.target.files))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            {window.navigator.pdfViewerEnabled ? (
              <object type='application/pdf' data={fileUrl}>
                <embed
                  src={fileUrl}
                  width={800}
                  height={800}
                  type='application/pdf'
                />
              </object>
            ) : (
              <div className='flex gap-2 items-center'>
                <FileTextIcon />
                <span>{fileUpload?.name}</span>
              </div>
            )}
          </div>

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
