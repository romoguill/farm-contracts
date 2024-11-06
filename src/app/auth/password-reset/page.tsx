import PasswordResetForm from '../_components/password-reset-form';

function PasswordResetPage() {
  return (
    <div className='bg-background flex flex-col justify-center h-full'>
      <div className='w-[300px] mx-auto space-y-4'>
        <h1 className='font-semibold text-secondary text-xl'>
          Password Recovery: Step 1/2
        </h1>
        <PasswordResetForm />
      </div>
    </div>
  );
}
export default PasswordResetPage;
