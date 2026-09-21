import React, { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const SHELF_ITEMS = [
  { name: 'Chia seeds', desc: 'Chocolate chia pudding, dragon fruit smoothie', bg: '#f2a33a' },
  { name: 'Skyr', desc: 'Thick, strained, protein-rich. In the chia pudding', bg: '#efe3cc' },
  { name: 'Dates', desc: 'Our go-to natural sweetener', bg: '#6b3f2a', fg: '#fff' },
  { name: 'Cocoa', desc: 'The chocolate in the chocolate pudding', bg: '#3d2418', fg: '#fff' },
  { name: 'Gulkand', desc: 'Rose petal preserve inside the paan modak', bg: '#e0457b', fg: '#fff' },
  { name: 'Paan', desc: 'Betel leaf, for that after-meal aroma', bg: '#5e8c3a', fg: '#fff' },
  { name: 'Sabudana', desc: 'Tapioca pearls, the crunch in our tikkis and fries', bg: '#fbf7ee' },
  { name: 'Sweet potato', desc: 'Golden, earthy, in the tikki', bg: '#c9702c', fg: '#fff' },
  { name: 'Dragon fruit', desc: 'The pink. All of it natural', bg: '#d63a7a', fg: '#fff' },
  { name: 'Kashmiri walnuts', desc: 'Kernels rich in omega-3', bg: '#7a5230', fg: '#fff' },
  { name: 'Kashmiri almonds', desc: 'Badam giri, rich in natural oils', bg: '#e8c89a' },
  { name: 'Fennel', desc: 'Sauf, for the end of a good meal', bg: '#7fa64b', fg: '#fff' }
];

export const IngredientsPage = () => {
  const containerRef = useRef(null);
  useScrollReveal(containerRef);

  return (
    <div ref={containerRef}>
      <section className="page-hero">
        <div className="wrap">
          <div className="page-hero__crumb mono">SpoonUp / Ingredients</div>
          <h1 className="display" data-split>
            Nothing <em>hidden.</em>
          </h1>
          <p className="page-hero__lede" data-reveal>
            Real ingredients, chosen for taste and nutrition in equal measure. Here's exactly how we
            think about what goes in.
          </p>
        </div>
      </section>

      <section className="wrap pillars">
        <article className="pillar" data-reveal>
          <div className="pillar__n">01</div>
          <h3>High protein</h3>
          <p>
            We build our recipes around ingredients such as nuts, seeds, dry fruits and whole
            grains, so a small serving carries real nutritional value. Our chia pudding even gets
            skyr and whey.
          </p>
        </article>

        <article className="pillar" data-reveal>
          <div className="pillar__n">02</div>
          <h3>No refined sugar</h3>
          <p>
            Our sweet products are sweetened with natural alternatives like dates instead of refined
            white sugar. The smoothie and muesli have no added sugar at all.
          </p>
        </article>

        <article className="pillar" data-reveal>
          <div className="pillar__n">03</div>
          <h3>Real, recognisable</h3>
          <p>
            We avoid unnecessary additives and use ingredients you would find in a home kitchen. If
            you can't pronounce it, it's probably not in here.
          </p>
        </article>

        <article className="pillar pillar--warn" data-reveal>
          <div className="pillar__n">!</div>
          <h3>Allergen note</h3>
          <p>
            Several products contain nuts, dairy or gluten and are prepared in a shared kitchen. If
            you have an allergy, please check the product description and write to{' '}
            <a href="mailto:info@spoonupfoods.com">info@spoonupfoods.com</a> before ordering.
          </p>
        </article>
      </section>

      <section className="pantry">
        <div className="wrap">
          <h2 className="display" data-split>
            The shelf.
          </h2>
          <div className="jars" id="jars">
            {SHELF_ITEMS.map(({ name, desc, bg, fg }, i) => (
              <div
                key={name}
                className="jarcard"
                data-reveal={(i % 4) * 0.06}
                style={{
                  '--c': bg,
                  ...(fg ? { '--fg': fg } : {})
                }}
              >
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <b>{name}</b>
                  <br />
                  <span>{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
