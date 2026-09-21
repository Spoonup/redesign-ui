import React, { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useQuickView } from '../context/QuickViewContext';
import { formatRupee } from '../data/data';

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

export const DishCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { openQuickView } = useQuickView();
  const [isAdded, setIsAdded] = useState(false);
  const btnRef = useRef(null);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, btnRef.current);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1400);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    openQuickView(product.id);
  };

  return (
    <article
      className="dish"
      style={{ '--tint': product.tint }}
      data-cat={product.cat}
      data-id={product.id}
    >
      <a
        className="dish__media"
        href={`#quickview-${product.id}`}
        onClick={handleQuickView}
        data-cursor="View"
        aria-label={`Quick view ${product.name}`}
      >
        <img src={product.img} alt={product.name} loading="lazy" />
        <span className="dish__num">{String(index + 1).padStart(2, '0')}</span>
        <span className={`dish__badge ${product.mode}`}>
          {product.mode === 'now' ? 'Ready today' : 'Deliver later'}
        </span>
      </a>

      <div className="dish__body">
        <span className="dish__cat mono">{product.cat}</span>
        <h3 className="dish__name">{product.name}</h3>
        <p className="dish__sub">{product.sub}</p>
        <div className="dish__foot">
          <div className="dish__price">
            {formatRupee(product.price)}
            <small>{product.unit} + 5% GST</small>
          </div>
          <button
            ref={btnRef}
            className={`add ${isAdded ? 'is-added' : ''}`}
            onClick={handleAdd}
            type="button"
          >
            {isAdded ? (
              '✓ Added'
            ) : (
              <>
                {PLUS_ICON} Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
