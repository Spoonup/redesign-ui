import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const Loader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const numRef = useRef(null);
  const [countDisplay, setCountDisplay] = useState(0);

  useEffect(() => {
    document.body.classList.add('is-loading');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      document.body.classList.remove('is-loading');
      onComplete?.();
      return;
    }

    const loader = loaderRef.current;
    const num = numRef.current;
    if (!loader) return;

    let isDone = false;
    const target = { v: 0 };
    const shown = { v: 0 };
    const t0 = performance.now();
    const minDuration = 1.8; // Smooth 1.8s stirring experience

    // Images load tracking
    const imgs = [...document.querySelectorAll('img')].filter(
      (i) => !i.complete && i.loading !== 'lazy'
    );
    let loadedCount = 0;
    const totalImgs = Math.max(imgs.length, 1);

    if (imgs.length === 0) {
      target.v = 100;
    } else {
      imgs.forEach((img) => {
        const handleImg = () => {
          loadedCount++;
          target.v = Math.min(100, (loadedCount / totalImgs) * 100);
        };
        img.addEventListener('load', handleImg, { once: true });
        img.addEventListener('error', handleImg, { once: true });
      });
    }

    // Safety fallback
    const safetyTimer = setTimeout(() => {
      target.v = 100;
    }, 2400);

    // Wave horizontal loop
    const waveAnim = gsap.to('#ldWave', {
      x: 100,
      duration: 1.4,
      ease: 'none',
      repeat: -1
    });

    // Spoon stirring rocking loop
    const spoonAnim = gsap.fromTo(
      '#ldSpoon',
      { rotation: -14 },
      {
        rotation: 16,
        duration: 0.55,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        transformOrigin: '150px 60px'
      }
    );

    const setWaveY = gsap.quickSetter('#ldWave', 'y', 'px');

    const outro = () => {
      if (isDone) return;
      isDone = true;

      const tl = gsap.timeline({
        onComplete: () => {
          waveAnim.kill();
          spoonAnim.kill();
          document.body.classList.remove('is-loading');
          onComplete?.();
        }
      });

      tl.to('.loader__bowl', {
        scale: 0.65,
        rotation: -20,
        opacity: 0,
        duration: 0.55,
        ease: 'back.in(1.7)'
      })
        .to('.loader__note', { opacity: 0, y: 15, duration: 0.25 }, 0)
        .to(loader, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.8,
          ease: 'expo.inOut'
        }, 0.2);
    };

    const tick = () => {
      shown.v += (target.v - shown.v) * 0.08;
      const elapsed = (performance.now() - t0) / 1000;
      const progress = Math.min(100, Math.max((elapsed / minDuration) * 100, shown.v));

      const rounded = Math.min(100, Math.round(progress));
      if (num) num.textContent = String(rounded);
      setWaveY(-progress * 0.82);

      if (progress >= 99.5 && elapsed >= minDuration) {
        gsap.ticker.remove(tick);
        if (num) num.textContent = '100';
        outro();
      }
    };

    gsap.ticker.add(tick);

    // Hard fallback after 4 seconds
    const maxTimer = setTimeout(() => {
      gsap.ticker.remove(tick);
      if (num) num.textContent = '100';
      outro();
    }, 4000);

    return () => {
      clearTimeout(safetyTimer);
      clearTimeout(maxTimer);
      gsap.ticker.remove(tick);
      waveAnim.kill();
      spoonAnim.kill();
      document.body.classList.remove('is-loading');
    };
  }, [onComplete]);

  return (
    <div className="loader" id="loader" ref={loaderRef} aria-hidden="true">
      <div className="loader__bowl">
        <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
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
