import Navbar from '@/components/navbar/navbar';
import { PropsWithChildren } from 'react';

function AppLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <div className='h-screen'>{children}</div>
    </>
  );
}

export default AppLayout;
