/**
 * localStorage utility module
 * Handles serialization/deserialization with Map ↔ Record conversion
 * and error handling with graceful fallbacks.
 */

/**
 * Convert a Map<string, V> to a plain Record<string, V> for JSON serialization.
 */
export function mapToRecord<V>(map: Map<string, V>): Record<string, V> {
  const record: Record<string, V> = {};
  for (const [key, value] of map) {
    record[key] = value;
  }
  return record;
}

/**
 * Convert a plain Record<string, V> back to a Map<string, V> after deserialization.
 */
export function recordToMap<V>(record: Record<string, V>): Map<string, V> {
  return new Map(Object.entries(record));
}

/**
 * Save state to localStorage under the given key.
 * Serializes the state to JSON. On write failure, logs a warning via console.warn.
 */
export function saveState(key: string, state: unknown): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.warn(`[storage] Failed to save state for key "${key}":`, error);
  }
}

/**
 * Load state from localStorage for the given key.
 * Parses JSON and returns the typed result. Returns null on failure with console.warn.
 */
export function loadState<T>(key: string): T | null {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.warn(`[storage] Failed to load state for key "${key}":`, error);
    return null;
  }
}

/**
 * Remove the given key from localStorage.
 */
export function clearState(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storage] Failed to clear state for key "${key}":`, error);
  }
}
