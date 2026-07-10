// src/theme/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { palettes } from './theme';
import { storageGet, storageSet } from '../utils/storage';

const STORAGE_KEY = 'theme_mode';

const ThemeContext = createContext({
  mode: 'dark',
  colors: palettes.dark,
  toggleMode: () => {},
});

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');

  // Muat preferensi tersimpan saat mount
  useEffect(() => {
    (async () => {
      const saved = await storageGet(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') setMode(saved);
    })();
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      storageSet(STORAGE_KEY, next);
      return next;
    });
  };

  const value = {
    mode,
    colors: palettes[mode],
    toggleMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
