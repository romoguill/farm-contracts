'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SignUpCredentials, signUpCredentialsSchema } from '@/lib/validation';
import { SubmitHandler, useForm } from 'react-hook-form';
import PasswordInput from './password-input';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpWithCredentials } from '../actions';
import LoadingButton from '@/components/loading-button';
import SubmitError from '@/components/forms/submit-error';

export default function SignUpForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpCredentials>({
    resolver: zodResolver(signUpCredentialsSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit: SubmitHandler<SignUpCredentials> = (data) => {
    startTransition(async () => {
      const { error } = await signUpWithCredentials(data);
      if (error) {
        form.setError('root', { message: error });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type='email' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  isVisible={isPasswordVisible}
                  onChangeVisibility={setIsPasswordVisible}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='passwordConfirm'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  isVisible={isPasswordVisible}
                  onChangeVisibility={setIsPasswordVisible}
                  confirmation
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root?.message && (
          <SubmitError message={form.formState.errors.root.message} />
        )}
        <LoadingButton isLoading={isPending}>Sign Up</LoadingButton>
      </form>
    </Form>
  );
}
