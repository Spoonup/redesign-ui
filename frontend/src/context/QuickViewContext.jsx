import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const QuickViewContext = createContext(null);

export const QuickViewProvider = ({ children }) => {
  const [activeProductId, setActiveProductId] = useState(null);

  const openQuickView = useCallback((id) => {
    setActiveProductId(id);
  }, []);

  const closeQuickView = useCallback(() => {
    setActiveProductId(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeProductId) {
        closeQuickView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProductId, closeQuickView]);

  return (
    <QuickViewContext.Provider
      value={{
        activeProductId,
        isQuickViewOpen: !!activeProductId,
        openQuickView,
        closeQuickView
      }}
    >
      {children}
    </QuickViewContext.Provider>
  );
};

export const useQuickView = () => {
  const context = useContext(QuickViewContext);
  if (!context) {
    throw new Error('useQuickView must be used within a QuickViewProvider');
  }
  return context;
};
