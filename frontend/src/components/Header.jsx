import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { SPOONUP } from '../data/data';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/story', label: 'Our Story' },
  { to: '/ingredients', label: 'Ingredients' },
  { to: '/contact', label: 'Contact' }
];

export const Header = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { mode, setMode, isCartOpen, setIsCartOpen, count, showToast, cartBtnRef } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const pillRef = useRef(null);
  const pickupBtnRef = useRef(null);
  const deliveryBtnRef = useRef(null);
  const lastYRef = useRef(0);
  const location = useLocation();

  // Position mode toggle pill
  const updatePill = useCallback(() => {
    const activeBtn = mode === 'pickup' ? pickupBtnRef.current : deliveryBtnRef.current;
    if (activeBtn && pillRef.current) {
      pillRef.current.style.width = activeBtn.offsetWidth + 'px';
      pillRef.current.style.transform = `translateX(${activeBtn.offsetLeft - 4}px)`;
    }
  }, [mode]);

  useEffect(() => {
    updatePill();
    const raf = requestAnimationFrame(updatePill);
    const timeout = setTimeout(updatePill, 100);
    window.addEventListener('resize', updatePill);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
      window.removeEventListener('resize', updatePill);
    };
  }, [updatePill]);

  // Handle scroll hiding
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 40);
      if (y > lastYRef.current && y > 400 && !isCartOpen) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastYRef.current = y;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCartOpen]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    showToast(
      newMode === 'pickup'
        ? 'Pickup from Main Shop selected'
        : 'Delivery selected: free above ₹499'
    );
  };

  return (
    <header
      className={`header ${isScrolled ? 'is-scrolled' : ''} ${isHidden ? 'is-hidden' : ''}`}
      id="header"
    >
      <div className="wrap header__bar">
        <Link className="logo" to="/" aria-label="SpoonUp home">
          <img src={SPOONUP.logo} alt="SpoonUp" />
        </Link>

        <nav className="nav" aria-label="Main">
          {NAV_LINKS.map(({ to, label }) => {
            const isExactHome = to === '/' && location.pathname === '/';
            const isOtherActive = to !== '/' && location.pathname.startsWith(to);
            const isCurrent = isExactHome || isOtherActive;

            return (
              <NavLink
                key={to}
                to={to}
                aria-current={isCurrent ? 'page' : undefined}
                className={isCurrent ? 'active' : ''}
              >
                <span data-t={label}>{label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="header__actions">
          <div className="mode-toggle" role="group" aria-label="Order type">
            <span className="pill" ref={pillRef}></span>
            <button
              ref={pickupBtnRef}
              type="button"
              data-mode="pickup"
              aria-pressed={mode === 'pickup'}
              onClick={() => handleModeChange('pickup')}
            >
              Pickup
            </button>
            <button
              ref={deliveryBtnRef}
              type="button"
              data-mode="delivery"
              aria-pressed={mode === 'delivery'}
              onClick={() => handleModeChange('delivery')}
            >
              Delivery
            </button>
          </div>

          <button
            ref={cartBtnRef}
            className="cart-btn"
            id="cartBtn"
            aria-label="Open cart"
            data-cursor="Cart"
            onClick={() => setIsCartOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span className="cart-btn__count" id="cartCount">
              {count || ''}
            </span>
          </button>

          <button
            className="burger"
            id="burger"
            aria-label="Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};
