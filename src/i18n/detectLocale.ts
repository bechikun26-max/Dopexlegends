import type { Locale } from './types';

/**
 * Detects the active locale from the browser's navigator.language.
 * Returns 'ja' if the browser language starts with "ja", otherwise 'en'.
 */
export function detectLocale(): Locale {
  const lang = navigator.language ?? '';
  return lang.startsWith('ja') ? 'ja' : 'en';
}
