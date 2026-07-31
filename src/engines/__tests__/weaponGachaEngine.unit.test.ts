import { describe, it, expect } from 'vitest';
import {
  pickWeapon,
  pickAllSlots,
  getEffectiveWeaponLineup,
  validateWeaponGacha,
} from '../weaponGachaEngine';
import { Weapon } from '../../types';

// Test fixtures
const makeWeapon = (id: string, opts?: Partial<Weapon>): Weapon => ({
  id,
  name: opts?.name ?? id,
  category: opts?.category ?? 'AR',
  ammoTypes: opts?.ammoTypes ?? ['Heavy'],
  imagePath: opts?.imagePath ?? `/images/weapons/${id}.png`,
  isCarePackage: opts?.isCarePackage ?? false,
});

const weapons: Weapon[] = [
  makeWeapon('r-301', { name: 'R-301', category: 'AR', ammoTypes: ['Light'] }),
  makeWeapon('flatline', { name: 'フラットライン', category: 'AR', ammoTypes: ['Heavy'] }),
  makeWeapon('eva-8', { name: 'EVA-8オート', category: 'Shotgun', ammoTypes: ['Shotgun'] }),
  makeWeapon('car', { name: 'C.A.R.', category: 'SMG', ammoTypes: ['Light', 'Heavy'] }),
  makeWeapon('kraber', { name: 'クレーバー', category: 'Sniper', ammoTypes: ['Sniper'], isCarePackage: true }),
];

describe('weaponGachaEngine', () => {
  describe('pickWeapon', () => {
    it('should return a weapon from the lineup', () => {
      const result = pickWeapon(weapons);
      expect(weapons).toContain(result);
    });

    it('should return the only weapon when lineup has one entry', () => {
      const single = [makeWeapon('solo')];
      expect(pickWeapon(single)).toBe(single[0]);
    });

    it('should throw when lineup is empty', () => {
      expect(() => pickWeapon([])).toThrow();
    });
  });

  describe('pickAllSlots', () => {
    it('should return a tuple of two weapons', () => {
      const [slot1, slot2] = pickAllSlots(weapons, weapons);
      expect(weapons).toContain(slot1);
      expect(weapons).toContain(slot2);
    });

    it('should allow the same weapon in both slots', () => {
      const single = [makeWeapon('only-one')];
      const [slot1, slot2] = pickAllSlots(single, single);
      expect(slot1.id).toBe('only-one');
      expect(slot2.id).toBe('only-one');
    });

    it('should throw when slot1 lineup is empty', () => {
      expect(() => pickAllSlots([], weapons)).toThrow();
    });

    it('should throw when slot2 lineup is empty', () => {
      expect(() => pickAllSlots(weapons, [])).toThrow();
    });
  });

  describe('getEffectiveWeaponLineup', () => {
    it('should return weapons that are checked and not care package', () => {
      const slotChecks = new Map([
        ['r-301', true],
        ['flatline', true],
        ['eva-8', false],
        ['car', true],
        ['kraber', true],
      ]);
      const carePackageFlags = new Map([
        ['r-301', false],
        ['flatline', false],
        ['eva-8', false],
        ['car', false],
        ['kraber', true],
      ]);

      const result = getEffectiveWeaponLineup(slotChecks, carePackageFlags, weapons);

      expect(result.map((w) => w.id)).toEqual(
        expect.arrayContaining(['r-301', 'flatline', 'car'])
      );
      expect(result).toHaveLength(3);
      // kraber is excluded (care package), eva-8 is excluded (unchecked)
      expect(result.find((w) => w.id === 'kraber')).toBeUndefined();
      expect(result.find((w) => w.id === 'eva-8')).toBeUndefined();
    });

    it('should exclude care package weapons even if checked', () => {
      const slotChecks = new Map([['kraber', true]]);
      const carePackageFlags = new Map([['kraber', true]]);

      const result = getEffectiveWeaponLineup(slotChecks, carePackageFlags, weapons);
      expect(result.find((w) => w.id === 'kraber')).toBeUndefined();
    });

    it('should return empty array when no weapons are checked', () => {
      const slotChecks = new Map(weapons.map((w) => [w.id, false]));
      const carePackageFlags = new Map(weapons.map((w) => [w.id, false]));

      const result = getEffectiveWeaponLineup(slotChecks, carePackageFlags, weapons);
      expect(result).toHaveLength(0);
    });

    it('should return all non-care-package weapons when all are checked', () => {
      const slotChecks = new Map(weapons.map((w) => [w.id, true]));
      const carePackageFlags = new Map(weapons.map((w) => [w.id, w.isCarePackage]));

      const result = getEffectiveWeaponLineup(slotChecks, carePackageFlags, weapons);
      // kraber is care package, so 4 weapons should be returned
      expect(result).toHaveLength(4);
      expect(result.every((w) => w.id !== 'kraber')).toBe(true);
    });

    it('should handle weapons not present in the checks map', () => {
      // Weapon not in slotChecks should not appear (get returns undefined, not true)
      const slotChecks = new Map<string, boolean>();
      const carePackageFlags = new Map<string, boolean>();

      const result = getEffectiveWeaponLineup(slotChecks, carePackageFlags, weapons);
      expect(result).toHaveLength(0);
    });
  });

  describe('validateWeaponGacha', () => {
    it('should return valid: true when both slots have weapons', () => {
      expect(validateWeaponGacha(weapons, weapons)).toEqual({ valid: true });
    });

    it('should return SLOT1_EMPTY when slot 1 lineup is empty', () => {
      expect(validateWeaponGacha([], weapons)).toEqual({
        valid: false,
        error: 'SLOT1_EMPTY',
      });
    });

    it('should return SLOT2_EMPTY when slot 2 lineup is empty', () => {
      expect(validateWeaponGacha(weapons, [])).toEqual({
        valid: false,
        error: 'SLOT2_EMPTY',
      });
    });

    it('should prioritize SLOT1_EMPTY when both slots are empty', () => {
      expect(validateWeaponGacha([], [])).toEqual({
        valid: false,
        error: 'SLOT1_EMPTY',
      });
    });
  });
});
