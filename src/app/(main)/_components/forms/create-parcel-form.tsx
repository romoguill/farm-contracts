'use client';

import SubmitError from '@/components/forms/submit-error';
import LoadingButton from '@/components/loading-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateParcel, createParcelSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export default function CreateParcelForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateParcel>({
    resolver: zodResolver(createParcelSchema),
  });

  const onSubmit: SubmitHandler<CreateParcel> = (data) => {
    startTransition(async () => {});
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className='text-destructive'>DISABLED FOR NOW</h2>
        <div className='space-y-3'>
          <FormField
            control={form.control}
            name='label'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label (XX)</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={2} minLength={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='area'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area (Has)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='number'
                    // value={field.value}
                    // onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TODO: create a coordinates input */}
          {/* <FormField
            control={form.control}
            name='coordinates'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coordinates</FormLabel>
                <FormControl></FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

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
