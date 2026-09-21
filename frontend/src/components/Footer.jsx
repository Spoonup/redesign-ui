import React from 'react';
import { Link } from 'react-router-dom';

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

export const Footer = () => {
  const letters = 'SpoonUp'.split('');

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__cta">
          <h2 className="display" data-split>
            Hungry now? <em>Take a spoon.</em>
          </h2>
          <Link className="btn btn--sun" to="/shop" data-magnet>
            Open the pantry <span className="btn__icon">{ARROW_ICON}</span>
          </Link>
        </div>

        <div className="footer__cols">
          <div>
            <h4>SpoonUp Foods</h4>
            <p>Small indulgences, big impact. Real food made with care for happier, healthier days.</p>
            <p className="mono" style={{ opacity: 0.5 }}>
              GSTIN 29AJYPK3031G1ZX
            </p>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              <li>
                <Link className="link-u" to="/shop">
                  Shop all
                </Link>
              </li>
              <li>
                <Link className="link-u" to="/story">
                  Our Story
                </Link>
              </li>
              <li>
                <Link className="link-u" to="/ingredients">
                  Our Ingredients
                </Link>
              </li>
              <li>
                <Link className="link-u" to="/contact">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Help</h4>
            <ul>
              <li>
                <Link className="link-u" to="/policies#shipping">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link className="link-u" to="/policies#refunds">
                  Cancellation &amp; Refunds
                </Link>
              </li>
              <li>
                <Link className="link-u" to="/policies#privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="link-u" to="/policies#terms">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Say hi</h4>
            <ul>
              <li>
                <a className="link-u" href="mailto:info@spoonupfoods.com">
                  info@spoonupfoods.com
                </a>
              </li>
              <li>
                <a
                  className="link-u"
                  href="https://www.instagram.com/spoonupfoods/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="wrap footer__bottom">
        <span>© {new Date().getFullYear()} SpoonUp Foods. All rights reserved.</span>
        <span>Good food, higher days.</span>
      </div>

      <div className="footer__word" aria-hidden="true">
        {letters.map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </div>
    </footer>
  );
};
