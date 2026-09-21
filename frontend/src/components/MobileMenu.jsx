import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/story', label: 'Our Story' },
  { to: '/ingredients', label: 'Ingredients' },
  { to: '/contact', label: 'Contact' }
];

export const MobileMenu = ({ isOpen, onClose }) => {
  const { mode, setMode, showToast } = useCart();
  const location = useLocation();

  const handleModeChange = (newMode) => {
    setMode(newMode);
    showToast(
      newMode === 'pickup'
        ? 'Pickup from Main Shop selected'
        : 'Delivery selected: free above ₹499'
    );
  };

  return (
    <div className="mobile-menu" id="mobileMenu" aria-hidden={!isOpen}>
      <div className="mobile-menu__mode">
        <button
          type="button"
          className={mode === 'pickup' ? 'is-active' : ''}
          onClick={() => handleModeChange('pickup')}
        >
          Pickup
        </button>
        <button
          type="button"
          className={mode === 'delivery' ? 'is-active' : ''}
          onClick={() => handleModeChange('delivery')}
        >
          Delivery
        </button>
      </div>

      <nav className="mobile-menu__nav">
        {LINKS.map(({ to, label }) => {
          const isExactHome = to === '/' && location.pathname === '/';
          const isOtherActive = to !== '/' && location.pathname.startsWith(to);
          const isCurrent = isExactHome || isOtherActive;

          return (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={isCurrent ? 'is-active' : ''}
            >
              {label}
            </NavLink>
          );
        })}
        <Link
          to="/policies"
          style={{ fontSize: 'clamp(24px, 6vw, 36px)', marginTop: '8px' }}
          onClick={onClose}
        >
          Policies
        </Link>
      </nav>

      <p className="hand">take a spoon, guilt free ♡</p>
    </div>
  );
};
