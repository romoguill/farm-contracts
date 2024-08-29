interface CodeVerificationProps {
  name: string;
  code: string;
}

function CodeVerification({ name, code }: CodeVerificationProps) {
  return (
    <div>
      <p>
        {name}, thank you for signing up to the app. Please use the code below
        to complete the process
      </p>
      <p className='font-bold text-2xl'>{code}</p>
    </div>
  );
}
export default CodeVerification;
