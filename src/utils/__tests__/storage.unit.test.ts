import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveState, loadState, clearState, mapToRecord, recordToMap } from '../storage';

describe('storage utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('mapToRecord', () => {
    it('converts an empty Map to an empty Record', () => {
      const map = new Map<string, boolean>();
      expect(mapToRecord(map)).toEqual({});
    });

    it('converts a Map with entries to a Record', () => {
      const map = new Map<string, boolean>([
        ['a', true],
        ['b', false],
        ['c', true],
      ]);
      expect(mapToRecord(map)).toEqual({ a: true, b: false, c: true });
    });
  });

  describe('recordToMap', () => {
    it('converts an empty Record to an empty Map', () => {
      const result = recordToMap<boolean>({});
      expect(result.size).toBe(0);
    });

    it('converts a Record to a Map with correct entries', () => {
      const result = recordToMap({ x: 1, y: 2, z: 3 });
      expect(result.size).toBe(3);
      expect(result.get('x')).toBe(1);
      expect(result.get('y')).toBe(2);
      expect(result.get('z')).toBe(3);
    });
  });

  describe('saveState', () => {
    it('saves serialized state to localStorage', () => {
      saveState('test-key', { foo: 'bar' });
      expect(localStorage.getItem('test-key')).toBe('{"foo":"bar"}');
    });

    it('saves primitive values', () => {
      saveState('num', 42);
      expect(localStorage.getItem('num')).toBe('42');
    });

    it('logs console.warn on write failure', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      // Simulate storage full by mocking setItem to throw
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });

      saveState('key', { data: 'value' });
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to save state for key "key"'),
        expect.any(DOMException)
      );
    });
  });

  describe('loadState', () => {
    it('loads and parses stored state', () => {
      localStorage.setItem('data', JSON.stringify({ count: 5 }));
      const result = loadState<{ count: number }>('data');
      expect(result).toEqual({ count: 5 });
    });

    it('returns null for non-existent key', () => {
      const result = loadState('non-existent');
      expect(result).toBeNull();
    });

    it('returns null and warns on parse failure', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem('bad-json', '{invalid json}');

      const result = loadState('bad-json');
      expect(result).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to load state for key "bad-json"'),
        expect.any(SyntaxError)
      );
    });
  });

  describe('clearState', () => {
    it('removes the key from localStorage', () => {
      localStorage.setItem('to-remove', '"hello"');
      clearState('to-remove');
      expect(localStorage.getItem('to-remove')).toBeNull();
    });

    it('does not throw for non-existent key', () => {
      expect(() => clearState('non-existent')).not.toThrow();
    });
  });

  describe('Map round-trip via storage', () => {
    it('can save and load a Map via Record conversion', () => {
      const original = new Map<string, boolean>([
        ['legend-1', true],
        ['legend-2', false],
        ['legend-3', true],
      ]);

      saveState('lineup', mapToRecord(original));
      const loaded = loadState<Record<string, boolean>>('lineup');
      expect(loaded).not.toBeNull();

      const restored = recordToMap(loaded!);
      expect(restored).toEqual(original);
    });
  });
});
