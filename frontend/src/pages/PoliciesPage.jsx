import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useScrollReveal } from '../hooks/useScrollReveal';

const POLICIES = {
  shipping: {
    title: 'Shipping & Delivery',
    meta: 'Delivery availability and timing depend on the product, destination and service area shown at checkout.',
    sections: [
      {
        h: 'Order fulfilment',
        p: 'Products marked for immediate pickup can be collected from the counter shown on your order. Products marked “Deliver later” require a complete delivery address.'
      },
      {
        h: 'Delivery estimates',
        p: 'Any delivery date or time is an estimate. Weather, traffic, carrier delays and other circumstances may affect fulfilment.'
      },
      {
        h: 'Address accuracy',
        p: 'Please provide a complete and accurate address and phone number. Additional charges may apply if an order must be re-routed or re-delivered due to incorrect details or an unavailable recipient.'
      },
      {
        h: 'Damaged or missing items',
        p: 'Contact us at info@spoonupfoods.com within 24 hours of delivery with your order number and clear photographs so we can investigate.'
      }
    ]
  },
  refunds: {
    title: 'Cancellation & Refunds',
    meta: 'Because many SpoonUp products are freshly prepared or perishable, cancellations and returns are limited.',
    sections: [
      {
        h: 'Cancellations',
        p: 'You may request cancellation before preparation or fulfilment begins. Once an order is being prepared, packed, dispatched or made specifically for you, it may not be cancellable.'
      },
      {
        h: 'Refund eligibility',
        p: 'If we cancel an order, charge you incorrectly, or confirm that an item arrived damaged, unsafe or materially different from the order, we will offer an appropriate replacement, credit or refund.'
      },
      {
        h: 'How to request help',
        p: 'Email info@spoonupfoods.com with your order number, issue details and supporting photographs within 24 hours of pickup or delivery.'
      },
      {
        h: 'Refund timing',
        p: 'Approved refunds are sent to the original payment method. Bank or payment-provider processing may take 5–10 business days after approval.'
      }
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    meta: 'Last updated: 12 September 2026',
    sections: [
      {
        h: 'Information we collect',
        p: 'We may collect your name, phone number, email address, delivery address, order details and account information when you use our website or place an order.'
      },
      {
        h: 'How we use information',
        p: 'We use this information to process and deliver orders, provide customer support, send service messages, prevent fraud, meet legal obligations and improve our services.'
      },
      {
        h: 'Payments',
        p: 'Online payments are processed by our payment provider. SpoonUp does not store complete card or UPI credentials.'
      },
      {
        h: 'Sharing and retention',
        p: 'We share information only with service providers needed to fulfil your order or where required by law. We retain records only for as long as operational, tax and legal requirements demand.'
      },
      {
        h: 'Your choices',
        p: 'You may request access, correction or deletion of eligible personal information by emailing info@spoonupfoods.com.'
      }
    ]
  },
  terms: {
    title: 'Terms & Conditions',
    meta: 'By accessing this website or placing an order, you agree to these terms.',
    sections: [
      {
        h: 'Orders',
        p: 'Orders are accepted subject to product availability and successful confirmation. We may cancel or limit an order in case of pricing errors, stock issues, suspected misuse or circumstances beyond our control.'
      },
      {
        h: 'Prices and taxes',
        p: 'Prices are shown in Indian Rupees. Applicable GST and other charges are displayed before checkout.'
      },
      {
        h: 'Product information',
        p: 'We aim to keep descriptions and images accurate. Handmade food may naturally vary in appearance. Customers are responsible for checking ingredients and informing us of allergies before ordering.'
      },
      {
        h: 'Use of the website',
        p: 'You must not misuse the website, attempt unauthorised access, interfere with its operation or use it for unlawful activity.'
      },
      {
        h: 'Liability',
        p: 'To the extent permitted by law, SpoonUp is not responsible for indirect loss arising from website use, delayed fulfilment or matters outside our reasonable control. Your statutory consumer rights remain unaffected.'
      },
      {
        h: 'Contact',
        p: 'Questions about these terms may be sent to info@spoonupfoods.com. GSTIN: 29AJYPK3031G1ZX.'
      }
    ]
  }
};

export const PoliciesPage = () => {
  const containerRef = useRef(null);
  const docRef = useRef(null);
  const location = useLocation();

  const getInitialTab = () => {
    const hash = location.hash.replace('#', '');
    return POLICIES[hash] ? hash : 'shipping';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useScrollReveal(containerRef);

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (POLICIES[hash] && hash !== activeTab) {
      setActiveTab(hash);
    }
  }, [location.hash, activeTab]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    window.location.hash = key;
    if (docRef.current) {
      gsap.from(docRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.05
      });
    }
  };

  const currentDoc = POLICIES[activeTab] || POLICIES.shipping;

  return (
    <div ref={containerRef}>
      <section className="page-hero">
        <div className="wrap">
          <div className="page-hero__crumb mono">SpoonUp / Policies</div>
          <h1 className="display" data-split>
            The fine <em>print.</em>
          </h1>
          <p className="page-hero__lede" data-reveal>
            Plain-language versions of how we deliver, refund and look after your data.
          </p>
        </div>
      </section>

      <section className="wrap policy">
        <div className="policy__tabs" role="tablist" id="tabs">
          {Object.entries(POLICIES).map(([k, { title }]) => (
            <button
              key={k}
              role="tab"
              data-k={k}
              aria-selected={activeTab === k}
              onClick={() => handleTabChange(k)}
            >
              {title}
              <span>→</span>
            </button>
          ))}
        </div>

        <article className="policy__doc" id="doc" role="tabpanel" ref={docRef}>
          <h2>{currentDoc.title}</h2>
          <p className="meta mono">{currentDoc.meta}</p>
          {currentDoc.sections.map(({ h, p }, idx) => (
            <section key={idx}>
              <h3>{h}</h3>
              <p>{p}</p>
            </section>
          ))}
        </article>
      </section>
    </div>
  );
};
