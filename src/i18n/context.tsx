import { createContext, useContext, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Locale, TranslationParams, TranslationDictionary, LocaleContextValue } from './types';
import { detectLocale } from './detectLocale';
import { translate } from './translate';
import en from './locales/en.json';
import ja from './locales/ja.json';

const dictionaries: Record<Locale, TranslationDictionary> = { en, ja };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useMemo(() => detectLocale(), []);
  const dictionary = dictionaries[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useMemo(
    () => (key: string, params?: TranslationParams) => translate(dictionary, key, params),
    [dictionary]
  );

  const value: LocaleContextValue = useMemo(() => ({ locale, t }), [locale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useTranslation must be used within LocaleProvider');
  }
  return context;
}
