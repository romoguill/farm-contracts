'use client';

import { Button } from '@/components/ui/button';
import { resendVerificationEmail } from '../actions';
import { toast } from 'sonner';

function ResendVerificationCodeButton() {
  const handleClick = async () => {
    const { error } = await resendVerificationEmail();

    if (!error) {
      toast.success('Done. Please check you inbox');
    }

    toast.error(error);
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
