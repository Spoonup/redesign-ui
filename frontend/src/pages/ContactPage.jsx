import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useCart } from '../context/CartContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

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

const FAQS = [
  {
    q: 'Can I pick up my order?',
    a: 'Yes. Products marked "Ready today" can be collected from the Main Shop counter shown on your order. Choose Pickup in the header toggle.'
  },
  {
    q: 'When is delivery free?',
    a: 'Free delivery applies on eligible orders above ₹499. Delivery availability and timing depend on the product, destination and service area shown at checkout.'
  },
  {
    q: 'What does "Deliver later" mean?',
    a: 'Those items (like our Kashmiri dry fruits and muesli) aren\'t available for immediate pickup, so they need a complete delivery address.'
  },
  {
    q: 'Can I cancel an order?',
    a: 'You may request cancellation before preparation or fulfilment begins. Because many products are freshly prepared or perishable, once an order is being prepared, packed or dispatched it may not be cancellable.'
  },
  {
    q: 'Something arrived damaged. What now?',
    a: 'Email info@spoonupfoods.com within 24 hours of pickup or delivery with your order number and clear photographs. We\'ll offer a replacement, credit or refund where appropriate.'
  },
  {
    q: 'I have a nut allergy. Is it safe?',
    a: 'Several products contain nuts, dairy or gluten and are prepared in a shared kitchen. Please check the product description and write to us before ordering.'
  }
];

export const ContactPage = () => {
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const { showToast } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'A question about my order',
    order: '',
    msg: ''
  });

  const [errors, setErrors] = useState({});

  useScrollReveal(containerRef);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = true;
    }
    if (!formData.msg.trim()) newErrors.msg = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { x: -10 },
          { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.25)' }
        );
      }
      showToast('A couple of fields need filling in');
      return;
    }

    const body = `${formData.msg.trim()}\n\n${
      formData.order.trim() ? 'Order: ' + formData.order.trim() + '\n' : ''
    }From: ${formData.name.trim()} (${formData.email.trim()})`;

    window.location.href = `mailto:info@spoonupfoods.com?subject=${encodeURIComponent(
      '[SpoonUp] ' + formData.topic
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  return (
    <div ref={containerRef}>
      <section className="page-hero">
        <div className="wrap">
          <div className="page-hero__crumb mono">SpoonUp / Contact</div>
          <h1 className="display" data-split>
            Say <em>hello.</em>
          </h1>
          <p className="page-hero__lede" data-reveal>
            We would love to hear from you: orders, allergies, partnerships, or just to tell us the
            modak was good.
          </p>
        </div>
      </section>

      <section className="wrap contact">
        <form
          className="form"
          id="form"
          ref={formRef}
          data-reveal
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="two">
            <div className="field">
              <input
                id="name"
                name="name"
                placeholder=" "
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                style={errors.name ? { borderBottomColor: 'var(--dragon)' } : {}}
              />
              <label htmlFor="name">Your name</label>
            </div>
            <div className="field">
              <input
                id="email"
                name="email"
                type="email"
                placeholder=" "
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                style={errors.email ? { borderBottomColor: 'var(--dragon)' } : {}}
              />
              <label htmlFor="email">Email</label>
            </div>
          </div>

          <div className="field field--static">
            <select
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
            >
              <option>A question about my order</option>
              <option>Allergies &amp; ingredients</option>
              <option>Bulk orders or gifting</option>
              <option>Partnerships</option>
              <option>Just saying hi</option>
            </select>
            <label htmlFor="topic">What's it about?</label>
          </div>

          <div className="field">
            <input
              id="order"
              name="order"
              placeholder=" "
              value={formData.order}
              onChange={handleChange}
            />
            <label htmlFor="order">Order number (if you have one)</label>
          </div>

          <div className="field">
            <textarea
              id="msg"
              name="msg"
              placeholder=" "
              required
              value={formData.msg}
              onChange={handleChange}
              style={errors.msg ? { borderBottomColor: 'var(--dragon)' } : {}}
            ></textarea>
            <label htmlFor="msg">Your message</label>
          </div>

          <button
            className="btn"
            type="submit"
            style={{ justifySelf: 'start' }}
            data-magnet
          >
            Send it over <span className="btn__icon">{ARROW_ICON}</span>
          </button>
          <p className="mono" style={{ fontSize: '11px', color: 'var(--muted)', margin: 0 }}>
            This opens your email app with everything filled in. Nothing is stored on this site.
          </p>
        </form>

        <div className="cards">
          <div
            className="ccard"
            style={{ '--c': 'var(--forest)', '--fg': 'var(--paper)' }}
            data-reveal=".05"
          >
            <span className="mono">Customer care</span>
            <h3>
              <a href="mailto:info@spoonupfoods.com">info@spoonupfoods.com</a>
            </h3>
            <p>Contact person: Urmila Kedawat</p>
          </div>

          <div className="ccard" style={{ '--c': 'var(--turmeric)' }} data-reveal=".1">
            <span className="mono">Response time</span>
            <h3>Within 2 business days</h3>
            <p>Include your order number if it's about an order.</p>
          </div>

          <div
            className="ccard"
            style={{ '--c': 'var(--dragon)', '--fg': '#fff' }}
            data-reveal=".15"
          >
            <span className="mono">Social</span>
            <h3>
              <a
                href="https://www.instagram.com/spoonupfoods/"
                target="_blank"
                rel="noopener noreferrer"
              >
                @spoonupfoods ↗
              </a>
            </h3>
            <p>New batches and specials land here first.</p>
          </div>

          <div className="ccard" data-reveal=".2">
            <span className="mono">Business details</span>
            <h3>GSTIN</h3>
            <p className="mono" style={{ fontSize: '14px' }}>
              29AJYPK3031G1ZX
            </p>
          </div>
        </div>
      </section>

      <section className="wrap faq">
        <h2 className="display" data-split>
          Good questions.
        </h2>
        {FAQS.map(({ q, a }, index) => (
          <details key={index}>
            <summary>
              {q} <i>+</i>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </div>
  );
};
