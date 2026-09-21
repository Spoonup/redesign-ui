import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useMagnetic = (ref = null) => {
  const localRef = useRef(null);
  const targetRef = ref || localRef;

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || reduceMotion) return;

    const el = targetRef.current;
    if (!el) return;

    const handlePointerMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.3;
      const y = (e.clientY - r.top - r.height / 2) * 0.4;
      gsap.to(el, {
        x,
        y,
        duration: 0.5,
        ease: 'power3'
      });
    };

    const handlePointerLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: 'elastic.out(1, 0.35)'
      });
    };

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [targetRef]);

  return targetRef;
};
