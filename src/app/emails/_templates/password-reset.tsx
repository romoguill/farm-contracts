interface PasswordResetProps {
  code: string;
}

function PasswordResetEmail({ code }: PasswordResetProps) {
  return (
    <div>
      <h1>Password recovery: </h1>
      <p>To reset your password please use the following code</p>
      <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{code}</p>
    </div>
  );
}
export default PasswordResetEmail;
