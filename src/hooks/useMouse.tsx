import { useRef, useState } from 'react';

export function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const mousePosition = window.addEventListener('mousemove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return position;
}
