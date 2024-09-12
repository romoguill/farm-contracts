import { cn } from '@/lib/utils';
import { Roboto } from 'next/font/google';
import { PropsWithChildren } from 'react';

const titleFont = Roboto({ weight: '900', subsets: ['latin'] });

function MainTitle({ children }: PropsWithChildren) {
  return (
    <h1
      className={cn(
        'text-2xl md:text-3xl tracking-wide font-bold uppercase text-slate-900 mx-1 md:mx-4 mt-3 mb-2 md:mt-4 md:mb-3',
        titleFont.className
      )}
    >
      {children}
    </h1>
  );
}
export default MainTitle;
