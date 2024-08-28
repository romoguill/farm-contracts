import { Button } from '@/components/ui/button';
import { logout } from '../actions';

export default async function LogoutButton() {
  return (
    <form action={logout}>
      <Button type='submit'>Logout</Button>
    </form>
  );
}
