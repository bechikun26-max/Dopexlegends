/**
 * Random utility module for gacha operations.
 * Provides uniform distribution random selection functions.
 */

/**
 * Pick a single random element from an array with uniform distribution.
 * @throws Error if the array is empty
 */
export function pickRandom<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('Cannot pick from an empty array');
  }
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

/**
 * Pick multiple unique elements from an array without replacement.
 * Uses Fisher-Yates shuffle on a copy to ensure uniform distribution.
 * @throws Error if the array has fewer elements than the requested count
 */
export function pickMultipleUnique<T>(array: T[], count: number): T[] {
  if (array.length < count) {
    throw new Error(
      `Cannot pick ${count} unique elements from an array of length ${array.length}`
    );
  }
  if (count <= 0) {
    return [];
  }

  // Create a shallow copy to avoid mutating the original
  const copy = [...array];

  // Fisher-Yates shuffle (partial - only need first `count` elements)
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i));
    // Swap elements at positions i and j
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }

  return copy.slice(0, count);
}
