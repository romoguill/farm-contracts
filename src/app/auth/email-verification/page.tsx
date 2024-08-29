import LoadingButton from '@/components/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

function EmailVerificationPage() {
  return (
    <div className='h-full flex items-center justify-center'>
      <form>
        <Label>Verification Code</Label>
        <div className='flex gap-2'>
          <Input placeholder='Enter code sent to you email...' type='number' />
          <LoadingButton size='icon'>
            <ArrowRight />
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
export default EmailVerificationPage;
