import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let globalLenis = null;

export const getLenis = () => globalLenis;

export const scrollTo = (target, options = {}) => {
  if (globalLenis) {
    globalLenis.scrollTo(target, options);
  } else {
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: options.immediate ? 'auto' : 'smooth' });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        el.scrollIntoView({ behavior: options.immediate ? 'auto' : 'smooth' });
      }
    }
  }
};

export const useSmoothScroll = (isPaused = false) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || isTouch) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.95
    });
    lenisRef.current = lenis;
    globalLenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(500, 33);

    // Smooth scroll for in-page hash links
    const handleAnchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (a) {
        const hash = a.getAttribute('href');
        if (hash && hash.length > 1) {
          const targetEl = document.querySelector(hash);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl, { offset: -80 });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
    };
  }, []);

  useEffect(() => {
    if (!lenisRef.current) return;
    if (isPaused) {
      lenisRef.current.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenisRef.current.start();
      document.body.style.overflow = '';
    }
  }, [isPaused]);

  return lenisRef;
};
