import CodeVerificationForm from '../_components/code-verification-form';
import ResendVerificationCodeButton from '../_components/resend-verification-code-button';

function EmailVerificationPage() {
  return (
    <div className='h-full flex flex-col items-center justify-center'>
      <div>
        <CodeVerificationForm />
        <ResendVerificationCodeButton />
      </div>
    </div>
  );
}
export default EmailVerificationPage;
