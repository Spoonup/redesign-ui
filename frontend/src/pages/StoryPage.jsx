import React, { useRef } from 'react';
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

export const StoryPage = () => {
  const containerRef = useRef(null);
  useScrollReveal(containerRef);

  return (
    <div ref={containerRef}>
      <section className="page-hero">
        <div className="wrap">
          <div className="page-hero__crumb mono">SpoonUp / Our Story</div>
          <h1 className="display" data-split>
            Good food, <em>higher days.</em>
          </h1>
          <p className="page-hero__lede" data-reveal>
            SpoonUp makes small indulgences that taste joyful and fit thoughtfully into everyday
            life.
          </p>
        </div>
      </section>

      <section className="wrap">
        <div className="story-split">
          <div className="story-img" data-clip>
            <img
              src="https://storage.googleapis.com/spoonup-508319-product-images/products/catalog-prod-1.jpg"
              alt="Paan dry fruit gulkand modak"
            />
            <span className="hand">a healthier, happier you</span>
          </div>
          <div>
            <div className="mono" style={{ color: 'var(--walnut)', marginBottom: '16px' }} data-reveal>
              01 · What we believe
            </div>
            <h2 className="display" data-split>
              Delicious <em style={{ fontStyle: 'normal', color: 'var(--dragon)' }}>and</em> nutritious.
            </h2>
            <p data-reveal>
              We believe food can be both. It doesn't have to be one or the other, and a treat
              shouldn't come with a side of guilt.
            </p>
            <p data-reveal>
              Our products are made with real ingredients and created to bring a little more
              goodness to busy days: a protein pudding at 4pm, a modak after dinner, a handful of
              Kashmiri walnuts on the way out.
            </p>
          </div>
        </div>
      </section>

      <section className="story-quote">
        <div className="wrap">
          <blockquote data-split>“Small indulgences, big impact.”</blockquote>
          <cite data-reveal>the whole idea, in four words</cite>
        </div>
      </section>

      <section className="wrap">
        <div className="story-split rev">
          <div>
            <div className="mono" style={{ color: 'var(--walnut)', marginBottom: '16px' }} data-reveal>
              02 · How we make it
            </div>
            <h2 className="display" data-split>
              Made with care.
            </h2>
            <p data-reveal>
              From ingredient selection to preparation and packing, we focus on quality, freshness
              and honest food. Honest food, the way you would make it at home.
            </p>
          </div>
          <div className="story-img" data-clip>
            <img
              src="https://storage.googleapis.com/spoonup-508319-product-images/products/1789196981574-9775dbb9-ef35-4098-bcc7-e36802135ff3.jpg"
              alt="Dragon fruit smoothie"
            />
            <span className="hand">take a spoon, guilt free</span>
          </div>
        </div>

        <div className="steps">
          <div className="step" data-reveal="0">
            <div className="display">1</div>
            <h3>Choose</h3>
            <p>
              Ingredients picked for taste and nutrition in equal measure: nuts, seeds, dry fruits,
              whole grains.
            </p>
          </div>
          <div className="step" data-reveal=".1">
            <div className="display">2</div>
            <h3>Prepare</h3>
            <p>
              Sweetened with natural alternatives like dates, never refined white sugar. Made fresh.
            </p>
          </div>
          <div className="step" data-reveal=".2">
            <div className="display">3</div>
            <h3>Pack</h3>
            <p>
              Packed with care, ready for pickup from the Main Shop or delivered to your door.
            </p>
          </div>
        </div>
      </section>

      <section className="board-sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="board">
            <div>
              <h2>
                The person
                <br />
                <u>behind SpoonUp.</u>
              </h2>
              <p>
                For questions, partnerships or feedback, get in touch with Urmila Kedawat at SpoonUp.
                Every email gets a real reply.
              </p>
              <a className="btn" href="mailto:info@spoonupfoods.com" data-magnet>
                info@spoonupfoods.com <span className="btn__icon">{ARROW_ICON}</span>
              </a>
            </div>
            <ul className="board__list">
              <li>
                <span>Partnerships</span>
                <span className="dots"></span>
                <b>yes please</b>
              </li>
              <li>
                <span>Questions</span>
                <span className="dots"></span>
                <b>ask away</b>
              </li>
              <li>
                <span>Feedback</span>
                <span className="dots"></span>
                <b>always</b>
              </li>
              <li>
                <span>Reply time</span>
                <span className="dots"></span>
                <b>≤ 2 days</b>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
