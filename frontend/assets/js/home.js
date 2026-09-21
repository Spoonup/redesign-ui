/* ==========================================================
   SpoonUp — homepage choreography
   ========================================================== */
(() => {
  const D = window.SPOONUP;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const P = id => D.products.find(p => p.id === id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = !!window.gsap;
  if (G) gsap.registerPlugin(...[window.ScrollTrigger, window.Draggable, window.InertiaPlugin, window.MotionPathPlugin].filter(Boolean));

  /* ---------------- static content (works without GSAP) ---------------- */
  // polaroids on the table: [id, left%, top%, rotation]
  const table = $('#table');
  const spots = [['chia', 6, 4, -9], ['dragon', 54, 0, 7], ['modak', 60, 50, -5], ['tikki', 2, 52, 6], ['walnut', 30, 27, -2]];
  spots.forEach(([id, l, t, r]) => {
    const p = P(id);
    const f = document.createElement('figure');
    f.className = 'polaroid'; f.dataset.cursor = 'Drag'; f.dataset.r = r;
    f.style.left = l + '%'; f.style.top = t + '%'; f.style.transform = `rotate(${r}deg)`; f.style.margin = 0;
    f.innerHTML = `<span class="tape"></span><img src="${p.img}" alt="${p.name}" draggable="false"><figcaption>${p.name.split(' ').slice(0, 3).join(' ')}<b>${SU_rupee(p.price)}</b></figcaption>`;
    table.insertBefore(f, $('.table__hint'));
  });

  // ribbons
  const a = ['Chia pudding', 'Paan modak', 'Sabudana tikki', 'Dragon fruit', 'Kashmiri walnuts', 'Peri peri fries', 'Muesli'];
  const b = ['No refined sugar', 'High protein', 'Real ingredients', 'Made with love', 'Made fresh'];
  $$('.ribbon--a .ribbon__track').forEach(t => t.innerHTML = a.map(x => `<span>${x}</span>`).join(''));
  $$('.ribbon--b .ribbon__track').forEach(t => t.innerHTML = b.map(x => `<span>${x}</span>`).join(''));

  // counter cards
  $('#counterTrack').innerHTML = D.products.map((p, i) => SU_dish(p, i)).join('') +
    `<div class="dish dish--end"><div class="display">That's the lot.</div><p class="hand" style="font-size:20px;margin:0">for now, anyway</p>
     <a class="btn btn--sun" href="shop.html">Open the full pantry <span class="btn__icon">${SU_icon.arrow}</span></a></div>`;

  // anatomy chips
  const ing = [
    ['C', 'Chia seeds', 'the base', '#f2a33a'], ['S', 'Skyr', 'thick & protein-rich', '#efe3cc'],
    ['C', 'Cocoa', 'the chocolate bit', '#8a5a3c'], ['A', 'Almonds', 'crunch', '#e8c89a'],
    ['C', 'Cashew', 'creaminess', '#f3dcb5'], ['W', 'Whey protein', 'extra protein', '#e0457b'],
    ['D', 'Dates', 'the only sweetener', '#6b3f2a'], ['V', 'Vanilla', 'the warm note', '#f7d77a']
  ];
  $('#ingChips').innerHTML = ing.map(([l, n, s, c]) =>
    `<div class="chip" style="--c:${c}"><i style="font-family:var(--f-display);color:${['#8a5a3c', '#6b3f2a', '#e0457b'].includes(c) ? '#fff' : 'var(--forest)'}">${l}</i>${n} <small>${s}</small></div>`).join('');

  // stamps
  const stamps = [
    ['High Protein', 'HIGH PROTEIN • HIGH PROTEIN • ', '#123e31', '#f7efe0', 'P', 'Built around nuts, seeds, dry fruits and whole grains, so a small serving carries real nutritional value.'],
    ['Real Ingredients', 'REAL FOOD • REAL FOOD • REAL FOOD • ', '#f2a33a', '#0b2a21', 'R', 'Nothing you wouldn\'t find in a home kitchen. We avoid unnecessary additives.'],
    ['No Refined Sugar', 'ZERO REFINED SUGAR • ZERO • ', '#e0457b', '#fff', '0', 'Our sweet things are sweetened with natural alternatives like dates, never refined white sugar.'],
    ['Made With Love', 'MADE WITH LOVE • WITH CARE • ', '#8a6d3b', '#fff', '♡', 'From picking ingredients to preparing and packing, we care about quality, freshness and honest food.']
  ];
  $('#stamps').innerHTML = stamps.map(([t, ring, c, fg, g, back], i) => `
    <div class="stamp" tabindex="0">
      <div class="stamp__inner">
        <div class="stamp__face stamp__front" style="--c:${c};--fg:${fg}">
          <span class="n">0${i + 1} / 04</span>
          <div class="stamp__seal"><svg viewBox="0 0 200 200">
            <defs><path id="sp${i}" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0"/></defs>
            <text font-family="DM Mono" font-size="15.5" letter-spacing="3.2" fill="${fg}"><textPath href="#sp${i}">${ring}</textPath></text>
          </svg><svg class="glyph" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="54" fill="none" stroke="${fg}" stroke-width="1.5" stroke-dasharray="3 5"/>
            <text x="100" y="100" dy=".35em" text-anchor="middle" font-family="Shrikhand" font-size="62" fill="${fg}">${g}</text>
          </svg></div>
          <h3>${t}</h3>
        </div>
        <div class="stamp__face stamp__back"><span class="mono">the fine print</span><div><h3>${t.toLowerCase()}</h3><p>${back}</p></div></div>
      </div>
    </div>`).join('');
  $$('.stamp').forEach(s => s.addEventListener('click', () => s.classList.toggle('is-flipped')));

  // chalkboard
  $('#boardList').innerHTML = D.products.filter(p => p.mode === 'now').map(p =>
    `<li><span>${p.name.replace(/ \(.+\)/, '')}</span><span class="dots"></span><b>${SU_rupee(p.price)}</b></li>`).join('');

  /* ---------------- loader ---------------- */
  window.SU_loader = done => {
    const L = $('#loader'), num = $('#ldNum');
    const imgs = $$('img').filter(i => !i.complete && i.loading !== 'lazy');
    let loaded = 0; const total = Math.max(imgs.length, 1);
    const target = { v: 0 }, shown = { v: 0 };
    imgs.forEach(i => { const f = () => { loaded++; target.v = loaded / total * 100; }; i.addEventListener('load', f, { once: true }); i.addEventListener('error', f, { once: true }); });
    if (!imgs.length) target.v = 100;
    setTimeout(() => { target.v = 100; shown.v = 100; }, 4000); // never hold people hostage

    const loops = [
      gsap.to('#ldWave', { x: 100, duration: 1.4, ease: 'none', repeat: -1 }),
      gsap.fromTo('#ldSpoon', { rotate: -12 }, { rotate: 14, duration: .5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    ];
    const setWave = gsap.quickSetter('#ldWave', 'y', 'px');
    const minTime = 1.6, t0 = performance.now();
    const tick = () => {
      shown.v += (target.v - shown.v) * .08;
      const elapsed = (performance.now() - t0) / 1000;
      const v = Math.min(shown.v, elapsed / minTime * 100);
      num.textContent = Math.round(v);
      setWave(-v * .82);
      if (v >= 99.5) finish();
    };
    let finished = false;
    const finish = () => { if (finished) return; finished = true; gsap.ticker.remove(tick); num.textContent = 100; outro(); };
    gsap.ticker.add(tick);
    setTimeout(finish, 5500);
    const outro = () => {
      gsap.timeline({ onComplete: () => { loops.forEach(t => t.kill()); L.remove(); } })
        .to('.loader__bowl', { scale: .6, rotate: -20, opacity: 0, duration: .6, ease: 'back.in(1.7)' })
        .to('.loader__note', { opacity: 0, y: 20, duration: .3 }, 0)
        .to(L, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, .35)
        .add(() => done(), .7);
    };
  };

  if (!G || reduce) return;

  /* ---------------- after boot ---------------- */
  document.addEventListener('su:ready', () => {
    const mm = gsap.matchMedia();

    /* HERO ---------------------------------------------------- */
    const { chars } = SU_split($('#heroTitle'));
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from(chars, { yPercent: 120, rotate: 12, duration: 1.3, stagger: .028 })
      .from('.hero__kicker', { y: 20, opacity: 0, duration: .8 }, 0)
      .from('[data-hero-fade]', { y: 30, opacity: 0, duration: 1, stagger: .1 }, .5)
      .from('.table__plate', { scale: .4, opacity: 0, rotate: -90, duration: 1.4 }, .2)
      .from('.polaroid', { y: () => -innerHeight, rotate: () => gsap.utils.random(-50, 50), duration: 1.3, ease: 'bounce.out', stagger: .12 }, .4)
      .from('.table__hint', { opacity: 0, duration: .6 }, 1.6)
      .fromTo('#hintPath', { strokeDasharray: 120, strokeDashoffset: 120 }, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 1.7)
      .from('.hero__proof div', { y: 24, opacity: 0, duration: .9, stagger: .1 }, .9);

    // draggable polaroids with throw + tilt on drop
    let z = 10;
    if (window.Draggable) {
      Draggable.create('.polaroid', {
        bounds: '.hero', inertia: !!window.InertiaPlugin, zIndexBoost: false,
        onPress() { this.target.style.zIndex = ++z; gsap.to(this.target, { scale: 1.08, rotate: 0, boxShadow: '0 40px 60px -20px rgba(16,35,28,.55)', duration: .3 }); },
        onRelease() { gsap.to(this.target, { scale: 1, rotate: gsap.utils.random(-10, 10), boxShadow: '0 18px 40px -18px rgba(16,35,28,.5)', duration: .6, ease: 'back.out(2)' }); },
        onDrag() { gsap.to(this.target, { rotate: gsap.utils.clamp(-20, 20, this.deltaX * 1.2), duration: .3 }); }
      });
    }
    // gentle parallax of the whole table on mouse
    mm.add('(pointer: fine)', () => {
      const plate = $('.table__plate');
      const px = gsap.quickTo(plate, 'x', { duration: 1.2, ease: 'power3' }), py = gsap.quickTo(plate, 'y', { duration: 1.2, ease: 'power3' });
      let heroOn = true;
      ScrollTrigger.create({ trigger: '.hero', start: 'top bottom', end: 'bottom top', onToggle: s => heroOn = s.isActive });
      const move = e => { if (!heroOn) return; px((e.clientX / innerWidth - .5) * 30); py((e.clientY / innerHeight - .5) * 30); };
      addEventListener('pointermove', move);
      return () => removeEventListener('pointermove', move);
    });
    // hero parallax out
    gsap.to('.hero__grid > div:first-child', { yPercent: -18, opacity: .3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    /* RIBBONS: velocity-reactive marquee ------------------------ */
    $$('.ribbon').forEach((r, idx) => {
      const tracks = $$('.ribbon__track', r);
      const dir = idx === 0 ? 1 : -1;
      const setX = tracks.map(t => gsap.quickSetter(t, 'x', 'px')), setSkew = gsap.quickSetter(r, 'skewX', 'deg');
      let x = 0, vel = 0, width = tracks[0].offsetWidth;
      addEventListener('resize', () => { width = tracks[0].offsetWidth; });
      document.fonts?.ready.then(() => { width = tracks[0].offsetWidth; });
      const step = () => {
        if (!width) return;
        x -= (1.1 + Math.abs(vel)) * dir * (vel < 0 ? -1 : 1);
        vel *= .92;
        x = ((x % width) - width) % width;
        setX.forEach(f => f(x));
        setSkew(gsap.utils.clamp(-8, 8, vel * 1.5));
      };
      ScrollTrigger.create({ trigger: '.ribbons', start: 'top bottom', end: 'bottom top',
        onUpdate: s => { vel = s.getVelocity() / 300; },
        onToggle: s => s.isActive ? gsap.ticker.add(step) : gsap.ticker.remove(step) });
    });

    /* MANIFESTO: words light up with scroll -------------------- */
    const man = $('#manifesto');
    const walkWords = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(w => {
          if (!w) return;
          if (/^\s+$/.test(w)) return frag.appendChild(document.createTextNode(' '));
          const s = document.createElement('span'); s.className = 'w'; s.textContent = w; frag.appendChild(s);
        });
        n.replaceWith(frag);
      } else if (n.classList.contains('pic')) n.classList.add('w');
      else walkWords(n);
    });
    walkWords(man);
    gsap.to($$('.w', man), { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: man, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    $$('.pic', man).forEach(p => gsap.from(p, { scale: 0, rotate: -30, ease: 'back.out(2)', scrollTrigger: { trigger: p, start: 'top 75%', end: 'top 55%', scrub: 1 } }));

    /* COUNTER: pinned horizontal track ------------------------ */
    mm.add('(min-width: 901px)', () => {
      const track = $('#counterTrack');
      const dist = () => track.scrollWidth - innerWidth;
      const tilt = gsap.quickTo(track, 'skewX', { duration: .5, ease: 'power3' });
      const setBar = gsap.quickSetter('#counterBar', 'scaleX');
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: '#counter', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: s => {
            setBar(s.progress);
            tilt(gsap.utils.clamp(-5, 5, s.getVelocity() / -300));
          }
        }
      });
      // cards pop in as they cross the viewport
      $$('.counter .dish').forEach(d => gsap.from($('img', d) || d, { scale: 1.5, ease: 'none',
        scrollTrigger: { trigger: d, containerAnimation: tween, start: 'left right', end: 'center center', scrub: true } }));
    });

    /* ANATOMY: jar explodes into ingredients ------------------ */
    const chipsEl = $$('.chip');
    const layout = () => {
      const small = innerWidth < 800;
      const rx = small ? innerWidth * .3 : Math.min(innerWidth * .36, 600), ry = small ? innerHeight * .27 : Math.min(innerHeight * .27, 250);
      return chipsEl.map((c, i) => {
        const a = (i / chipsEl.length) * Math.PI * 2 - Math.PI / 2 + .2;
        return { x: Math.cos(a) * rx - c.offsetWidth / 2, y: Math.sin(a) * ry - c.offsetHeight / 2 + (small ? 50 : 0) };
      });
    };
    gsap.set(chipsEl, { xPercent: 0, x: c => -chipsEl[c].offsetWidth / 2, y: c => -chipsEl[c].offsetHeight / 2, scale: 0, opacity: 0 });
    const atl = gsap.timeline({ scrollTrigger: { trigger: '#anatomy', start: 'top top', end: '+=180%', pin: '.anatomy__pin', scrub: 1, invalidateOnRefresh: true } });
    atl.from('.anatomy__title', { y: -40, opacity: 0, duration: .3 })
      .from('#jar', { scale: .3, rotate: -120, duration: 1, ease: 'power2.out' }, 0)
      .from('.anatomy__ring', { scale: 0, opacity: 0, stagger: .15, duration: .8 }, .1)
      .to(chipsEl, { x: i => layout()[i].x, y: i => layout()[i].y, scale: 1, opacity: 1, rotate: () => gsap.utils.random(-8, 8), stagger: .08, duration: 1, ease: 'back.out(1.4)' }, .5)
      .to('#jar', { rotate: 25, duration: 1.6 }, .5)
      .from('#label', { y: 60, opacity: 0, duration: .6 }, 1.2)
      .from('#label .row', { opacity: 0, y: 14, stagger: .08, duration: .3 }, 1.35)
      .from('.anatomy__cta', { y: 40, opacity: 0, duration: .5 }, 1.5)
      .to({}, { duration: .4 });
    // chips gently float while visible
    const floats = chipsEl.map((c, i) => gsap.to(c, { yPercent: '+=12', duration: 1.6 + i * .12, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true }));
    ScrollTrigger.create({ trigger: '#anatomy', start: 'top bottom', end: 'bottom top', onToggle: s => floats.forEach(t => s.isActive ? t.play() : t.pause()) });

    /* ROUTE: path draws, rider travels ------------------------ */
    mm.add('(min-width: 861px)', () => {
      const path = $('#routePath'), len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      const rt = gsap.timeline({ scrollTrigger: { trigger: '.route__map', start: 'top 80%', end: 'bottom 60%', scrub: 1 } });
      rt.to(path, { strokeDashoffset: 0, ease: 'none' }, 0);
      if (window.MotionPathPlugin) rt.to('#routeRider', { motionPath: { path: '#routePath', align: '#routePath', alignOrigin: [.5, .5] }, ease: 'none' }, 0);
    });
    $$('.stop__img img').forEach(img => gsap.fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } }));

    /* STAMPS: drop like rubber stamps ------------------------- */
    gsap.from('.stamp', { scale: 1.6, rotate: () => gsap.utils.random(-14, 14), opacity: 0, duration: .5, ease: 'power4.in', stagger: .12,
      scrollTrigger: { trigger: '#stamps', start: 'top 80%' },
      onComplete: () => gsap.fromTo('#stamps', { x: -3 }, { x: 0, duration: .3, ease: 'elastic.out(1,.2)' }) });

    /* CHALKBOARD: written in chalk ---------------------------- */
    const bt = gsap.timeline({ scrollTrigger: { trigger: '#board', start: 'top 70%' } });
    bt.from('#board', { rotate: -2, y: 60, duration: 1, ease: 'expo.out' })
      .from('.board h2', { clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'power2.inOut' }, .2)
      .from('.board__list li', { clipPath: 'inset(0 100% 0 0)', duration: .7, ease: 'power1.inOut', stagger: .18 }, .5);

    SU_magnet();
    ScrollTrigger.refresh();
  });
})();
