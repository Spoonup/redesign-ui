import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { SPOONUP, formatRupee } from '../data/data';
import { DishCard } from '../components/DishCard';
import { useCart } from '../context/CartContext';
import { useQuickView } from '../context/QuickViewContext';
import { useScrollReveal, splitElementText } from '../hooks/useScrollReveal';
import { scrollTo } from '../hooks/useSmoothScroll';

gsap.registerPlugin(ScrollTrigger, Draggable, MotionPathPlugin);

const ARROW_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const PLUS_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const POLAROID_SPOTS = [
  { id: 'chia', left: 6, top: 4, rot: -9 },
  { id: 'dragon', left: 54, top: 0, rot: 7 },
  { id: 'modak', left: 60, top: 50, rot: -5 },
  { id: 'tikki', left: 2, top: 52, rot: 6 },
  { id: 'walnut', left: 30, top: 27, rot: -2 }
];

const RIBBON_A = [
  'Chia pudding',
  'Paan modak',
  'Sabudana tikki',
  'Dragon fruit',
  'Kashmiri walnuts',
  'Peri peri fries',
  'Muesli'
];

const RIBBON_B = [
  'No refined sugar',
  'High protein',
  'Real ingredients',
  'Made with love',
  'Made fresh'
];

const ANATOMY_CHIPS = [
  { letter: 'C', name: 'Chia seeds', sub: 'the base', color: '#f2a33a' },
  { letter: 'S', name: 'Skyr', sub: 'thick & protein-rich', color: '#efe3cc' },
  { letter: 'C', name: 'Cocoa', sub: 'the chocolate bit', color: '#8a5a3c' },
  { letter: 'A', name: 'Almonds', sub: 'crunch', color: '#e8c89a' },
  { letter: 'C', name: 'Cashew', sub: 'creaminess', color: '#f3dcb5' },
  { letter: 'W', name: 'Whey protein', sub: 'extra protein', color: '#e0457b' },
  { letter: 'D', name: 'Dates', sub: 'the only sweetener', color: '#6b3f2a' },
  { letter: 'V', name: 'Vanilla', sub: 'the warm note', color: '#f7d77a' }
];

const STAMPS = [
  {
    title: 'High Protein',
    ring: 'HIGH PROTEIN • HIGH PROTEIN • ',
    bg: '#123e31',
    fg: '#f7efe0',
    glyph: 'P',
    back: 'Built around nuts, seeds, dry fruits and whole grains, so a small serving carries real nutritional value.'
  },
  {
    title: 'Real Ingredients',
    ring: 'REAL FOOD • REAL FOOD • REAL FOOD • ',
    bg: '#f2a33a',
    fg: '#0b2a21',
    glyph: 'R',
    back: "Nothing you wouldn't find in a home kitchen. We avoid unnecessary additives."
  },
  {
    title: 'No Refined Sugar',
    ring: 'ZERO REFINED SUGAR • ZERO • ',
    bg: '#e0457b',
    fg: '#fff',
    glyph: '0',
    back: 'Our sweet things are sweetened with natural alternatives like dates, never refined white sugar.'
  },
  {
    title: 'Made With Love',
    ring: 'MADE WITH LOVE • WITH CARE • ',
    bg: '#8a6d3b',
    fg: '#fff',
    glyph: '♡',
    back: 'From picking ingredients to preparing and packing, we care about quality, freshness and honest food.'
  }
];

export const HomePage = () => {
  const containerRef = useRef(null);
  const { addToCart } = useCart();
  const { openQuickView } = useQuickView();

  useScrollReveal(containerRef);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    const ribbonStepCallbacks = [];

    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      /* HERO ANIMATIONS */
      const heroTitle = document.getElementById('heroTitle');
      if (heroTitle) {
        const { chars } = splitElementText(heroTitle);
        const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        heroTl
          .from(chars, { yPercent: 120, rotate: 12, duration: 1.3, stagger: 0.028 })
          .from('.hero__kicker', { y: 20, opacity: 0, duration: 0.8 }, 0)
          .from('[data-hero-fade]', { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, 0.5)
          .from('.table__plate', { scale: 0.4, opacity: 0, rotate: -90, duration: 1.4 }, 0.2)
          .from(
            '.polaroid',
            {
              y: () => -window.innerHeight,
              rotation: () => gsap.utils.random(-50, 50),
              duration: 1.3,
              ease: 'bounce.out',
              stagger: 0.12
            },
            0.4
          )
          .from('.table__hint', { opacity: 0, duration: 0.6 }, 1.6)
          .fromTo(
            '#hintPath',
            { strokeDasharray: 120, strokeDashoffset: 120 },
            { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' },
            1.7
          )
          .from('.hero__proof div', { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.9);
      }

      // Initialize Polaroids with initial rotation
      document.querySelectorAll('.polaroid').forEach((el) => {
        const r = parseFloat(el.dataset.r || '0');
        gsap.set(el, { rotation: r });
      });

      // Draggable Polaroids
      let zIndexCounter = 10;
      Draggable.create('.polaroid', {
        bounds: '#table',
        zIndexBoost: false,
        onPress() {
          this.target.style.zIndex = ++zIndexCounter;
          gsap.to(this.target, {
            scale: 1.08,
            rotation: 0,
            boxShadow: '0 40px 60px -20px rgba(16,35,28,.55)',
            duration: 0.3
          });
        },
        onRelease() {
          const originalR = parseFloat(this.target.dataset.r || '0');
          gsap.to(this.target, {
            scale: 1,
            rotation: originalR + gsap.utils.random(-6, 6),
            boxShadow: '0 18px 40px -18px rgba(16,35,28,.5)',
            duration: 0.6,
            ease: 'back.out(2)'
          });
        },
        onDrag() {
          gsap.to(this.target, {
            rotation: gsap.utils.clamp(-20, 20, this.deltaX * 1.2),
            duration: 0.3
          });
        }
      });

      // Table mouse parallax
      if (isFinePointer) {
        const plate = document.querySelector('.table__plate');
        if (plate) {
          const px = gsap.quickTo(plate, 'x', { duration: 1.2, ease: 'power3' });
          const py = gsap.quickTo(plate, 'y', { duration: 1.2, ease: 'power3' });
          let heroOn = true;
          ScrollTrigger.create({
            trigger: '.hero',
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (s) => (heroOn = s.isActive)
          });
          const handleMove = (e) => {
            if (!heroOn) return;
            px(((e.clientX / window.innerWidth) - 0.5) * 30);
            py(((e.clientY / window.innerHeight) - 0.5) * 30);
          };
          window.addEventListener('pointermove', handleMove);
        }
      }

      // Hero scroll scrub
      gsap.to('.hero__grid > div:first-child', {
        yPercent: -18,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      /* RIBBONS: Velocity reactive */
      document.querySelectorAll('.ribbon').forEach((r, idx) => {
        const tracks = [...r.querySelectorAll('.ribbon__track')];
        const dir = idx === 0 ? 1 : -1;
        const setX = tracks.map((t) => gsap.quickSetter(t, 'x', 'px'));
        const setSkew = gsap.quickSetter(r, 'skewX', 'deg');
        let x = 0;
        let vel = 0;
        let width = tracks[0]?.offsetWidth || 1000;

        const updateWidth = () => {
          if (tracks[0]) width = tracks[0].offsetWidth;
        };
        window.addEventListener('resize', updateWidth);

        const step = () => {
          if (!width) return;
          x -= (1.1 + Math.abs(vel)) * dir * (vel < 0 ? -1 : 1);
          vel *= 0.92;
          x = (((x % width) - width) % width);
          setX.forEach((f) => f(x));
          setSkew(gsap.utils.clamp(-8, 8, vel * 1.5));
        };

        ribbonStepCallbacks.push(step);

        ScrollTrigger.create({
          trigger: '.ribbons',
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (s) => {
            vel = s.getVelocity() / 300;
          },
          onToggle: (s) => (s.isActive ? gsap.ticker.add(step) : gsap.ticker.remove(step))
        });
      });

      /* MANIFESTO WORDS LIGHT UP */
      const manifesto = document.getElementById('manifesto');
      if (manifesto) {
        const walkWords = (node) => {
          [...node.childNodes].forEach((n) => {
            if (n.nodeType === 3) {
              const frag = document.createDocumentFragment();
              n.textContent.split(/(\s+)/).forEach((w) => {
                if (!w) return;
                if (/^\s+$/.test(w)) {
                  frag.appendChild(document.createTextNode(' '));
                  return;
                }
                const s = document.createElement('span');
                s.className = 'w';
                s.textContent = w;
                frag.appendChild(s);
              });
              n.replaceWith(frag);
            } else if (n.classList && n.classList.contains('pic')) {
              n.classList.add('w');
            } else {
              walkWords(n);
            }
          });
        };
        walkWords(manifesto);

        gsap.to(manifesto.querySelectorAll('.w'), {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: manifesto,
            start: 'top 80%',
            end: 'bottom 45%',
            scrub: true
          }
        });

        manifesto.querySelectorAll('.pic').forEach((p) => {
          gsap.from(p, {
            scale: 0,
            rotate: -30,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: p,
              start: 'top 75%',
              end: 'top 55%',
              scrub: 1
            }
          });
        });
      }

      /* COUNTER: Horizontal pinned track */
      const mm = gsap.matchMedia();
      mm.add('(min-width: 901px)', () => {
        const track = document.getElementById('counterTrack');
        const counterSection = document.getElementById('counter');
        if (!track || !counterSection) return;

        const dist = () => track.scrollWidth - window.innerWidth;
        const tilt = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' });
        const setBar = gsap.quickSetter('#counterBar', 'scaleX');

        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: counterSection,
            start: 'top top',
            end: () => '+=' + dist(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (s) => {
              setBar(s.progress);
              tilt(gsap.utils.clamp(-5, 5, s.getVelocity() / -300));
            }
          }
        });

        counterSection.querySelectorAll('.dish').forEach((d) => {
          const img = d.querySelector('img') || d;
          gsap.from(img, {
            scale: 1.5,
            ease: 'none',
            scrollTrigger: {
              trigger: d,
              containerAnimation: tween,
              start: 'left right',
              end: 'center center',
              scrub: true
            }
          });
        });
      });

      /* ANATOMY: Exploding jar */
      const chipsEl = [...document.querySelectorAll('#ingChips .chip')];
      if (chipsEl.length) {
        const getLayout = () => {
          const small = window.innerWidth < 800;
          const rx = small ? window.innerWidth * 0.3 : Math.min(window.innerWidth * 0.36, 600);
          const ry = small ? window.innerHeight * 0.27 : Math.min(window.innerHeight * 0.27, 250);
          return chipsEl.map((c, i) => {
            const a = (i / chipsEl.length) * Math.PI * 2 - Math.PI / 2 + 0.2;
            return {
              x: Math.cos(a) * rx - c.offsetWidth / 2,
              y: Math.sin(a) * ry - c.offsetHeight / 2 + (small ? 50 : 0)
            };
          });
        };

        gsap.set(chipsEl, {
          xPercent: 0,
          x: (i) => -chipsEl[i].offsetWidth / 2,
          y: (i) => -chipsEl[i].offsetHeight / 2,
          scale: 0,
          opacity: 0
        });

        const atl = gsap.timeline({
          scrollTrigger: {
            trigger: '#anatomy',
            start: 'top top',
            end: '+=180%',
            pin: '.anatomy__pin',
            scrub: 1,
            invalidateOnRefresh: true
          }
        });

        atl
          .from('.anatomy__title', { y: -40, opacity: 0, duration: 0.3 })
          .from('#jar', { scale: 0.3, rotate: -120, duration: 1, ease: 'power2.out' }, 0)
          .from('.anatomy__ring', { scale: 0, opacity: 0, stagger: 0.15, duration: 0.8 }, 0.1)
          .to(
            chipsEl,
            {
              x: (i) => getLayout()[i].x,
              y: (i) => getLayout()[i].y,
              scale: 1,
              opacity: 1,
              rotation: () => gsap.utils.random(-8, 8),
              stagger: 0.08,
              duration: 1,
              ease: 'back.out(1.4)'
            },
            0.5
          )
          .to('#jar', { rotate: 25, duration: 1.6 }, 0.5)
          .from('#label', { y: 60, opacity: 0, duration: 0.6 }, 1.2)
          .from('#label .row', { opacity: 0, y: 14, stagger: 0.08, duration: 0.3 }, 1.35)
          .from('.anatomy__cta', { y: 40, opacity: 0, duration: 0.5 }, 1.5)
          .to({}, { duration: 0.4 });

        const floats = chipsEl.map((c, i) =>
          gsap.to(c, {
            yPercent: '+=12',
            duration: 1.6 + i * 0.12,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            paused: true
          })
        );

        ScrollTrigger.create({
          trigger: '#anatomy',
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (s) => floats.forEach((t) => (s.isActive ? t.play() : t.pause()))
        });
      }

      /* ROUTE: Path draws, rider travels */
      mm.add('(min-width: 861px)', () => {
        const path = document.getElementById('routePath');
        if (path) {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          const rt = gsap.timeline({
            scrollTrigger: {
              trigger: '.route__map',
              start: 'top 80%',
              end: 'bottom 60%',
              scrub: 1
            }
          });
          rt.to(path, { strokeDashoffset: 0, ease: 'none' }, 0);
          rt.to(
            '#routeRider',
            {
              motionPath: {
                path: '#routePath',
                align: '#routePath',
                alignOrigin: [0.5, 0.5]
              },
              ease: 'none'
            },
            0
          );
        }
      });

      document.querySelectorAll('.stop__img img').forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.25 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      });

      /* STAMPS: Drop like stamps */
      gsap.from('.stamp', {
        scale: 1.6,
        rotation: () => gsap.utils.random(-14, 14),
        opacity: 0,
        duration: 0.5,
        ease: 'power4.in',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '#stamps',
          start: 'top 80%'
        },
        onComplete: () => {
          gsap.fromTo('#stamps', { x: -3 }, { x: 0, duration: 0.3, ease: 'elastic.out(1, 0.2)' });
        }
      });

      /* CHALKBOARD */
      const bt = gsap.timeline({
        scrollTrigger: {
          trigger: '#board',
          start: 'top 70%'
        }
      });
      bt.from('#board', { rotation: -2, y: 60, duration: 1, ease: 'expo.out' })
        .from('.board h2', { clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'power2.inOut' }, 0.2)
        .from('.board__list li', { clipPath: 'inset(0 100% 0 0)', duration: 0.7, ease: 'power1.inOut', stagger: 0.18 }, 0.5);

      // Refresh ScrollTrigger after DOM renders
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);

      return () => clearTimeout(timer);
    }, containerRef);

    return () => {
      ribbonStepCallbacks.forEach((step) => gsap.ticker.remove(step));
      ctx.revert();
    };
  }, []);

  const readyNowProducts = SPOONUP.products.filter((p) => p.mode === 'now');

  return (
    <div ref={containerRef}>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="wrap hero__grid">
          <div>
            <div className="hero__kicker mono">
              <span className="dot"></span> Good food, higher days
            </div>
            <h1 className="hero__title display" id="heroTitle">
              <span className="split-line">
                Small{' '}
                <span className="inline-pic">
                  <img
                    src="https://storage.googleapis.com/spoonup-508319-product-images/products/1789196981574-9775dbb9-ef35-4098-bcc7-e36802135ff3.jpg"
                    alt=""
                  />
                </span>
              </span>
              <span className="split-line">indulgences,</span>
              <span className="split-line l2">big impact.</span>
            </h1>
            <p className="hero__sub" data-hero-fade>
              Protein chia puddings, paan-gulkand modaks, crispy sabudana tikkis and{' '}
              <strong>100% pure Kashmiri dry fruits</strong>. Real ingredients, sweetened without
              refined sugar.
            </p>
            <div className="hero__ctas" data-hero-fade>
              <Link className="btn" to="/shop" data-magnet>
                Order now <span className="btn__icon">{ARROW_ICON}</span>
              </Link>
              <a
                className="link-u"
                href="#counter"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('#counter', { offset: -40 });
                }}
              >
                See today's counter ↓
              </a>
            </div>
            <div className="hero__proof" data-hero-fade>
              <div>
                <b>0g</b>
                <span>refined sugar</span>
              </div>
              <div>
                <b>10</b>
                <span>things on the menu</span>
              </div>
              <div>
                <b>₹499</b>
                <span>for free delivery</span>
              </div>
            </div>
          </div>

          <div className="table" id="table">
            <div className="table__plate"></div>
            {POLAROID_SPOTS.map(({ id, left, top, rot }) => {
              const p = SPOONUP.products.find((prod) => prod.id === id);
              if (!p) return null;
              return (
                <figure
                  key={id}
                  className="polaroid"
                  data-cursor="Drag"
                  data-r={rot}
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    margin: 0
                  }}
                >
                  <span className="tape"></span>
                  <img src={p.img} alt={p.name} draggable="false" />
                  <figcaption>
                    {p.name.split(' ').slice(0, 3).join(' ')}
                    <b>{formatRupee(p.price)}</b>
                  </figcaption>
                </figure>
              );
            })}
            <div className="table__hint" aria-hidden="true">
              <svg
                viewBox="0 0 64 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path
                  id="hintPath"
                  d="M60 44 C 40 46, 20 38, 12 14 M12 14 l-6 10 M12 14 l10 6"
                />
              </svg>
              go on, move the food
            </div>
          </div>
        </div>
        <div className="hero__scroll mono">
          <i></i> scroll
        </div>
      </section>

      {/* ============ RIBBONS ============ */}
      <div className="ribbons" aria-hidden="true">
        <div className="ribbon ribbon--b">
          <div className="ribbon__track">
            {RIBBON_B.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
          <div className="ribbon__track">
            {RIBBON_B.map((t, i) => (
              <span key={`dup-${i}`}>{t}</span>
            ))}
          </div>
        </div>
        <div className="ribbon ribbon--a">
          <div className="ribbon__track">
            {RIBBON_A.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
          <div className="ribbon__track">
            {RIBBON_A.map((t, i) => (
              <span key={`dup-${i}`}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ============ MANIFESTO ============ */}
      <section className="manifesto">
        <div className="wrap">
          <div className="manifesto__label mono">Why SpoonUp</div>
          <p className="manifesto__text" id="manifesto">
            We believe food can be both <span className="accent">delicious</span>{' '}
            <span className="pic">
              <img
                src="https://storage.googleapis.com/spoonup-508319-product-images/products/1789197852770-76cfebe3-5724-409b-b56b-062e4aa55b33.jpg"
                alt=""
              />
            </span>{' '}
            and <span className="accent">nutritious.</span> Real ingredients from a home kitchen,{' '}
            <span className="pic">
              <img
                src="https://storage.googleapis.com/spoonup-508319-product-images/products/catalog-prod-9.jpg"
                alt=""
              />
            </span>{' '}
            made to bring a little more goodness to busy days.
          </p>
          <p className="manifesto__sign" data-reveal>
            – from the SpoonUp kitchen ♡
          </p>
        </div>
      </section>

      {/* ============ COUNTER (horizontal) ============ */}
      <section className="counter" id="counter">
        <div className="counter__pin">
          <div className="wrap counter__head">
            <h2 className="counter__title display" data-split>
              Today's <em>counter</em>
            </h2>
            <div className="counter__aside">
              <span className="hand">ten things, zero refined sugar</span>
              From crispy snacks to Kashmir's orchards. Tap a photo for details, or add straight to
              your cart.
              <div className="counter__progress">
                <i id="counterBar"></i>
              </div>
            </div>
          </div>
          <div className="counter__scroller">
            <div className="counter__track" id="counterTrack">
              {SPOONUP.products.map((p, i) => (
                <DishCard key={p.id} product={p} index={i} />
              ))}
              <div className="dish dish--end">
                <div className="display">That's the lot.</div>
                <p className="hand" style={{ fontSize: '20px', margin: 0 }}>
                  for now, anyway
                </p>
                <Link className="btn btn--sun" to="/shop">
                  Open the full pantry <span className="btn__icon">{ARROW_ICON}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ JAR ANATOMY ============ */}
      <section className="anatomy" id="anatomy">
        <div className="anatomy__pin">
          <div className="anatomy__title">
            <h2 className="display">What's in the jar?</h2>
            <p>Chocolate Protein Chia Pudding. Eight ingredients, nothing hidden.</p>
          </div>
          <div className="anatomy__ring" style={{ width: '48vmin', height: '48vmin' }}></div>
          <div className="anatomy__ring" style={{ width: '74vmin', height: '74vmin' }}></div>
          <div className="anatomy__jar" id="jar">
            <img
              src="https://storage.googleapis.com/spoonup-508319-product-images/products/1789197852770-76cfebe3-5724-409b-b56b-062e4aa55b33.jpg"
              alt="Chocolate Protein Chia Pudding"
            />
          </div>
          <div id="ingChips">
            {ANATOMY_CHIPS.map(({ letter, name, sub, color }, i) => (
              <div key={i} className="chip" style={{ '--c': color }}>
                <i
                  style={{
                    fontFamily: 'var(--f-display)',
                    color: ['#8a5a3c', '#6b3f2a', '#e0457b'].includes(color)
                      ? '#fff'
                      : 'var(--forest)'
                  }}
                >
                  {letter}
                </i>
                {name} <small>{sub}</small>
              </div>
            ))}
          </div>
          <div className="anatomy__label" id="label">
            <span className="anatomy__label-t">Honest label</span>
            <span className="row">
              <small>Refined sugar</small>
              <b>0 g</b>
            </span>
            <span className="row">
              <small>Sweetened with</small>
              <b>Dates</b>
            </span>
            <span className="row">
              <small>Protein from</small>
              <b>Skyr + whey</b>
            </span>
            <span className="row">
              <small>Guilt</small>
              <b>Nil</b>
            </span>
          </div>
          <div className="anatomy__cta">
            <button
              className="btn"
              onClick={(e) => addToCart('chia', e.currentTarget)}
              data-magnet
            >
              Add a jar · ₹320 <span className="btn__icon">{PLUS_ICON}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============ KASHMIR ROUTE ============ */}
      <section className="route">
        <div className="wrap">
          <div className="route__head">
            <h2 className="display" data-split>
              Kashmir <span>ke</span> dry fruits.
            </h2>
            <p data-reveal>
              Straight from the farms of Kashmir, sun-dried and hand-sorted. 100% pure, guaranteed.
              No blends, no fillers, no mystery.
            </p>
          </div>
          <div className="route__map">
            <svg
              className="route__svg"
              viewBox="0 0 1200 160"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                id="routeBase"
                d="M40 110 C 200 20, 330 150, 600 80 S 980 20, 1160 100"
                fill="none"
                stroke="rgba(18,62,49,.18)"
                strokeWidth="2"
                strokeDasharray="6 10"
              />
              <path
                id="routePath"
                d="M40 110 C 200 20, 330 150, 600 80 S 980 20, 1160 100"
                fill="none"
                stroke="#123e31"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="40" cy="110" r="9" fill="#f2a33a" />
              <circle cx="600" cy="80" r="9" fill="#f2a33a" />
              <circle cx="1160" cy="100" r="9" fill="#e0457b" />
              <g id="routeRider">
                <circle r="16" fill="#e0457b" />
                <circle r="6" fill="#f7efe0" />
              </g>
            </svg>
            <div className="route__stops">
              <article className="stop" data-reveal="0">
                <div
                  className="stop__img"
                  data-cursor="View"
                  onClick={() => openQuickView('walnut')}
                >
                  <img
                    src="https://storage.googleapis.com/spoonup-508319-product-images/products/catalog-prod-9.jpg"
                    alt="Kashmiri walnuts"
                  />
                  <span className="stop__n">1</span>
                </div>
                <h3>Picked in the orchard</h3>
                <p>Walnut kernels, rich in omega-3, brought directly from the farms of Kashmir.</p>
                <div className="price-row">
                  <b>
                    ₹480 <small className="mono">/100 g</small>
                  </b>
                  <button
                    className="add"
                    type="button"
                    onClick={(e) => addToCart('walnut', e.currentTarget)}
                  >
                    + Add
                  </button>
                </div>
              </article>

              <article className="stop" data-reveal=".12">
                <div
                  className="stop__img"
                  data-cursor="View"
                  onClick={() => openQuickView('blackberry')}
                >
                  <img
                    src="https://storage.googleapis.com/spoonup-508319-product-images/products/catalog-prod-10.jpg"
                    alt="Kashmiri blackberries"
                  />
                  <span className="stop__n">2</span>
                </div>
                <h3>Sun-dried, by hand</h3>
                <p>
                  Handpicked Kashmiri blackberries, dried in the sun and packed with natural
                  antioxidants.
                </p>
                <div className="price-row">
                  <b>
                    ₹1400 <small className="mono">/kg</small>
                  </b>
                  <button
                    className="add"
                    type="button"
                    onClick={(e) => addToCart('blackberry', e.currentTarget)}
                  >
                    + Add
                  </button>
                </div>
              </article>

              <article className="stop" data-reveal=".24">
                <div
                  className="stop__img"
                  data-cursor="View"
                  onClick={() => openQuickView('almond')}
                >
                  <img
                    src="https://storage.googleapis.com/spoonup-508319-product-images/products/catalog-prod-7.jpg"
                    alt="Kashmiri almonds"
                  />
                  <span className="stop__n">3</span>
                </div>
                <h3>Into your kitchen</h3>
                <p>Badam giri: premium Kashmiri almonds, full of natural oils and sweetness.</p>
                <div className="price-row">
                  <b>
                    ₹480 <small className="mono">/100 g</small>
                  </b>
                  <button
                    className="add"
                    type="button"
                    onClick={(e) => addToCart('almond', e.currentTarget)}
                  >
                    + Add
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STAMPS ============ */}
      <section className="stamps">
        <div className="wrap">
          <div className="stamps__head">
            <h2 className="display" data-split>
              Four promises.
            </h2>
            <p data-reveal>Stamped on everything we make. Hover (or tap) a card to read the fine print.</p>
          </div>
          <div className="stamps__grid" id="stamps">
            {STAMPS.map(({ title, ring, bg, fg, glyph, back }, i) => (
              <div
                key={i}
                className="stamp"
                tabIndex="0"
                onClick={(e) => e.currentTarget.classList.toggle('is-flipped')}
              >
                <div className="stamp__inner">
                  <div
                    className="stamp__face stamp__front"
                    style={{ '--c': bg, '--fg': fg }}
                  >
                    <span className="n">0{i + 1} / 04</span>
                    <div className="stamp__seal">
                      <svg viewBox="0 0 200 200">
                        <defs>
                          <path
                            id={`sp${i}`}
                            d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0"
                          />
                        </defs>
                        <text
                          fontFamily="DM Mono"
                          fontSize="15.5"
                          letterSpacing="3.2"
                          fill={fg}
                        >
                          <textPath href={`#sp${i}`}>{ring}</textPath>
                        </text>
                      </svg>
                      <svg className="glyph" viewBox="0 0 200 200">
                        <circle
                          cx="100"
                          cy="100"
                          r="54"
                          fill="none"
                          stroke={fg}
                          strokeWidth="1.5"
                          strokeDasharray="3 5"
                        />
                        <text
                          x="100"
                          y="100"
                          dy=".35em"
                          textAnchor="middle"
                          fontFamily="Shrikhand"
                          fontSize="62"
                          fill={fg}
                        >
                          {glyph}
                        </text>
                      </svg>
                    </div>
                    <h3>{title}</h3>
                  </div>
                  <div className="stamp__face stamp__back">
                    <span className="mono">the fine print</span>
                    <div>
                      <h3>{title.toLowerCase()}</h3>
                      <p>{back}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CHALKBOARD ============ */}
      <section className="board-sec">
        <div className="wrap">
          <div className="board" id="board">
            <div>
              <h2>
                Take a spoon,
                <br />
                <u>guilt free.</u>
              </h2>
              <p>Pickup from the Main Shop counter, or have it delivered. Everything below is ready today.</p>
              <Link className="btn" to="/shop" data-magnet>
                Order from the counter <span className="btn__icon">{ARROW_ICON}</span>
              </Link>
            </div>
            <ul className="board__list" id="boardList">
              {readyNowProducts.map((p) => (
                <li key={p.id}>
                  <span>{p.name.replace(/ \(.+\)/, '')}</span>
                  <span className="dots"></span>
                  <b>{formatRupee(p.price)}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
