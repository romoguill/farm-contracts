import { PropsWithChildren } from 'react';

function AuthLayout({ children }: PropsWithChildren) {
  return <div className='h-full w-full bg-stone-50'>{children}</div>;
}
export default AuthLayout;
