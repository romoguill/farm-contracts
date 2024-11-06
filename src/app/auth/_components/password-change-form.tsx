'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  forgotPassword,
  verifyPasswordResetEmail,
} from '../password-reset/actions';
import PasswordInput from './password-input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { signUpCredentialsSchema } from '@/lib/validation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePassword } from '../new-password/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import SubmitError from '@/components/forms/submit-error';

const passwordChangeSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    passwordConfirm: z.string(),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  });

type PasswordChangeSchema = z.infer<typeof passwordChangeSchema>;

function PasswordChangeForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<PasswordChangeSchema>({
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
    resolver: zodResolver(passwordChangeSchema),
  });

  const onSubmit: SubmitHandler<PasswordChangeSchema> = (data) => {
    startTransition(async () => {
      const { error } = await changePassword(data.password);
      if (!error) {
        toast.success('Password changed successfully');
        return router.push('/');
      }

      form.setError('root', { message: error });
    });
  };

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-2'
        onSubmit={form.handleSubmit(onSubmit)}
      >
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

        <Button type='submit' variant='secondary' className='mt-6'>
          Change password
        </Button>
      </form>
    </Form>
  );
}
export default PasswordChangeForm;
