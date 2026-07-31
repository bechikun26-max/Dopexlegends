import { useState, useCallback } from 'react';
import { saveState, loadState } from '../utils/storage';

/**
 * A generic hook for persisting state to localStorage.
 * Automatically saves state changes and restores on mount.
 *
 * Note: For Map types, callers should convert to/from Records using
 * mapToRecord/recordToMap from utils/storage before passing to this hook,
 * since JSON.stringify cannot handle Map objects directly.
 *
 * @param key - localStorage key
 * @param initialValue - Default value if nothing is stored
 * @returns [value, setValue] tuple similar to useState
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const saved = loadState<T>(key);
    return saved !== null ? saved : initialValue;
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const newValue = value instanceof Function ? value(prev) : value;
      saveState(key, newValue);
      return newValue;
    });
  }, [key]);

  return [storedValue, setValue];
}
