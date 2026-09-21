import React from 'react';
import { useCart } from '../context/CartContext';

export const Toast = () => {
  const { toastState } = useCart();

  return (
    <div
      className={`toast ${toastState.visible ? 'show' : ''}`}
      id="toast"
      role="status"
    >
      {toastState.message}
    </div>
  );
};
