import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { SPOONUP } from '../data/data';
import gsap from 'gsap';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Initialize mode
  const [mode, setModeState] = useState(() => {
    try {
      const saved = localStorage.getItem('su-mode');
      return saved ? JSON.parse(saved) : 'pickup';
    } catch {
      return 'pickup';
    }
  });

  // Initialize cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('su-cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastState, setToastState] = useState({ message: '', visible: false });
  const toastTimeoutRef = useRef(null);
  const cartBtnRef = useRef(null);

  // Sync mode to localStorage
  const setMode = useCallback((newMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem('su-mode', JSON.stringify(newMode));
    } catch {}
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('su-cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Toast helper
  const showToast = useCallback((msg) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastState({ message: msg, visible: true });
    toastTimeoutRef.current = setTimeout(() => {
      setToastState({ message: '', visible: false });
    }, 2600);
  }, []);

  // Product lookup helper
  const getProduct = useCallback((id) => {
    return SPOONUP.products.find((p) => p.id === id);
  }, []);

  // Calculations
  const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = getProduct(id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const gst = subtotal * SPOONUP.gst;
  const total = subtotal + gst;
  const freeDeliveryRemaining = Math.max(0, SPOONUP.freeDeliveryAt - subtotal);
  const freeDeliveryPercent = Math.min(100, (subtotal / SPOONUP.freeDeliveryAt) * 100);

  // Fly to cart animation
  const animateFlyer = useCallback((product, fromEl) => {
    const btn = document.getElementById('cartBtn') || cartBtnRef.current;
    const land = () => {
      if (btn) {
        btn.classList.remove('bump');
        void btn.offsetWidth;
        btn.classList.add('bump');
      }
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (fromEl && !reduceMotion && btn) {
      const src = fromEl.closest('.dish, .qv__card, .polaroid, .stop')?.querySelector('img') || fromEl;
      const a = src.getBoundingClientRect();
      const b = btn.getBoundingClientRect();

      const flyer = document.createElement('div');
      flyer.className = 'flyer';
      flyer.innerHTML = `<img src="${product.img}" alt="${product.name}">`;
      document.body.appendChild(flyer);

      const sx = a.left + a.width / 2 - 35;
      const sy = a.top + a.height / 2 - 35;
      const ex = b.left + b.width / 2 - 35;
      const ey = b.top + b.height / 2 - 35;

      gsap.set(flyer, { x: sx, y: sy, scale: 1.4 });
      gsap
        .timeline({
          onComplete: () => {
            flyer.remove();
            land();
          }
        })
        .to(flyer, { x: ex, duration: 0.9, ease: 'power2.inOut' }, 0)
        .to(flyer, { y: Math.min(sy, ey) - 140, duration: 0.4, ease: 'power2.out' }, 0)
        .to(flyer, { y: ey, duration: 0.5, ease: 'power2.in' }, 0.4)
        .to(flyer, { scale: 0.25, rotate: 360, duration: 0.9, ease: 'power1.in' }, 0);
    } else {
      land();
    }
  }, []);

  // Cart operations
  const addToCart = useCallback(
    (id, fromEl) => {
      const product = getProduct(id);
      if (!product) return;

      setCart((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1
      }));

      animateFlyer(product, fromEl);
      showToast(`${product.name} → cart`);
    },
    [getProduct, animateFlyer, showToast]
  );

  const increment = useCallback((id) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  }, []);

  const decrement = useCallback((id) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return {
        ...prev,
        [id]: current - 1
      };
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({});
  }, []);

  // Update body class on isCartOpen
  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('cart-open');
    } else {
      document.body.classList.remove('cart-open');
    }
  }, [isCartOpen]);

  return (
    <CartContext.Provider
      value={{
        cart,
        mode,
        setMode,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        increment,
        decrement,
        removeFromCart,
        clearCart,
        count,
        subtotal,
        gst,
        total,
        freeDeliveryRemaining,
        freeDeliveryPercent,
        showToast,
        toastState,
        getProduct,
        cartBtnRef
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
