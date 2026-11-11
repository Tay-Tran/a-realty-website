'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CURRENCY_KEY, isCurrency, type Currency } from '@/lib/currency';
import { FAVORITES_KEY, parseFavorites, toggleFavorite } from '@/lib/favorites';

interface Preferences {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  favorites: string[];
  toggleFavorite: (code: string) => void;
}

const PreferencesContext = createContext<Preferences | null>(null);

// Browser storage can be unavailable (private mode, blocked site data) – every access is guarded.
function read(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function write(key: string, value: string) {
  try { window.localStorage.setItem(key, value); } catch { /* keep working without persistence */ }
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  // Server render always uses JPY and no favorites; stored choices apply after mount.
  const [currency, setCurrencyState] = useState<Currency>('JPY');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = read(CURRENCY_KEY);
    if (isCurrency(stored)) setCurrencyState(stored);
    setFavorites(parseFavorites(read(FAVORITES_KEY)));
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    write(CURRENCY_KEY, c);
  }, []);

  const toggle = useCallback((code: string) => {
    setFavorites((prev) => {
      const next = toggleFavorite(prev, code);
      write(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(() => ({ currency, setCurrency, favorites, toggleFavorite: toggle }), [currency, setCurrency, favorites, toggle]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): Preferences {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error('usePreferences must be used inside PreferencesProvider');
  return value;
}
