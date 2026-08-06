import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { translate } from '../translate';
import type { TranslationDictionary, TranslationParams } from '../types';

/**
 * Feature: i18n-localization, Property 4: Key Lookup Correctness
 * Feature: i18n-localization, Property 5: Interpolation Replacement
 * Feature: i18n-localization, Property 6: Missing Key Fallback
 *
 * Validates: Requirements 3.1, 3.2, 3.3
 */

// --- Generators ---

/** Generate a valid translation key (dot-notation identifier) */
const arbKey = fc
  .tuple(
    fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')), { minLength: 1, maxLength: 10 }),
    fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split('')), { minLength: 1, maxLength: 10 })
  )
  .map(([ns, name]) => `${ns}.${name}`);

/** Generate a non-empty plain string value (no placeholders) */
const arbPlainValue = fc.stringOf(
  fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ,.!?-'.split('')),
  { minLength: 1, maxLength: 50 }
);

/** Generate a random dictionary of 1-10 entries */
const arbDictionary: fc.Arbitrary<TranslationDictionary> = fc
  .array(fc.tuple(arbKey, arbPlainValue), { minLength: 1, maxLength: 10 })
  .map((entries) => Object.fromEntries(entries));

/** Generate a param name (word characters only) */
const arbParamName = fc.stringOf(
  fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')),
  { minLength: 1, maxLength: 8 }
);

/** Generate a param value (string or number) */
const arbParamValue: fc.Arbitrary<string | number> = fc.oneof(
  fc.stringOf(
    fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')),
    { minLength: 1, maxLength: 15 }
  ),
  fc.integer({ min: 0, max: 99999 })
);

describe('Feature: i18n-localization, Property 4: Key Lookup Correctness', () => {
  it('for any existing key, translate returns the dictionary value', () => {
    /**
     * Validates: Requirements 3.1
     */
    fc.assert(
      fc.property(arbDictionary, (dictionary) => {
        const keys = Object.keys(dictionary);
        // Pick a random existing key
        const key = keys[Math.floor(Math.random() * keys.length)];
        const result = translate(dictionary, key);
        expect(result).toBe(dictionary[key]);
      }),
      { numRuns: 100 }
    );
  });

  it('for any dictionary and any key in it, translate without params returns exact value', () => {
    /**
     * Validates: Requirements 3.1
     */
    fc.assert(
      fc.property(
        arbDictionary.chain((dict) => {
          const keys = Object.keys(dict);
          return fc.constantFrom(...keys).map((key) => ({ dict, key }));
        }),
        ({ dict, key }) => {
          const result = translate(dict, key);
          expect(result).toBe(dict[key]);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: i18n-localization, Property 5: Interpolation Replacement', () => {
  it('for templates with {{param}} placeholders and matching params, output contains no placeholders and contains all param values', () => {
    /**
     * Validates: Requirements 3.2
     */
    fc.assert(
      fc.property(
        // Generate 1-3 unique param names with their values
        fc.array(fc.tuple(arbParamName, arbParamValue), { minLength: 1, maxLength: 3 })
          .map((pairs) => {
            // Deduplicate param names
            const seen = new Set<string>();
            return pairs.filter(([name]) => {
              if (seen.has(name)) return false;
              seen.add(name);
              return true;
            });
          })
          .filter((pairs) => pairs.length > 0),
        (paramPairs) => {
          // Build a template with all param placeholders
          const template = paramPairs.map(([name]) => `Hello {{${name}}}`).join(' ');
          const key = 'test.interpolation';
          const dictionary: TranslationDictionary = { [key]: template };
          const params: TranslationParams = Object.fromEntries(paramPairs);

          const result = translate(dictionary, key, params);

          // No {{ }} placeholders remain
          expect(result).not.toMatch(/\{\{\w+\}\}/);

          // All param values appear as substrings
          for (const [, value] of paramPairs) {
            expect(result).toContain(String(value));
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('interpolation replaces all occurrences of placeholders with param values', () => {
    /**
     * Validates: Requirements 3.2
     */
    fc.assert(
      fc.property(
        arbParamName,
        arbParamValue,
        (paramName, paramValue) => {
          const template = `Before {{${paramName}}} middle {{${paramName}}} after`;
          const key = 'test.double';
          const dictionary: TranslationDictionary = { [key]: template };
          const params: TranslationParams = { [paramName]: paramValue };

          const result = translate(dictionary, key, params);

          expect(result).not.toContain(`{{${paramName}}}`);
          expect(result).toContain(String(paramValue));
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: i18n-localization, Property 6: Missing Key Fallback', () => {
  it('for any key NOT in dictionary, translate returns the key unchanged', () => {
    /**
     * Validates: Requirements 3.3
     */
    fc.assert(
      fc.property(
        arbDictionary,
        // Generate a key guaranteed not to be in the dictionary using a UUID-like prefix
        fc.uuid().map((uuid) => `missing.${uuid}`),
        (dictionary, missingKey) => {
          const result = translate(dictionary, missingKey);
          expect(result).toBe(missingKey);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for an empty dictionary, any key returns itself', () => {
    /**
     * Validates: Requirements 3.3
     */
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (key) => {
        const result = translate({}, key);
        expect(result).toBe(key);
      }),
      { numRuns: 100 }
    );
  });
});
