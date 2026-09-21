import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { CartProvider, useCart } from './context/CartContext';
import { QuickViewProvider, useQuickView } from './context/QuickViewContext';
import { useSmoothScroll, scrollTo } from './hooks/useSmoothScroll';
import { Ticker } from './components/Ticker';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { Toast } from './components/Toast';
import { CustomCursor } from './components/CustomCursor';
import { PageTransitionPanels } from './components/PageTransitionPanels';
import { Loader } from './components/Loader';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { StoryPage } from './pages/StoryPage';
import { IngredientsPage } from './pages/IngredientsPage';
import { ContactPage } from './pages/ContactPage';
import { PoliciesPage } from './pages/PoliciesPage';

const AppContent = () => {
  const location = useLocation();
  const { isCartOpen } = useCart();
  const { isQuickViewOpen } = useQuickView();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(() => location.pathname === '/');

  // Smooth scroll
  useSmoothScroll(isCartOpen || isQuickViewOpen || isMobileMenuOpen);

  // Sync mobile menu class with body
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change & scroll appropriately
  useEffect(() => {
    setIsMobileMenuOpen(false);
    if (!location.hash) {
      scrollTo(0, { immediate: true });
    } else {
      setTimeout(() => {
        scrollTo(location.hash, { offset: -80 });
      }, 100);
    }
  }, [location.pathname, location.hash]);

  // Global magnetic button listeners
  useEffect(() => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFine || reduceMotion) return;

    const magnetElements = document.querySelectorAll('[data-magnet]');
    const handlers = [];

    magnetElements.forEach((el) => {
      const handleMove = (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * 0.3,
          y: (e.clientY - r.top - r.height / 2) * 0.4,
          duration: 0.5,
          ease: 'power3'
        });
      };

      const handleLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.9,
          ease: 'elastic.out(1, 0.35)'
        });
      };

      el.addEventListener('pointermove', handleMove);
      el.addEventListener('pointerleave', handleLeave);
      handlers.push({ el, handleMove, handleLeave });
    });

    return () => {
      handlers.forEach(({ el, handleMove, handleLeave }) => {
        el.removeEventListener('pointermove', handleMove);
        el.removeEventListener('pointerleave', handleLeave);
      });
    };
  }, [location.pathname]);

  const handleLoaderComplete = () => {
    setIsLoading(false);
    document.body.classList.remove('is-loading');
  };

  return (
    <>
      {isLoading && <Loader onComplete={handleLoaderComplete} />}

      <div id="chrome-top">
        <Ticker />
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/policies" element={<PoliciesPage />} />
        </Routes>
      </main>

      <div id="chrome-bottom">
        <Footer />
        <CartDrawer />
        <QuickViewModal />
        <Toast />
        <CustomCursor />
        <PageTransitionPanels />
      </div>
    </>
  );
};

export const App = () => {
  return (
    <CartProvider>
      <QuickViewProvider>
        <AppContent />
      </QuickViewProvider>
    </CartProvider>
  );
};

export default App;
