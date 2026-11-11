'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CURRENCY_KEY, isCurrency, type Currency } from '@/lib/currency';
import { FAVORITES_KEY, parseFavorites, toggleFavorite } from '@/lib/favorites';

interface Preferences {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  favorites: string[];
  toggleFavorite: (code: string) => void;
  /** False until stored preferences have been read on the client. */
  ready: boolean;
}

const PreferencesContext = createContext<Preferences | null>(null);

// Browser storage can be unavailable (private mode, blocked site data) – every access is guarded.
function read(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function write(key: string, value: string) {
  try { window.localStorage.setItem(key, value); } catch { /* keep working without persistence */ }
}

export function PreferencesProvider({ children, defaultCurrency }: { children: React.ReactNode; defaultCurrency: Currency }) {
  // Until the visitor picks a currency, the page language decides it (so the server render
  // already shows it); a stored choice applies after mount and wins on every language.
  const [chosen, setChosen] = useState<Currency | null>(null);
  const currency = chosen ?? defaultCurrency;
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = read(CURRENCY_KEY);
    if (isCurrency(stored)) setChosen(stored);
    setFavorites(parseFavorites(read(FAVORITES_KEY)));
    setReady(true);
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setChosen(c);
    write(CURRENCY_KEY, c);
  }, []);

  const toggle = useCallback((code: string) => {
    setFavorites((prev) => {
      const next = toggleFavorite(prev, code);
      write(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ currency, setCurrency, favorites, toggleFavorite: toggle, ready }),
    [currency, setCurrency, favorites, toggle, ready],
  );
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): Preferences {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error('usePreferences must be used inside PreferencesProvider');
  return value;
}
