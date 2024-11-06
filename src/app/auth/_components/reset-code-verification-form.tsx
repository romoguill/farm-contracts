import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  forgotPassword,
  verifyPasswordResetEmail,
} from '../password-reset/actions';

function ResetCodeVerificationForm() {
  return (
    <form className='flex gap-2' action={verifyPasswordResetEmail}>
      <Input
        type='text'
        name='code'
        placeholder='Enter code...'
        className='w-3/4'
        required
      />
      <Button type='submit' variant='secondary' className='flex-shrink'>
        Confirm
      </Button>
    </form>
  );
}
export default ResetCodeVerificationForm;
