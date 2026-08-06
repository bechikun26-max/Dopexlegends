import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { detectLocale } from '../detectLocale';

/**
 * Feature: i18n-localization, Property 1: Locale Detection Correctness
 *
 * For any string value of navigator.language, detectLocale() SHALL return 'ja'
 * if and only if the string starts with "ja", and 'en' otherwise.
 * The function must always return one of these two values and never throw.
 *
 * Validates: Requirements 1.2, 1.3
 */

function mockNavigatorLanguage(value: string | undefined): void {
  Object.defineProperty(navigator, 'language', {
    value,
    writable: true,
    configurable: true,
  });
}

const originalLanguage = navigator.language;

afterEach(() => {
  Object.defineProperty(navigator, 'language', {
    value: originalLanguage,
    writable: true,
    configurable: true,
  });
});

describe('Feature: i18n-localization, Property 1: Locale Detection Correctness', () => {
  it('Property: for any string starting with "ja", detectLocale returns \'ja\'', () => {
    /**
     * Validates: Requirements 1.2
     */
    fc.assert(
      fc.property(
        fc.string().map((suffix) => `ja${suffix}`),
        (lang) => {
          mockNavigatorLanguage(lang);
          expect(detectLocale()).toBe('ja');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property: for any string NOT starting with "ja", detectLocale returns \'en\'', () => {
    /**
     * Validates: Requirements 1.3
     */
    fc.assert(
      fc.property(
        fc.string().filter((s) => !s.startsWith('ja')),
        (lang) => {
          mockNavigatorLanguage(lang);
          expect(detectLocale()).toBe('en');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property: detectLocale always returns one of \'ja\' | \'en\' (never throws)', () => {
    /**
     * Validates: Requirements 1.2, 1.3
     */
    fc.assert(
      fc.property(fc.string(), (lang) => {
        mockNavigatorLanguage(lang);
        const result = detectLocale();
        expect(['ja', 'en']).toContain(result);
      }),
      { numRuns: 100 }
    );
  });

  describe('Unit test: edge cases', () => {
    it('returns \'en\' for empty string', () => {
      mockNavigatorLanguage('');
      expect(detectLocale()).toBe('en');
    });

    it('returns \'en\' for undefined navigator.language', () => {
      mockNavigatorLanguage(undefined);
      expect(detectLocale()).toBe('en');
    });

    it('returns \'ja\' for "ja"', () => {
      mockNavigatorLanguage('ja');
      expect(detectLocale()).toBe('ja');
    });

    it('returns \'ja\' for "ja-JP"', () => {
      mockNavigatorLanguage('ja-JP');
      expect(detectLocale()).toBe('ja');
    });

    it('returns \'en\' for "en-US"', () => {
      mockNavigatorLanguage('en-US');
      expect(detectLocale()).toBe('en');
    });

    it('returns \'en\' for "fr"', () => {
      mockNavigatorLanguage('fr');
      expect(detectLocale()).toBe('en');
    });
  });
});
