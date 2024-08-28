import { validateRequest } from '@/lib/auth';
import LogoutButton from '../auth/_components/logout-button';

async function MainPage() {
  const { user } = await validateRequest();
  return (
    <div>
      MainPage
      <p>User: {user?.username}</p>
      <LogoutButton />
    </div>
  );
}

export default MainPage;
