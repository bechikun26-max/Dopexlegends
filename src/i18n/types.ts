export type Locale = 'ja' | 'en';

export type TranslationParams = Record<string, string | number>;

/**
 * A flat dictionary mapping dot-notation keys to translated strings.
 * Keys use the pattern: namespace.keyName
 * Values may contain {{paramName}} interpolation placeholders.
 */
export type TranslationDictionary = Record<string, string>;

export interface LocaleContextValue {
  /** The current active locale */
  locale: Locale;
  /** Translation function: resolves a key to a localized string */
  t: (key: string, params?: TranslationParams) => string;
}
