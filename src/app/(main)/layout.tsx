import Navbar from '@/components/navbar/navbar';
import { PropsWithChildren } from 'react';

function AppLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default AppLayout;
