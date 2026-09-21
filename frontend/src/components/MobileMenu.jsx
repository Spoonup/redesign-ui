import React from 'react';
import { Link } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/story', label: 'Our Story' },
  { to: '/ingredients', label: 'Ingredients' },
  { to: '/contact', label: 'Contact' }
];

export const MobileMenu = ({ isOpen, onClose }) => {
  return (
    <div className="mobile-menu" id="mobileMenu">
      {LINKS.map(({ to, label }) => (
        <Link key={to} to={to} onClick={onClose}>
          {label}
        </Link>
      ))}
      <Link
        to="/policies"
        style={{ fontSize: '28px', marginTop: '10px' }}
        onClick={onClose}
      >
        Policies
      </Link>
      <p className="hand">take a spoon, guilt free ♡</p>
    </div>
  );
};
