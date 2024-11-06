import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { forgotPassword } from '../password-reset/actions';

function PasswordResetForm() {
  return (
    <form className='flex gap-2' action={forgotPassword}>
      <Input
        type='email'
        name='email'
        placeholder='Enter your email...'
        className='w-3/4'
        required
      />
      <Button type='submit' variant='secondary' className='flex-shrink'>
        Reset
      </Button>
    </form>
  );
}
export default PasswordResetForm;
