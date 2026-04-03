'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import {
  dictionaries,
  type Dictionary,
  type Locale,
} from '@/lib/i18n/dictionaries';

type I18nContextType = {
  locale: Locale;
  t: Dictionary;
  changeLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'pt-BR';
  const stored = localStorage.getItem('locale') as Locale | null;
  if (stored && stored in dictionaries) return stored;
  return 'pt-BR';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  const changeLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  }, []);

  return (
    <I18nContext value={{ locale, t: dictionaries[locale], changeLocale }}>
      {children}
    </I18nContext>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n deve ser usado dentro de um I18nProvider');
  }
  return context;
}
