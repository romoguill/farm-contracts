import { PropsWithChildren } from 'react';

function MainContainer({ children }: PropsWithChildren) {
  return (
    <main className='mt-6 mb-8 mx-auto p-2 md:p-4 max-w-7xl'>{children}</main>
  );
}
export default MainContainer;
