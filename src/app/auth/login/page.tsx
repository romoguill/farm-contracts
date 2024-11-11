import AuthFormContainer from '../_components/auth-form-container';
import LoginForm from '../_components/login-form';

function LoginPage() {
  return (
    <AuthFormContainer type='login'>
      <LoginForm />
    </AuthFormContainer>
  );
}

export default LoginPage;
