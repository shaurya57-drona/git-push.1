import React, { createContext, useContext, useState, useEffect } from 'react';

interface BlueprintGridContextType {
  showGrid: boolean;
  toggleGrid: () => void;
  setShowGrid: (show: boolean) => void;
}

const BlueprintGridContext = createContext<BlueprintGridContextType | undefined>(undefined);

export const BlueprintGridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showGrid, setShowGridState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('conic_blueprint_grid');
      if (saved !== null) {
        return saved === 'true';
      }
    }
    return true; // Default to on
  });

  const toggleGrid = () => {
    setShowGridState((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('conic_blueprint_grid', String(next));
      }
      return next;
    });
  };

  const setShowGrid = (val: boolean) => {
    setShowGridState(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('conic_blueprint_grid', String(val));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('conic_blueprint_grid', String(showGrid));
      if (showGrid) {
        document.documentElement.classList.add('has-blueprint-grid');
        document.documentElement.classList.remove('no-blueprint-grid');
      } else {
        document.documentElement.classList.remove('has-blueprint-grid');
        document.documentElement.classList.add('no-blueprint-grid');
      }
    }
  }, [showGrid]);

  return (
    <BlueprintGridContext.Provider value={{ showGrid, toggleGrid, setShowGrid }}>
      {children}
    </BlueprintGridContext.Provider>
  );
};

export const useBlueprintGrid = (): BlueprintGridContextType => {
  const context = useContext(BlueprintGridContext);
  if (!context) {
    throw new Error('useBlueprintGrid must be used within a BlueprintGridProvider');
  }
  return context;
};
