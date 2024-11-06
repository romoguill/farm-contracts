import CodeVerificationForm from '../_components/code-verification-form';
import ResendVerificationCodeButton from '../_components/resend-verification-code-button';

function EmailVerificationPage() {
  return (
    <div className='bg-background flex flex-col justify-center h-full'>
      <div className='w-[300px] mx-auto space-y-1'>
        <CodeVerificationForm />
        <ResendVerificationCodeButton />
      </div>
    </div>
  );
}

{
  /* <div className='bg-background flex flex-col justify-center h-full'>
  <div className='w-[300px] mx-auto space-y-4'>
    <h1 className='font-semibold text-secondary text-xl'>
      Password Recovery: Step 2/3
    </h1>
    <h2 className='font-semibold text-secondary/80 text-sm'>
      Check your email and paste the code here.
    </h2>
    <ResetCodeVerificationForm />
  </div>
</div>; */
}
export default EmailVerificationPage;
