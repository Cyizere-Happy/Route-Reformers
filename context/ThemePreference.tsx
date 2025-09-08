import React, { createContext, useContext, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark';

type ThemePreference = {
  theme: ThemeMode;
  toggle: () => void;
  set: (mode: ThemeMode) => void;
};

const ThemePreferenceContext = createContext<ThemePreference | undefined>(undefined);

export function ThemePreferenceProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const value = useMemo<ThemePreference>(() => ({ theme, toggle: () => setTheme(t => (t === 'light' ? 'dark' : 'light')), set: setTheme }), [theme]);
  return <ThemePreferenceContext.Provider value={value}>{children}</ThemePreferenceContext.Provider>;
}

export function useThemePreference() {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) throw new Error('useThemePreference must be used within ThemePreferenceProvider');
  return ctx;
}


