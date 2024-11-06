import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { forgotPassword } from '../password-reset/actions';

function ResetCodeVerificationForm() {
  return (
    <form className='flex gap-2' action={forgotPassword}>
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
