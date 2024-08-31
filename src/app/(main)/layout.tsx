import Navbar from '@/components/navbar/navbar';
import { PropsWithChildren } from 'react';

function AppLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className='w-full h-full'>{children}</main>
    </>
  );
}

export default AppLayout;
