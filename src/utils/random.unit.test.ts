import { describe, it, expect } from 'vitest';
import { pickRandom, pickMultipleUnique } from './random';

describe('pickRandom', () => {
  it('should return an element from the array', () => {
    const array = [1, 2, 3, 4, 5];
    const result = pickRandom(array);
    expect(array).toContain(result);
  });

  it('should return the only element from a single-element array', () => {
    const result = pickRandom(['only']);
    expect(result).toBe('only');
  });

  it('should throw an error when array is empty', () => {
    expect(() => pickRandom([])).toThrow('Cannot pick from an empty array');
  });

  it('should not mutate the original array', () => {
    const array = [1, 2, 3];
    const copy = [...array];
    pickRandom(array);
    expect(array).toEqual(copy);
  });
});

describe('pickMultipleUnique', () => {
  it('should return the correct number of elements', () => {
    const array = [1, 2, 3, 4, 5];
    const result = pickMultipleUnique(array, 3);
    expect(result).toHaveLength(3);
  });

  it('should return unique elements (no duplicates)', () => {
    const array = [1, 2, 3, 4, 5];
    const result = pickMultipleUnique(array, 4);
    const unique = new Set(result);
    expect(unique.size).toBe(result.length);
  });

  it('should only return elements from the original array', () => {
    const array = ['a', 'b', 'c', 'd', 'e'];
    const result = pickMultipleUnique(array, 3);
    for (const item of result) {
      expect(array).toContain(item);
    }
  });

  it('should return all elements when count equals array length', () => {
    const array = [1, 2, 3];
    const result = pickMultipleUnique(array, 3);
    expect(result).toHaveLength(3);
    expect(new Set(result)).toEqual(new Set(array));
  });

  it('should return empty array when count is 0', () => {
    const result = pickMultipleUnique([1, 2, 3], 0);
    expect(result).toEqual([]);
  });

  it('should throw when count exceeds array length', () => {
    expect(() => pickMultipleUnique([1, 2], 3)).toThrow(
      'Cannot pick 3 unique elements from an array of length 2'
    );
  });

  it('should throw when array is empty and count is positive', () => {
    expect(() => pickMultipleUnique([], 1)).toThrow(
      'Cannot pick 1 unique elements from an array of length 0'
    );
  });

  it('should not mutate the original array', () => {
    const array = [1, 2, 3, 4, 5];
    const copy = [...array];
    pickMultipleUnique(array, 3);
    expect(array).toEqual(copy);
  });
});
