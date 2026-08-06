import type { TranslationDictionary, TranslationParams } from './types';

/**
 * Resolves a dot-notation key against a flat dictionary.
 * Supports interpolation with {{paramName}} syntax.
 * Returns the key itself if not found (fallback behavior).
 */
export function translate(
  dictionary: TranslationDictionary,
  key: string,
  params?: TranslationParams
): string {
  const template = dictionary[key];
  if (template === undefined) return key;
  if (!params) return template;

  return template.replace(/\{\{(\w+)\}\}/g, (match, paramName) => {
    const value = params[paramName];
    return value !== undefined ? String(value) : match;
  });
}
