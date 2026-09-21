/* ==========================================================
   SpoonUp — shared engine
   chrome · smooth scroll · cursor · cart · transitions · reveals
   ========================================================== */
(() => {
  const D = window.SPOONUP;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const page = document.body.dataset.page;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const hasGsap = !!window.gsap;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch {} }
  };
  document.documentElement.classList.add('js');
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const icon = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
  };
  const rupee = n => '₹' + Math.round(n).toLocaleString('en-IN');

  /* ---------- chrome ---------- */
  const links = [
    ['index.html', 'Home', 'home'], ['shop.html', 'Shop', 'shop'], ['story.html', 'Our Story', 'story'],
    ['ingredients.html', 'Ingredients', 'ingredients'], ['contact.html', 'Contact', 'contact']
  ];
  const nav = links.map(([h, t, k]) => `<a href="${h}" ${k === page ? 'aria-current="page"' : ''}><span data-t="${t}">${t}</span></a>`).join('');
  const tick = ['Free delivery above <i>₹499</i>', 'No refined sugar. Ever.', 'Kashmir ke dry fruits, <i>100% pure</i>', 'Pickup from Main Shop', 'Small indulgences, big impact', 'Made fresh, with care'];
  const tickHTML = [...tick, ...tick].map(t => `<span>${t}</span><span><i>✦</i></span>`).join('');

  $('#chrome-top').outerHTML = `
    <div class="ticker" aria-hidden="true"><div class="ticker__track">${tickHTML}</div></div>
    <header class="header" id="header">
      <div class="wrap header__bar">
        <a class="logo" href="index.html" aria-label="SpoonUp home"><img src="${D.logo}" alt="SpoonUp"></a>
        <nav class="nav" aria-label="Main">${nav}</nav>
        <div class="header__actions">
          <div class="mode-toggle" role="group" aria-label="Order type">
            <span class="pill"></span>
            <button type="button" data-mode="pickup">Pickup</button>
            <button type="button" data-mode="delivery">Delivery</button>
          </div>
          <button class="cart-btn" id="cartBtn" aria-label="Open cart" data-cursor="Cart">${icon.bag}<span class="cart-btn__count" id="cartCount"></span></button>
          <button class="burger" id="burger" aria-label="Menu"><span></span><span></span></button>
        </div>
      </div>
    </header>
    <div class="mobile-menu" id="mobileMenu">
      ${links.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}
      <a href="policies.html" style="font-size:28px;margin-top:10px">Policies</a>
      <p class="hand">take a spoon, guilt free ♡</p>
    </div>`;

  const word = 'SpoonUp'.split('').map(c => `<span>${c}</span>`).join('');
  $('#chrome-bottom').outerHTML = `
    <footer class="footer">
      <div class="wrap">
        <div class="footer__cta">
          <h2 class="display" data-split>Hungry now? <em>Take a spoon.</em></h2>
          <a class="btn btn--sun" href="shop.html" data-magnet>Open the pantry <span class="btn__icon">${icon.arrow}</span></a>
        </div>
        <div class="footer__cols">
          <div>
            <h4>SpoonUp Foods</h4>
            <p>Small indulgences, big impact. Real food made with care for happier, healthier days.</p>
            <p class="mono" style="opacity:.5">GSTIN 29AJYPK3031G1ZX</p>
          </div>
          <div><h4>Explore</h4><ul>
            <li><a class="link-u" href="shop.html">Shop all</a></li>
            <li><a class="link-u" href="story.html">Our Story</a></li>
            <li><a class="link-u" href="ingredients.html">Our Ingredients</a></li>
            <li><a class="link-u" href="contact.html">Contact Us</a></li></ul></div>
          <div><h4>Help</h4><ul>
            <li><a class="link-u" href="policies.html#shipping">Shipping &amp; Delivery</a></li>
            <li><a class="link-u" href="policies.html#refunds">Cancellation &amp; Refunds</a></li>
            <li><a class="link-u" href="policies.html#privacy">Privacy Policy</a></li>
            <li><a class="link-u" href="policies.html#terms">Terms &amp; Conditions</a></li></ul></div>
          <div><h4>Say hi</h4><ul>
            <li><a class="link-u" href="mailto:info@spoonupfoods.com">info@spoonupfoods.com</a></li>
            <li><a class="link-u" href="https://www.instagram.com/spoonupfoods/" target="_blank" rel="noopener">Instagram ↗</a></li></ul></div>
        </div>
      </div>
      <div class="wrap footer__bottom">
        <span>© ${new Date().getFullYear()} SpoonUp Foods. All rights reserved.</span>
        <span>Good food, higher days.</span>
      </div>
      <div class="footer__word" aria-hidden="true">${word}</div>
    </footer>
    <div class="drawer-scrim" id="scrim"></div>
    <aside class="drawer" id="drawer" aria-label="Your cart" aria-hidden="true">
      <div class="drawer__head"><h3>Your spoonful</h3><button class="drawer__close" id="drawerClose" aria-label="Close cart">✕</button></div>
      <div class="drawer__free" id="freeBar"></div>
      <div class="drawer__items" id="cartItems"></div>
      <div class="drawer__foot" id="cartFoot"></div>
    </aside>
    <div class="qv" id="qv" aria-hidden="true"><div class="qv__scrim"></div><div class="qv__card" role="dialog" aria-modal="true"></div></div>
    <div class="toast" id="toast" role="status"></div>
    <div class="cursor is-hidden" id="cursor"><span class="cursor__label"></span></div><div class="cursor-dot" id="cursorDot"></div>
    <div class="loader__panels" id="panels" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>`;

  /* ---------- toast ---------- */
  let toastT;
  const toast = msg => {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600);
  };
  window.SU_toast = toast;

  /* ---------- order mode toggle ---------- */
  let mode = store.get('su-mode', 'pickup');
  const setMode = m => {
    mode = m; store.set('su-mode', m);
    $$('.mode-toggle button').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === m));
    const on = $(`.mode-toggle button[data-mode="${m}"]`), pill = $('.mode-toggle .pill');
    if (on && pill) { pill.style.width = on.offsetWidth + 'px'; pill.style.transform = `translateX(${on.offsetLeft - 4}px)`; }
    renderCart();
  };
  $$('.mode-toggle button').forEach(b => b.addEventListener('click', () => { setMode(b.dataset.mode); toast(b.dataset.mode === 'pickup' ? 'Pickup from Main Shop selected' : 'Delivery selected: free above ₹499'); }));

  /* ---------- cart ---------- */
  let cart = store.get('su-cart', {});
  const byId = id => D.products.find(p => p.id === id);
  const count = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = () => Object.entries(cart).reduce((s, [id, q]) => s + (byId(id)?.price || 0) * q, 0);

  function renderCart() {
    const n = count();
    $('#cartCount').textContent = n || '';
    const sub = subtotal(), gst = sub * D.gst;
    const left = Math.max(0, D.freeDeliveryAt - sub);
    const pct = Math.min(100, sub / D.freeDeliveryAt * 100);
    $('#freeBar').innerHTML = mode === 'pickup'
      ? `<b>Pickup from Main Shop.</b> No delivery fee, just come say hi.<div class="bar"><i style="width:100%"></i></div>`
      : (left > 0 ? `Add <b>${rupee(left)}</b> more for <b>free delivery</b>` : `<b>Free delivery unlocked.</b> Nice.`) + `<div class="bar"><i style="width:${pct}%"></i></div>`;
    const items = Object.entries(cart).filter(([id]) => byId(id));
    $('#cartItems').innerHTML = items.length ? items.map(([id, q]) => {
      const p = byId(id);
      return `<div class="line"><img src="${p.img}" alt=""><div><h5>${p.name}</h5><small>${rupee(p.price)} ${p.unit}${p.mode === 'later' ? ' · deliver later' : ''}</small><br>
        <div class="qty"><button data-dec="${id}" aria-label="Decrease">−</button><span>${q}</span><button data-inc="${id}" aria-label="Increase">+</button></div></div>
        <div class="line__price">${rupee(p.price * q)}</div></div>`;
    }).join('') : `<div class="drawer__empty"><div class="display">Empty spoon.</div><p>Nothing in here yet. The chia pudding is a good place to start.</p><a class="btn btn--sm" href="shop.html">Browse the pantry <span class="btn__icon">${icon.arrow}</span></a></div>`;
    $('#cartFoot').innerHTML = items.length ? `
      <div class="row"><span>Subtotal</span><span>${rupee(sub)}</span></div>
      <div class="row"><span>GST (5%)</span><span>${rupee(gst)}</span></div>
      <div class="row"><span>${mode === 'pickup' ? 'Pickup' : 'Delivery'}</span><span>${mode === 'pickup' || left === 0 ? 'Free' : 'At checkout'}</span></div>
      <div class="row total"><span>Total</span><span>${rupee(sub + gst)}</span></div>
      <button class="btn" id="checkout">Checkout · ${rupee(sub + gst)} <span class="btn__icon">${icon.arrow}</span></button>` : '';
    const co = $('#checkout'); if (co) co.onclick = () => toast('Checkout would hand off to the payment provider here.');
  }
  $('#cartItems').addEventListener('click', e => {
    const inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]');
    if (inc) cart[inc.dataset.inc]++;
    if (dec) { const id = dec.dataset.dec; if (--cart[id] <= 0) delete cart[id]; }
    if (inc || dec) { store.set('su-cart', cart); renderCart(); }
  });

  const openCart = () => { document.body.classList.add('cart-open'); $('#drawer').setAttribute('aria-hidden', 'false'); lenis?.stop(); };
  const closeCart = () => { document.body.classList.remove('cart-open'); $('#drawer').setAttribute('aria-hidden', 'true'); lenis?.start(); };
  $('#cartBtn').onclick = openCart; $('#drawerClose').onclick = closeCart; $('#scrim').onclick = closeCart;
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); closeQV(); document.body.classList.remove('menu-open'); } });

  function addToCart(id, fromEl) {
    cart[id] = (cart[id] || 0) + 1; store.set('su-cart', cart);
    const p = byId(id), btn = $('#cartBtn');
    renderCart();
    const land = () => { btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump'); };
    if (fromEl && hasGsap && !reduce) {
      const src = fromEl.closest('.dish, .qv__card, .polaroid, .stop')?.querySelector('img') || fromEl;
      const a = src.getBoundingClientRect(), b = btn.getBoundingClientRect();
      const f = document.createElement('div'); f.className = 'flyer'; f.innerHTML = `<img src="${p.img}" alt="">`;
      document.body.appendChild(f);
      setTimeout(() => f.remove(), 2000);
      const sx = a.left + a.width / 2 - 35, sy = a.top + a.height / 2 - 35, ex = b.left + b.width / 2 - 35, ey = b.top + b.height / 2 - 35;
      gsap.set(f, { x: sx, y: sy, scale: 1.4 });
      gsap.timeline({ onComplete: () => { f.remove(); land(); } })
        .to(f, { x: ex, duration: .9, ease: 'power2.inOut' }, 0)
        .to(f, { y: Math.min(sy, ey) - 140, duration: .4, ease: 'power2.out' }, 0)
        .to(f, { y: ey, duration: .5, ease: 'power2.in' }, .4)
        .to(f, { scale: .25, rotate: 360, duration: .9, ease: 'power1.in' }, 0);
    } else land();
    if (fromEl) {
      const b = fromEl.closest('.add'); if (b) { const h = b.innerHTML; b.classList.add('is-added'); b.innerHTML = '✓ Added'; setTimeout(() => { b.classList.remove('is-added'); b.innerHTML = h; }, 1400); }
    }
    toast(`${p.name} → cart`);
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]');
    if (a) { e.preventDefault(); e.stopPropagation(); addToCart(a.dataset.add, a); return; }
    const q = e.target.closest('[data-qv]');
    if (q) { e.preventDefault(); openQV(q.dataset.qv); }
  });

  /* ---------- dish card renderer (used by home + shop) ---------- */
  window.SU_dish = (p, i) => `
    <article class="dish" style="--tint:${p.tint}" data-cat="${p.cat}" data-id="${p.id}">
      <a class="dish__media" href="#" data-qv="${p.id}" data-cursor="View" aria-label="Quick view ${p.name}">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <span class="dish__num">${String(i + 1).padStart(2, '0')}</span>
        <span class="dish__badge ${p.mode}">${p.mode === 'now' ? 'Ready today' : 'Deliver later'}</span>
      </a>
      <div class="dish__body">
        <span class="dish__cat mono">${p.cat}</span>
        <h3 class="dish__name">${p.name}</h3>
        <p class="dish__sub">${p.sub}</p>
        <div class="dish__foot">
          <div class="dish__price">${rupee(p.price)}<small>${p.unit} + 5% GST</small></div>
          <button class="add" data-add="${p.id}">${icon.plus} Add</button>
        </div>
      </div>
    </article>`;
  window.SU_icon = icon; window.SU_rupee = rupee;

  /* ---------- quick view ---------- */
  function openQV(id) {
    const p = byId(id); if (!p) return;
    const qv = $('#qv');
    $('.qv__card', qv).innerHTML = `
      <button class="drawer__close qv__close" aria-label="Close">✕</button>
      <div class="qv__media" style="--tint:${p.tint}"><img src="${p.img}" alt="${p.name}"></div>
      <div class="qv__body">
        <span class="mono" style="color:var(--walnut)">${p.cat} · ${p.mode === 'now' ? 'Ready today' : 'Deliver later'}</span>
        <h3>${p.name}</h3><p class="hand" style="font-size:20px;margin:0">${p.sub}</p>
        <p>${p.desc}</p>
        <div class="dish__price">${rupee(p.price)}<small>${p.unit} + 5% GST</small></div>
        <button class="btn" data-add="${p.id}" style="align-self:flex-start">Add to cart <span class="btn__icon">${icon.plus}</span></button>
        <p class="mono" style="font-size:11px;margin-top:auto">Contains nuts, dairy or gluten? Check with us before ordering if you have allergies.</p>
      </div>`;
    qv.classList.add('open'); qv.setAttribute('aria-hidden', 'false'); lenis?.stop();
    $('.qv__close', qv).onclick = closeQV; $('.qv__scrim', qv).onclick = closeQV;
  }
  function closeQV() { const qv = $('#qv'); if (!qv.classList.contains('open')) return; qv.classList.remove('open'); qv.setAttribute('aria-hidden', 'true'); lenis?.start(); }

  /* ---------- burger ---------- */
  $('#burger').onclick = () => document.body.classList.toggle('menu-open');

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    if (hasGsap) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(500, 33); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  window.SU_lenis = lenis;

  /* ---------- header hide/show ---------- */
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY, h = $('#header');
    h.classList.toggle('is-scrolled', y > 40);
    h.classList.toggle('is-hidden', y > lastY && y > 400 && !document.body.classList.contains('cart-open'));
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- cursor ---------- */
  if (fine && hasGsap && !reduce) {
    document.body.classList.add('has-cursor');
    const c = $('#cursor'), d = $('#cursorDot'), label = $('.cursor__label', c);
    const xc = gsap.quickTo(c, 'x', { duration: .45, ease: 'power3' }), yc = gsap.quickTo(c, 'y', { duration: .45, ease: 'power3' });
    const xd = gsap.quickTo(d, 'x', { duration: .08 }), yd = gsap.quickTo(d, 'y', { duration: .08 });
    addEventListener('pointermove', e => {
      if (c.classList.contains('is-hidden')) { gsap.set([c, d], { x: e.clientX, y: e.clientY }); c.classList.remove('is-hidden'); }
      xc(e.clientX); yc(e.clientY); xd(e.clientX); yd(e.clientY);
      const t = e.target.closest?.('[data-cursor]');
      const dark = e.target.closest?.('.counter, .footer, .board, .loader, .drawer-scrim, .mobile-menu, .stamp__back');
      c.classList.toggle('on-dark', !!dark);
      if (t) { label.textContent = t.dataset.cursor; c.classList.add('is-big'); c.classList.toggle('is-pink', t.dataset.cursor === 'Drag'); }
      else { c.classList.remove('is-big', 'is-pink'); }
      const interactive = e.target.closest?.('a, button, input, textarea, select, summary');
      c.style.opacity = interactive && !t ? .4 : 1;
    });
    document.addEventListener('mouseleave', () => c.classList.add('is-hidden'));
    document.addEventListener('mouseenter', () => c.classList.remove('is-hidden'));
  }

  /* ---------- magnetic ---------- */
  const magnet = () => {
    if (!fine || !hasGsap || reduce) return;
    $$('[data-magnet]').forEach(el => {
      if (el._mag) return; el._mag = 1;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .5, ease: 'power3' });
      });
      el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: .9, ease: 'elastic.out(1, .35)' }));
    });
  };

  /* ---------- split text ---------- */
  window.SU_split = (el) => {
    if (el._split) return el._split;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(w => {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            const ws = document.createElement('span'); ws.className = 'split-word';
            [...w].forEach(ch => { const s = document.createElement('span'); s.className = 'split-char'; s.textContent = ch; ws.appendChild(s); });
            frag.appendChild(ws);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('inline-pic') && n.tagName !== 'IMG') walk(n);
      });
    };
    walk(el);
    el._split = { chars: $$('.split-char, .inline-pic', el), words: $$('.split-word', el) };
    return el._split;
  };

  /* ---------- generic reveals ---------- */
  const reveals = () => {
    if (!hasGsap || reduce) { $$('[data-reveal],[data-clip]').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; e.style.clipPath = 'none'; }); return; }
    $$('[data-split]').forEach(el => {
      const { chars } = SU_split(el);
      gsap.from(chars, { yPercent: 110, rotate: 8, opacity: 0, duration: 1, ease: 'expo.out', stagger: .018,
        scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    $$('[data-reveal]').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', delay: +(el.dataset.reveal || 0),
      scrollTrigger: { trigger: el, start: 'top 90%' } }));
    $$('[data-clip]').forEach(el => {
      gsap.to(el, { clipPath: 'inset(0% 0 0 0 round 30px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
      const img = el.querySelector('img');
      if (img) gsap.fromTo(img, { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el, scrub: true } });
    });
    // footer letters bounce in
    gsap.from('.footer__word span', { yPercent: 100, duration: 1.2, ease: 'expo.out', stagger: .05, scrollTrigger: { trigger: '.footer__word', start: 'top 95%' } });
  };

  /* ---------- page transitions ---------- */
  const panels = $$('#panels span');
  const isInternal = a => a && a.href && a.origin === location.origin && !a.target && !a.hasAttribute('download') &&
    a.getAttribute('href') && !a.getAttribute('href').startsWith('#') && !a.href.startsWith('mailto') && a.pathname !== location.pathname;
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!isInternal(a) || e.metaKey || e.ctrlKey || e.shiftKey || !hasGsap || reduce) return;
    e.preventDefault();
    store.sset('su-wipe', '1');
    gsap.set(panels, { transformOrigin: 'bottom' });
    gsap.to(panels, { scaleY: 1, duration: .55, ease: 'power3.inOut', stagger: .06, onComplete: () => { location.href = a.href; } });
  });
  addEventListener('pageshow', e => { if (e.persisted && hasGsap) gsap.set(panels, { scaleY: 0 }); });

  /* ---------- pause looping CSS animations while off screen ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-off', !e.isIntersecting)), { rootMargin: '100px' });
    ['.ticker', '.hero', '.stamps'].forEach(s => $$(s).forEach(el => io.observe(el)));
  }
  // lazy + async decode for every image below the first screen
  $$('img').forEach(img => {
    if (img.closest('.hero, .header, .loader, .page-hero')) return;
    if (!img.hasAttribute('loading')) img.loading = 'lazy';
    img.decoding = 'async';
  });

  /* ---------- boot ---------- */
  renderCart();
  const placePill = () => setMode(mode);
  requestAnimationFrame(placePill);
  document.fonts?.ready.then(placePill);
  addEventListener('load', placePill); addEventListener('resize', placePill);

  const start = () => {
    document.body.classList.remove('is-loading');
    reveals(); magnet();
    document.dispatchEvent(new CustomEvent('su:ready'));
    if (hasGsap) ScrollTrigger.refresh();
  };
  window.SU_magnet = magnet;

  const boot = () => {
  if (hasGsap && !reduce && store.sget('su-wipe')) {
    store.sset('su-wipe', '');
    gsap.set(panels, { scaleY: 1, transformOrigin: 'top' });
    gsap.to(panels, { scaleY: 0, duration: .7, ease: 'power3.inOut', stagger: .06, delay: .1 });
    start();
  } else if (page === 'home' && typeof window.SU_loader === 'function' && !reduce && hasGsap) {
    window.SU_loader(start);
  } else {
    start();
  }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
