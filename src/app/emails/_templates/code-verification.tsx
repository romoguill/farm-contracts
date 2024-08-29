interface CodeVerificationProps {
  name: string;
  code: string;
}

function CodeVerification({ name, code }: CodeVerificationProps) {
  return (
    <div>
      <p>
        Welcome, <span style={{ textTransform: 'capitalize' }}>{name}</span>!
      </p>
      <p>To complete the registration process use the code below</p>
      <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{code}</p>
    </div>
  );
}
export default CodeVerification;
