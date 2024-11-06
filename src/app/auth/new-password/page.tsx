import { getCurrentPasswordResetSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PasswordChangeForm from '../_components/password-change-form';

async function NewPasswordPage() {
  // Validate if user has a session and that it has been verified
  const session = await getCurrentPasswordResetSession();

  if (!session || !session.emailVerified) {
    redirect('/auth/login');
  }

  return (
    <div className='bg-background flex flex-col justify-center h-full'>
      <div className='w-[300px] mx-auto space-y-4'>
        <h1 className='font-semibold text-secondary text-xl'>
          Password Recovery: Step 3/3
        </h1>
        <PasswordChangeForm />
      </div>
    </div>
  );
}
export default NewPasswordPage;
