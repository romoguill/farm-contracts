import { useEffect, useState } from 'react';

export function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setPosition({ x: e.clientX, y: e.clientY });
    }

    window.addEventListener('mousemove', (e) => handleMouseMove(e));

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}
