import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { SPOONUP } from '../data/data';
import { DishCard } from '../components/DishCard';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const ShopPage = () => {
  const containerRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat') || 'All';

  const [category, setCategory] = useState(catParam);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useScrollReveal(containerRef);

  // Sync category param with state
  useEffect(() => {
    setCategory(searchParams.get('cat') || 'All');
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === 'All') {
      searchParams.delete('cat');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ cat });
    }
  };

  const categories = ['All', ...SPOONUP.categories];

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const list = SPOONUP.products.filter((p) => {
      const matchesCategory = category === 'All' || p.cat === category;
      const matchesSearch =
        !term ||
        (p.name + ' ' + p.sub + ' ' + p.cat + ' ' + p.desc).toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });

    const sorted = [...list];
    if (sortBy === 'low') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'high') sorted.sort((a, b) => b.price - a.price);
    if (sortBy === 'az') sorted.sort((a, b) => a.name.localeCompare(b.name));

    return sorted;
  }, [category, searchTerm, sortBy]);

  // Clean mount animation ensuring 100% opacity
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const cards = containerRef.current?.querySelectorAll('#grid .dish');
    if (!cards || cards.length === 0) return;

    gsap.fromTo(
      cards,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.04,
        clearProps: 'all'
      }
    );
  }, [category]);

  return (
    <div ref={containerRef}>
      <section className="page-hero">
        <div className="wrap">
          <div className="page-hero__crumb mono">SpoonUp / Shop</div>
          <h1 className="display" data-split>
            The <em>pantry.</em>
          </h1>
          <p className="page-hero__lede" data-reveal>
            Nutritious treats for everyday happiness. Things marked <b>Ready today</b> can be picked
            up from the Main Shop; <b>Deliver later</b> items need a delivery address.
          </p>
        </div>
      </section>

      <div className="shopbar">
        <div className="wrap">
          <label className="search">
            <span className="sr-only">Search</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="q"
              type="search"
              placeholder="Search chia, modak, walnuts…"
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>

          <select
            className="sort"
            id="sort"
            aria-label="Sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="az">A → Z</option>
          </select>

          <div className="chips" id="chips" role="group" aria-label="Categories">
            {categories.map((c) => {
              const count =
                c === 'All'
                  ? SPOONUP.products.length
                  : SPOONUP.products.filter((p) => p.cat === c).length;
              return (
                <button
                  key={c}
                  type="button"
                  data-c={c}
                  aria-pressed={c === category}
                  onClick={() => handleCategoryChange(c)}
                >
                  {c}
                  <sup>{count}</sup>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="wrap">
        <div className="grid" id="grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p, i) => <DishCard key={p.id} product={p} index={i} />)
          ) : (
            <div className="grid__empty">
              <div className="display">Nothing on that spoon.</div>
              <p>Try another word or category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
