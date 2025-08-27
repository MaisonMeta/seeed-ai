'use client'

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme | null;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // This effect runs only on the client
    const savedTheme = localStorage.getItem('seeed-ai-theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if(theme) {
      const isDark = theme === 'dark';
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('seeed-ai-theme', theme);
    }
  }, [theme]);

  // Pass a stable value to the provider
  const value: ThemeContextType = React.useMemo(() => ({
    theme: theme,
    setTheme: setTheme as React.Dispatch<React.SetStateAction<Theme>>
  }), [theme]);


  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
