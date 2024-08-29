'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { resendVerificationEmail } from '../actions';

function ResendVerificationCodeButton() {
  const { toast } = useToast();
  const router = useRouter();

  const handleClick = async () => {
    const { error } = await resendVerificationEmail();

    if (!error) {
      toast({
        description: 'Email verified. Welcome!!!',
      });
      return router.push('/dashboard');
    }

    toast({
      variant: 'destructive',
      description: error,
    });
  };

  return (
    <Button
      variant='link'
      onClick={handleClick}
      className='p-0 text-purple-700'
    >
      Resend code
    </Button>
  );
}
export default ResendVerificationCodeButton;
