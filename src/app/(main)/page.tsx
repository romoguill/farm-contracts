import { validateRequest } from '@/lib/auth';
import LogoutButton from '../auth/_components/logout-button';
import LoadingButton from '@/components/loading-button';

async function MainPage() {
  const { user } = await validateRequest();
  return (
    <div>
      MainPage
      <p>User: {user?.username}</p>
      <LogoutButton />
      <LoadingButton isLoading={false}>Save</LoadingButton>
    </div>
  );
}

export default MainPage;
