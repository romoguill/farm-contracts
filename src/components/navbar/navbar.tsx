import Image from 'next/image';
import Link from 'next/link';
import { NavbarLink } from './navbar-link';

const routes = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Contracts',
    href: '/contracts',
  },
  {
    label: 'Parcels',
    href: '/parcels',
  },
];

function Navbar() {
  return (
    <header className='bg-foreground text-background h-[62px] md:h-[80px] p-3 sticky flex flex-nowrap items-center justify-between'>
      <Image
        src={'/contract.png'}
        width={40}
        height={40}
        alt='App logo'
        className='mx-4'
      />
      <nav className='flex-1'>
        <ul className='flex gap-4 font-bold'>
          {routes.map((route) => (
            <li key={route.href}>
              <NavbarLink route={route} />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
export default Navbar;
