"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import {
  DEFAULT_LOCALE,
  LOCALES,
  MESSAGES,
  type Locale,
} from "@/lib/i18n";

const STORAGE_KEY = "sy-locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

export function useLocale() {
  return useContext(LocaleContext);
}

/**
 * Decorative EN / LG / RN toggle (brief section 5): English is the real
 * language, Luganda and Runyankole only flavour greetings, kicker words,
 * the hero blessing and the proverb. Client-side state keeps every page
 * static — no locale routing, no cookies, no dynamic rendering.
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    // Async state update only (lint: no synchronous setState in effects).
    const id = window.setTimeout(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && (LOCALES as readonly string[]).includes(stored)) {
        setLocaleState(stored as Locale);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
