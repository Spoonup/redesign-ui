import React from 'react';
import { useQuickView } from '../context/QuickViewContext';
import { useCart } from '../context/CartContext';
import { SPOONUP, formatRupee } from '../data/data';

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

export const QuickViewModal = () => {
  const { activeProductId, isQuickViewOpen, closeQuickView } = useQuickView();
  const { addToCart } = useCart();

  const product = SPOONUP.products.find((p) => p.id === activeProductId);
  if (!product) return null;

  const handleAddToCart = (e) => {
    addToCart(product.id, e.currentTarget);
  };

  return (
    <div
      className={`qv ${isQuickViewOpen ? 'open' : ''}`}
      id="qv"
      aria-hidden={!isQuickViewOpen}
    >
      <div className="qv__scrim" onClick={closeQuickView} />
      <div className="qv__card" role="dialog" aria-modal="true">
        <button
          className="drawer__close qv__close"
          aria-label="Close"
          onClick={closeQuickView}
        >
          ✕
        </button>

        <div
          className="qv__media"
          style={{ '--tint': product.tint }}
        >
          <img src={product.img} alt={product.name} />
        </div>

        <div className="qv__body">
          <span className="mono" style={{ color: 'var(--walnut)' }}>
            {product.cat} · {product.mode === 'now' ? 'Ready today' : 'Deliver later'}
          </span>
          <h3>{product.name}</h3>
          <p className="hand" style={{ fontSize: '20px', margin: 0 }}>
            {product.sub}
          </p>
          <p>{product.desc}</p>
          <div className="dish__price">
            {formatRupee(product.price)}
            <small>{product.unit} + 5% GST</small>
          </div>
          <button
            className="btn"
            style={{ alignSelf: 'flex-start' }}
            onClick={handleAddToCart}
          >
            Add to cart <span className="btn__icon">{PLUS_ICON}</span>
          </button>
          <p className="mono" style={{ fontSize: '11px', marginTop: 'auto' }}>
            Contains nuts, dairy or gluten? Check with us before ordering if you have allergies.
          </p>
        </div>
      </div>
    </div>
  );
};
