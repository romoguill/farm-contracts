'use client';

import LoadingButton from '@/components/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';
import { useState, useTransition } from 'react';
import { emailVerification } from '../email-verification/actions';
import { useToast } from '@/components/ui/use-toast';

function CodeVerificationForm() {
  const [code, setCode] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const { error } = await emailVerification(code);
      if (error) {
        toast({
          variant: 'destructive',
          description: error,
        });
      }
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
        <LoadingButton size='icon' isLoading={isPending}>
          <ArrowRight />
        </LoadingButton>
      </div>
    </form>
  );
}
export default CodeVerificationForm;
