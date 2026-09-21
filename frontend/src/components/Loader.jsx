import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Loader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const numRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      onComplete?.();
      return;
    }

    const num = numRef.current;
    const loader = loaderRef.current;
    if (!loader || !num) return;

    const target = { v: 0 };
    const shown = { v: 0 };

    const imgs = [...document.querySelectorAll('img')].filter(
      (i) => !i.complete && i.loading !== 'lazy'
    );
    let loaded = 0;
    const total = Math.max(imgs.length, 1);

    imgs.forEach((i) => {
      const handleLoad = () => {
        loaded++;
        target.v = (loaded / total) * 100;
      };
      i.addEventListener('load', handleLoad, { once: true });
      i.addEventListener('error', handleLoad, { once: true });
    });

    if (!imgs.length) target.v = 100;

    const safetyTimeout = setTimeout(() => {
      target.v = 100;
      shown.v = 100;
    }, 2800);

    const waveAnim = gsap.to('#ldWave', {
      x: 100,
      duration: 1.4,
      ease: 'none',
      repeat: -1
    });

    const spoonAnim = gsap.fromTo(
      '#ldSpoon',
      { rotate: -12 },
      {
        rotate: 14,
        duration: 0.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      }
    );

    const setWave = gsap.quickSetter('#ldWave', 'y', 'px');
    const minTime = 1.4;
    const t0 = performance.now();
    let finished = false;

    const outro = () => {
      gsap
        .timeline({
          onComplete: () => {
            waveAnim.kill();
            spoonAnim.kill();
            onComplete?.();
          }
        })
        .to('.loader__bowl', {
          scale: 0.6,
          rotate: -20,
          opacity: 0,
          duration: 0.5,
          ease: 'back.in(1.7)'
        })
        .to('.loader__note', { opacity: 0, y: 20, duration: 0.3 }, 0)
        .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut' }, 0.25);
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      gsap.ticker.remove(tick);
      if (num) num.textContent = '100';
      outro();
    };

    const tick = () => {
      shown.v += (target.v - shown.v) * 0.08;
      const elapsed = (performance.now() - t0) / 1000;
      const v = Math.min(shown.v, (elapsed / minTime) * 100);
      if (num) num.textContent = String(Math.round(v));
      setWave(-v * 0.82);
      if (v >= 99.5) finish();
    };

    gsap.ticker.add(tick);
    const maxTimeout = setTimeout(finish, 4000);

    return () => {
      clearTimeout(safetyTimeout);
      clearTimeout(maxTimeout);
      gsap.ticker.remove(tick);
      waveAnim.kill();
      spoonAnim.kill();
    };
  }, [onComplete]);

  return (
    <div className="loader" id="loader" ref={loaderRef} aria-hidden="true">
      <div className="loader__bowl">
        <svg viewBox="0 0 200 200">
          <defs>
            <clipPath id="bowlClip">
              <path d="M20 92 H180 A80 80 0 0 1 20 92 Z" />
            </clipPath>
          </defs>
          <g id="ldSpoon" style={{ transformOrigin: '150px 60px' }}>
            <ellipse
              cx="150"
              cy="58"
              rx="15"
              ry="22"
              fill="none"
              stroke="#f2a33a"
              strokeWidth="5"
              transform="rotate(35 150 58)"
            />
            <path
              d="M137 78 L96 146"
              stroke="#f2a33a"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
          <g clipPath="url(#bowlClip)">
            <rect x="0" y="0" width="200" height="200" fill="#0b2a21" />
            <path
              id="ldWave"
              d="M-200 170 Q-175 160 -150 170 T-100 170 T-50 170 T0 170 T50 170 T100 170 T150 170 T200 170 T250 170 T300 170 T350 170 T400 170 V260 H-200 Z"
              fill="#e0457b"
            />
          </g>
          <path
            d="M20 92 H180 A80 80 0 0 1 20 92 Z"
            fill="none"
            stroke="#f7efe0"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M70 172 h60"
            stroke="#f7efe0"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <div className="loader__count">
          <span id="ldNum" ref={numRef}>
            0
          </span>
        </div>
      </div>
      <p className="loader__note">stirring something good…</p>
    </div>
  );
};
