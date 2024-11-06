import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function PasswordResetForm() {
  return (
    <form className='flex gap-2'>
      <Input
        type='email'
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
