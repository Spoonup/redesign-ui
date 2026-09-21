import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const splitElementText = (el) => {
  if (el._split) return el._split;
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const text = n.textContent;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) {
            frag.appendChild(document.createTextNode(' '));
            return;
          }
          const ws = document.createElement('span');
          ws.className = 'split-word';
          [...w].forEach((ch) => {
            const s = document.createElement('span');
            s.className = 'split-char';
            s.textContent = ch;
            ws.appendChild(s);
          });
          frag.appendChild(ws);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains('inline-pic') && n.tagName !== 'IMG') {
        walk(n);
      }
    });
  };

  walk(el);
  const chars = [...el.querySelectorAll('.split-char, .inline-pic')];
  const words = [...el.querySelectorAll('.split-word')];
  el._split = { chars, words };
  return el._split;
};

export const useScrollReveal = (containerRef) => {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = containerRef?.current || document;

    if (reduceMotion) {
      container.querySelectorAll('[data-reveal], [data-clip]').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.clipPath = 'none';
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Split text reveals
      container.querySelectorAll('[data-split]').forEach((el) => {
        const { chars } = splitElementText(el);
        gsap.from(chars, {
          yPercent: 110,
          rotate: 8,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.018,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%'
          }
        });
      });

      // Data reveal fades
      container.querySelectorAll('[data-reveal]').forEach((el) => {
        const delay = parseFloat(el.dataset.reveal || '0');
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'expo.out',
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%'
          }
        });
      });

      // Data clip reveals
      container.querySelectorAll('[data-clip]').forEach((el) => {
        gsap.to(el, {
          clipPath: 'inset(0% 0 0 0 round 30px)',
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%'
          }
        });

        const img = el.querySelector('img');
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -10 },
            {
              yPercent: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                scrub: true
              }
            }
          );
        }
      });
    }, container);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, [containerRef]);
};
