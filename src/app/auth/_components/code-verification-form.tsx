'use client';

import LoadingButton from '@/components/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';
import { useState, useTransition } from 'react';
import { emailVerification } from '../email-verification/actions';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function CodeVerificationForm() {
  const [code, setCode] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const { error } = await emailVerification(code);
      if (error) {
        toast.error(error);
      }

      toast.success('Email verified. Welcome!!!');

      return router.push('/dashboard');
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Label>Verification Code</Label>
      <div className='flex gap-2'>
        <Input
          placeholder='Enter code sent to you email...'
          type='number'
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <LoadingButton size='icon' isLoading={isPending} variant='secondary'>
          <ArrowRight />
        </LoadingButton>
      </div>
    </form>
  );
}
export default CodeVerificationForm;
