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
import { LoginCredentials, loginCredentialsSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { loginWithCredentials } from '../actions';
import PasswordInput from './password-input';
import Link from 'next/link';

export default function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginCredentialsSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginCredentials> = (data) => {
    startTransition(async () => {
      const { error } = await loginWithCredentials(data);
      if (!error) {
        return router.replace('/dashboard');
      }

      form.setError('root', { message: error });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-3'>
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

          <Link
            href='/auth/password-reset'
            className='text-end block text-[13px] text-red-600 hover:text-red-500 hover:underline cursor-pointer'
          >
            Forgot password?
          </Link>

          {form.formState.errors.root?.message && (
            <SubmitError message={form.formState.errors.root.message} />
          )}
        </div>

        <LoadingButton isLoading={isPending} className='w-full mt-6'>
          Sign In
        </LoadingButton>
      </form>
    </Form>
  );
}
