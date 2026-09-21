import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    if (!isFine || reduceMotion || isTouch) return;

    document.body.classList.add('has-cursor');

    const c = cursorRef.current;
    const d = dotRef.current;
    const label = labelRef.current;
    if (!c || !d) return;

    const xc = gsap.quickTo(c, 'x', { duration: 0.45, ease: 'power3' });
    const yc = gsap.quickTo(c, 'y', { duration: 0.45, ease: 'power3' });
    const xd = gsap.quickTo(d, 'x', { duration: 0.08 });
    const yd = gsap.quickTo(d, 'y', { duration: 0.08 });

    const handlePointerMove = (e) => {
      if (c.classList.contains('is-hidden')) {
        gsap.set([c, d], { x: e.clientX, y: e.clientY });
        c.classList.remove('is-hidden');
      }
      xc(e.clientX);
      yc(e.clientY);
      xd(e.clientX);
      yd(e.clientY);

      const t = e.target.closest?.('[data-cursor]');
      const dark = e.target.closest?.(
        '.counter, .footer, .board, .loader, .drawer-scrim, .mobile-menu, .stamp__back'
      );
      c.classList.toggle('on-dark', !!dark);

      if (t) {
        if (label) label.textContent = t.dataset.cursor || '';
        c.classList.add('is-big');
        c.classList.toggle('is-pink', t.dataset.cursor === 'Drag');
      } else {
        c.classList.remove('is-big', 'is-pink');
      }

      const interactive = e.target.closest?.(
        'a, button, input, textarea, select, summary'
      );
      c.style.opacity = interactive && !t ? '0.4' : '1';
    };

    const handleMouseLeave = () => c.classList.add('is-hidden');
    const handleMouseEnter = () => c.classList.remove('is-hidden');

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div className="cursor is-hidden" id="cursor" ref={cursorRef}>
        <span className="cursor__label" ref={labelRef}></span>
      </div>
      <div className="cursor-dot" id="cursorDot" ref={dotRef}></div>
    </>
  );
};
