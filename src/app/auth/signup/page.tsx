import AuthFormContainer from '../_components/auth-form-container';
import SignUpForm from '../_components/signup-form';

export default function SignUpPage() {
  return (
    <AuthFormContainer type='signup'>
      <SignUpForm />
    </AuthFormContainer>
  );
}
