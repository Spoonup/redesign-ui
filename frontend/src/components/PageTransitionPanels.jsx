import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export const PageTransitionPanels = () => {
  const panelsRef = useRef(null);
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !panelsRef.current) return;

    const panels = panelsRef.current.querySelectorAll('span');
    const tl = gsap.timeline();

    gsap.set(panels, { scaleY: 0, transformOrigin: 'bottom' });
    tl.to(panels, {
      scaleY: 1,
      duration: 0.35,
      ease: 'power3.inOut',
      stagger: 0.04
    })
      .set(panels, { transformOrigin: 'top' })
      .to(panels, {
        scaleY: 0,
        duration: 0.45,
        ease: 'power3.inOut',
        stagger: 0.04,
        delay: 0.05
      });
  }, [location.pathname]);

  return (
    <div className="loader__panels" id="panels" ref={panelsRef} aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};
