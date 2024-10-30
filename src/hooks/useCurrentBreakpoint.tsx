import resolveConfig from 'tailwindcss/resolveConfig';
import customConfig from '../../tailwind.config';
import { useEffect, useState } from 'react';

export type TwScreen = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export function useCurrentBreakpoint() {
  const twConfig = resolveConfig(customConfig);
  const { screens: breakpoints } = twConfig.theme;

  const [currentScreenWidth, setCurrentScreenWidth] = useState<number>(0);

  useEffect(() => {
    setCurrentScreenWidth(window.innerWidth);

    const listener = (e: UIEvent) => setCurrentScreenWidth(window.innerWidth);

    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, []);

  const getTailwindCurrentBreakpoint = ():
    | { twScreen: TwScreen; breakpoint: number }
    | undefined => {
    if (!currentScreenWidth) return;
    let twScreen: TwScreen = 'sm';
    let breakpoint = 0;
    Object.entries(breakpoints).forEach(([key, value]) => {
      const twBreakPointParsed = Number(value.replace('px', ''));
      if (twBreakPointParsed <= currentScreenWidth) {
        if (breakpoint === 0 || breakpoint < twBreakPointParsed) {
          breakpoint = twBreakPointParsed;
          twScreen = key as TwScreen;
        }
      }
    });

    return { twScreen, breakpoint };
  };

  return {
    currentScreenWidth,
    tw: getTailwindCurrentBreakpoint(),
  };
}
