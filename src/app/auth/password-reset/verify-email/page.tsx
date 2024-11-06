import PasswordResetForm from '../../_components/password-reset-form';
import ResetCodeVerificationForm from '../../_components/reset-code-verification-form';

function PasswordResetPage() {
  return (
    <div className='bg-background flex flex-col justify-center h-full'>
      <div className='w-[300px] mx-auto space-y-4'>
        <h1 className='font-semibold text-secondary text-xl'>
          Password Recovery: Step 2/2
        </h1>
        <h2 className='font-semibold text-secondary/80 text-sm'>
          Check your email and paste the code sent below
        </h2>
        <ResetCodeVerificationForm />
      </div>
    </div>
  );
}
export default PasswordResetPage;
