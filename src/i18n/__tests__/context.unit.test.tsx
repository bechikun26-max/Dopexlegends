import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, renderHook } from '@testing-library/react';
import { LocaleProvider, useTranslation } from '../context';

/**
 * Validates: Requirements 1.4, 6.1, 6.2
 */

describe('LocaleProvider', () => {
  const originalLang = document.documentElement.lang;

  afterEach(() => {
    document.documentElement.lang = originalLang;
  });

  it('sets document.documentElement.lang to "ja" when navigator.language is Japanese', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'ja-JP',
      configurable: true,
    });

    render(
      <LocaleProvider>
        <div>test</div>
      </LocaleProvider>
    );

    expect(document.documentElement.lang).toBe('ja');
  });

  it('sets document.documentElement.lang to "en" when navigator.language is English', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    });

    render(
      <LocaleProvider>
        <div>test</div>
      </LocaleProvider>
    );

    expect(document.documentElement.lang).toBe('en');
  });

  it('useTranslation throws when used outside LocaleProvider', () => {
    // Suppress React error boundary console output during expected throw
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useTranslation())).toThrow(
      'useTranslation must be used within LocaleProvider'
    );

    consoleSpy.mockRestore();
  });

  it('locale is determined once and does not change on re-render', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'ja',
      configurable: true,
    });

    const { result, rerender } = renderHook(() => useTranslation(), {
      wrapper: ({ children }) => <LocaleProvider>{children}</LocaleProvider>,
    });

    const firstLocale = result.current.locale;
    expect(firstLocale).toBe('ja');

    // Simulate a language change between renders
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    });

    rerender();

    // Locale should remain 'ja' — determined once on mount
    expect(result.current.locale).toBe(firstLocale);
  });
});
