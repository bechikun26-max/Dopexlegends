import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import en from '../locales/en.json';
import ja from '../locales/ja.json';
import { LEGENDS } from '../../data/legends';
import { WEAPONS } from '../../data/weapons';
import { RULES } from '../../data/rules';

// Game enum values matching the type definitions
const WEAPON_CATEGORIES = ['Shotgun', 'SMG', 'Pistol', 'AR', 'LMG', 'Marksman', 'Sniper'] as const;
const AMMO_TYPES = ['Shotgun', 'Light', 'Heavy', 'Energy', 'Sniper', 'Arrow'] as const;
const LEGEND_CLASSES = ['Assault', 'Skirmisher', 'Recon', 'Support', 'Controller'] as const;

const enKeys = Object.keys(en);
const jaKeys = Object.keys(ja);

/**
 * Property 2: Translation Key Format
 * All keys in en.json and ja.json match the dot-notation pattern.
 *
 * **Validates: Requirements 2.3**
 */
describe('Property 2: Translation Key Format', () => {
  const keyPattern = /^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z0-9-]+)+$/;

  it('every key in en.json matches dot-notation pattern', () => {
    fc.assert(
      fc.property(fc.constantFrom(...enKeys), (key) => {
        expect(key).toMatch(keyPattern);
      }),
      { numRuns: Math.max(100, enKeys.length) }
    );
  });

  it('every key in ja.json matches dot-notation pattern', () => {
    fc.assert(
      fc.property(fc.constantFrom(...jaKeys), (key) => {
        expect(key).toMatch(keyPattern);
      }),
      { numRuns: Math.max(100, jaKeys.length) }
    );
  });
});

/**
 * Property 3: Translation File Symmetry
 * en.json and ja.json have identical key sets.
 *
 * **Validates: Requirements 2.4**
 */
describe('Property 3: Translation File Symmetry', () => {
  it('en.json and ja.json have identical key sets', () => {
    const enKeySet = new Set(enKeys);
    const jaKeySet = new Set(jaKeys);

    // Every en key exists in ja
    fc.assert(
      fc.property(fc.constantFrom(...enKeys), (key) => {
        expect(jaKeySet.has(key)).toBe(true);
      }),
      { numRuns: Math.max(100, enKeys.length) }
    );

    // Every ja key exists in en
    fc.assert(
      fc.property(fc.constantFrom(...jaKeys), (key) => {
        expect(enKeySet.has(key)).toBe(true);
      }),
      { numRuns: Math.max(100, jaKeys.length) }
    );
  });

  it('both files have the same number of keys', () => {
    expect(enKeys.length).toBe(jaKeys.length);
  });
});

/**
 * Property 7: Game Data Name Coverage
 * Every legend id, weapon id, and rule id has a corresponding non-empty translation in both files.
 *
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6**
 */
describe('Property 7: Game Data Name Coverage', () => {
  const enDict = en as Record<string, string>;
  const jaDict = ja as Record<string, string>;

  const legendIds = LEGENDS.map((l) => l.id);
  const weaponIds = WEAPONS.map((w) => w.id);
  const ruleIds = RULES.map((r) => r.id);

  it('every legend id has a non-empty translation in en.json', () => {
    fc.assert(
      fc.property(fc.constantFrom(...legendIds), (id) => {
        const key = `legends.${id}`;
        expect(enDict[key]).toBeDefined();
        expect(enDict[key].length).toBeGreaterThan(0);
      }),
      { numRuns: Math.max(100, legendIds.length) }
    );
  });

  it('every legend id has a non-empty translation in ja.json', () => {
    fc.assert(
      fc.property(fc.constantFrom(...legendIds), (id) => {
        const key = `legends.${id}`;
        expect(jaDict[key]).toBeDefined();
        expect(jaDict[key].length).toBeGreaterThan(0);
      }),
      { numRuns: Math.max(100, legendIds.length) }
    );
  });

  it('every weapon id has a non-empty translation in en.json', () => {
    fc.assert(
      fc.property(fc.constantFrom(...weaponIds), (id) => {
        const key = `weapons.${id}`;
        expect(enDict[key]).toBeDefined();
        expect(enDict[key].length).toBeGreaterThan(0);
      }),
      { numRuns: Math.max(100, weaponIds.length) }
    );
  });

  it('every weapon id has a non-empty translation in ja.json', () => {
    fc.assert(
      fc.property(fc.constantFrom(...weaponIds), (id) => {
        const key = `weapons.${id}`;
        expect(jaDict[key]).toBeDefined();
        expect(jaDict[key].length).toBeGreaterThan(0);
      }),
      { numRuns: Math.max(100, weaponIds.length) }
    );
  });

  it('every rule id has a non-empty translation in en.json', () => {
    fc.assert(
      fc.property(fc.constantFrom(...ruleIds), (id) => {
        const key = `rules.${id}`;
        expect(enDict[key]).toBeDefined();
        expect(enDict[key].length).toBeGreaterThan(0);
      }),
      { numRuns: Math.max(100, ruleIds.length) }
    );
  });

  it('every rule id has a non-empty translation in ja.json', () => {
    fc.assert(
      fc.property(fc.constantFrom(...ruleIds), (id) => {
        const key = `rules.${id}`;
        expect(jaDict[key]).toBeDefined();
        expect(jaDict[key].length).toBeGreaterThan(0);
      }),
      { numRuns: Math.max(100, ruleIds.length) }
    );
  });
});

/**
 * Property 8: Game Enum Coverage
 * Every WeaponCategory, AmmoType, and LegendClass value has a corresponding non-empty translation in both files.
 *
 * **Validates: Requirements 5.7, 5.8**
 */
describe('Property 8: Game Enum Coverage', () => {
  const enDict = en as Record<string, string>;
  const jaDict = ja as Record<string, string>;

  it('every WeaponCategory has a non-empty translation in en.json', () => {
    fc.assert(
      fc.property(fc.constantFrom(...WEAPON_CATEGORIES), (category) => {
        const key = `categories.${category}`;
        expect(enDict[key]).toBeDefined();
        expect(enDict[key].length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('every WeaponCategory has a non-empty translation in ja.json', () => {
    fc.assert(
      fc.property(fc.constantFrom(...WEAPON_CATEGORIES), (category) => {
        const key = `categories.${category}`;
        expect(jaDict[key]).toBeDefined();
        expect(jaDict[key].length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('every AmmoType has a non-empty translation in en.json', () => {
    fc.assert(
      fc.property(fc.constantFrom(...AMMO_TYPES), (ammoType) => {
        const key = `ammoTypes.${ammoType}`;
        expect(enDict[key]).toBeDefined();
        expect(enDict[key].length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('every AmmoType has a non-empty translation in ja.json', () => {
    fc.assert(
      fc.property(fc.constantFrom(...AMMO_TYPES), (ammoType) => {
        const key = `ammoTypes.${ammoType}`;
        expect(jaDict[key]).toBeDefined();
        expect(jaDict[key].length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('every LegendClass has a non-empty translation in en.json', () => {
    fc.assert(
      fc.property(fc.constantFrom(...LEGEND_CLASSES), (legendClass) => {
        const key = `classes.${legendClass}`;
        expect(enDict[key]).toBeDefined();
        expect(enDict[key].length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('every LegendClass has a non-empty translation in ja.json', () => {
    fc.assert(
      fc.property(fc.constantFrom(...LEGEND_CLASSES), (legendClass) => {
        const key = `classes.${legendClass}`;
        expect(jaDict[key]).toBeDefined();
        expect(jaDict[key].length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });
});
