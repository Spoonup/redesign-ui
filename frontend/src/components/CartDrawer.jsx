import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatRupee } from '../data/data';

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

export const CartDrawer = () => {
  const {
    cart,
    mode,
    isCartOpen,
    setIsCartOpen,
    increment,
    decrement,
    subtotal,
    gst,
    total,
    freeDeliveryRemaining,
    freeDeliveryPercent,
    showToast,
    getProduct
  } = useCart();

  const items = Object.entries(cart)
    .map(([id, qty]) => ({
      product: getProduct(id),
      qty
    }))
    .filter((item) => item.product && item.qty > 0);

  const handleCheckout = () => {
    showToast('Checkout would hand off to the payment provider here.');
  };

  return (
    <>
      <div
        className="drawer-scrim"
        id="scrim"
        onClick={() => setIsCartOpen(false)}
      />

      <aside
        className="drawer"
        id="drawer"
        aria-label="Your cart"
        aria-hidden={!isCartOpen}
      >
        <div className="drawer__head">
          <h3>Your spoonful</h3>
          <button
            className="drawer__close"
            id="drawerClose"
            aria-label="Close cart"
            onClick={() => setIsCartOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="drawer__free" id="freeBar">
          {mode === 'pickup' ? (
            <>
              <b>Pickup from Main Shop.</b> No delivery fee, just come say hi.
              <div className="bar">
                <i style={{ width: '100%' }}></i>
              </div>
            </>
          ) : (
            <>
              {freeDeliveryRemaining > 0 ? (
                <>
                  Add <b>{formatRupee(freeDeliveryRemaining)}</b> more for <b>free delivery</b>
                </>
              ) : (
                <b>Free delivery unlocked. Nice.</b>
              )}
              <div className="bar">
                <i style={{ width: `${freeDeliveryPercent}%` }}></i>
              </div>
            </>
          )}
        </div>

        <div className="drawer__items" id="cartItems">
          {items.length > 0 ? (
            items.map(({ product, qty }) => (
              <div className="line" key={product.id}>
                <img src={product.img} alt={product.name} />
                <div>
                  <h5>{product.name}</h5>
                  <small>
                    {formatRupee(product.price)} {product.unit}
                    {product.mode === 'later' ? ' · deliver later' : ''}
                  </small>
                  <br />
                  <div className="qty">
                    <button
                      type="button"
                      aria-label="Decrease"
                      onClick={() => decrement(product.id)}
                    >
                      −
                    </button>
                    <span>{qty}</span>
                    <button
                      type="button"
                      aria-label="Increase"
                      onClick={() => increment(product.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="line__price">{formatRupee(product.price * qty)}</div>
              </div>
            ))
          ) : (
            <div className="drawer__empty">
              <div className="display">Empty spoon.</div>
              <p>Nothing in here yet. The chia pudding is a good place to start.</p>
              <Link
                className="btn btn--sm"
                to="/shop"
                onClick={() => setIsCartOpen(false)}
              >
                Browse the pantry <span className="btn__icon">{ARROW_ICON}</span>
              </Link>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer__foot" id="cartFoot">
            <div className="row">
              <span>Subtotal</span>
              <span>{formatRupee(subtotal)}</span>
            </div>
            <div className="row">
              <span>GST (5%)</span>
              <span>{formatRupee(gst)}</span>
            </div>
            <div className="row">
              <span>{mode === 'pickup' ? 'Pickup' : 'Delivery'}</span>
              <span>{mode === 'pickup' || freeDeliveryRemaining === 0 ? 'Free' : 'At checkout'}</span>
            </div>
            <div className="row total">
              <span>Total</span>
              <span>{formatRupee(total)}</span>
            </div>
            <button className="btn" id="checkout" onClick={handleCheckout}>
              Checkout · {formatRupee(total)}{' '}
              <span className="btn__icon">{ARROW_ICON}</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
