import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useWeaponGacha } from '../useWeaponGacha';
import { WEAPONS } from '../../data/weapons';

describe('useWeaponGacha', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const nonCarePackageWeapons = WEAPONS.filter((w) => !w.isCarePackage);

  it('initializes with all non-care-package weapons checked in all slots', () => {
    const { result } = renderHook(() => useWeaponGacha());

    expect(result.current.slot1Checks.size).toBe(nonCarePackageWeapons.length);
    expect(result.current.slot2Checks.size).toBe(nonCarePackageWeapons.length);
    expect(result.current.slot3Checks.size).toBe(nonCarePackageWeapons.length);

    for (const weapon of nonCarePackageWeapons) {
      expect(result.current.slot1Checks.get(weapon.id)).toBe(true);
      expect(result.current.slot2Checks.get(weapon.id)).toBe(true);
      expect(result.current.slot3Checks.get(weapon.id)).toBe(true);
    }
  });

  it('initializes carePackageFlags from static data', () => {
    const { result } = renderHook(() => useWeaponGacha());

    for (const weapon of WEAPONS) {
      expect(result.current.carePackageFlags.get(weapon.id)).toBe(weapon.isCarePackage);
    }
  });

  it('toggleWeapon flips the check state of a weapon in specified slot', () => {
    const { result } = renderHook(() => useWeaponGacha());

    act(() => {
      result.current.toggleWeapon(1, 'r-301');
    });

    expect(result.current.slot1Checks.get('r-301')).toBe(false);
    // Other slots unaffected
    expect(result.current.slot2Checks.get('r-301')).toBe(true);
    expect(result.current.slot3Checks.get('r-301')).toBe(true);
  });

  it('toggleCategory unchecks all category weapons when all are checked', () => {
    const { result } = renderHook(() => useWeaponGacha());

    act(() => {
      result.current.toggleCategory(1, 'Shotgun');
    });

    const shotguns = WEAPONS.filter((w) => w.category === 'Shotgun' && !w.isCarePackage);
    for (const weapon of shotguns) {
      expect(result.current.slot1Checks.get(weapon.id)).toBe(false);
    }

    // Non-shotguns remain checked
    const nonShotguns = nonCarePackageWeapons.filter((w) => w.category !== 'Shotgun');
    for (const weapon of nonShotguns) {
      expect(result.current.slot1Checks.get(weapon.id)).toBe(true);
    }
  });

  it('toggleCategory checks all category weapons when some are unchecked', () => {
    const { result } = renderHook(() => useWeaponGacha());

    // Uncheck one shotgun first
    act(() => {
      result.current.toggleWeapon(2, 'eva-8');
    });

    // Now toggle category should check all shotguns
    act(() => {
      result.current.toggleCategory(2, 'Shotgun');
    });

    const shotguns = WEAPONS.filter((w) => w.category === 'Shotgun' && !w.isCarePackage);
    for (const weapon of shotguns) {
      expect(result.current.slot2Checks.get(weapon.id)).toBe(true);
    }
  });

  it('toggleCarePackage to true removes weapon from all slots', () => {
    const { result } = renderHook(() => useWeaponGacha());

    // r-301 is not a care package weapon initially
    expect(result.current.slot1Checks.has('r-301')).toBe(true);

    act(() => {
      result.current.toggleCarePackage('r-301');
    });

    expect(result.current.carePackageFlags.get('r-301')).toBe(true);
    expect(result.current.slot1Checks.has('r-301')).toBe(false);
    expect(result.current.slot2Checks.has('r-301')).toBe(false);
    expect(result.current.slot3Checks.has('r-301')).toBe(false);
  });

  it('toggleCarePackage to false adds weapon to all slots unchecked', () => {
    const { result } = renderHook(() => useWeaponGacha());

    // Kraber starts as care package
    expect(result.current.carePackageFlags.get('kraber')).toBe(true);

    act(() => {
      result.current.toggleCarePackage('kraber');
    });

    expect(result.current.carePackageFlags.get('kraber')).toBe(false);
    expect(result.current.slot1Checks.get('kraber')).toBe(false);
    expect(result.current.slot2Checks.get('kraber')).toBe(false);
    expect(result.current.slot3Checks.get('kraber')).toBe(false);
  });

  it('executeSlotGacha returns a weapon from the slot lineup', () => {
    const { result } = renderHook(() => useWeaponGacha());

    act(() => {
      result.current.executeSlotGacha(1);
    });

    expect(result.current.slot1Result).not.toBeNull();
    expect(result.current.error).toBeNull();
    expect(nonCarePackageWeapons.some((w) => w.id === result.current.slot1Result!.id)).toBe(true);
  });

  it('executeSlotGacha returns error when slot lineup is empty', () => {
    const { result } = renderHook(() => useWeaponGacha());

    // Uncheck all weapons in slot 1 using setSlot1Checks
    act(() => {
      const emptyChecks = new Map<string, boolean>();
      for (const weapon of nonCarePackageWeapons) {
        emptyChecks.set(weapon.id, false);
      }
      result.current.setSlot1Checks(emptyChecks);
    });

    act(() => {
      result.current.executeSlotGacha(1);
    });

    expect(result.current.slot1Result).toBeNull();
    expect(result.current.error).toBe('スロット1に最低1丁の武器を選択してください');
  });

  it('executeAllSlotsGacha returns weapons for both slots', () => {
    const { result } = renderHook(() => useWeaponGacha());

    act(() => {
      result.current.executeAllSlotsGacha();
    });

    expect(result.current.slot1Result).not.toBeNull();
    expect(result.current.slot2Result).not.toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('executeAllSlotsGacha returns error when slot1 is empty', () => {
    const { result } = renderHook(() => useWeaponGacha());

    // Uncheck all in slot 1 using setSlot1Checks
    act(() => {
      const emptyChecks = new Map<string, boolean>();
      for (const weapon of nonCarePackageWeapons) {
        emptyChecks.set(weapon.id, false);
      }
      result.current.setSlot1Checks(emptyChecks);
    });

    act(() => {
      result.current.executeAllSlotsGacha();
    });

    expect(result.current.slot1Result).toBeNull();
    expect(result.current.slot2Result).toBeNull();
    expect(result.current.error).toBe('スロット1に最低1丁の武器を選択してください');
  });

  it('executeSlotGacha does not affect other slot results', () => {
    const { result } = renderHook(() => useWeaponGacha());

    // Execute all first
    act(() => {
      result.current.executeAllSlotsGacha();
    });

    const originalSlot2 = result.current.slot2Result;

    // Re-roll slot 1 only
    act(() => {
      result.current.executeSlotGacha(1);
    });

    expect(result.current.slot2Result).toEqual(originalSlot2);
  });

  it('setSlot1Checks updates slot1 checks directly', () => {
    const { result } = renderHook(() => useWeaponGacha());

    const newChecks = new Map<string, boolean>();
    newChecks.set('r-301', true);
    newChecks.set('flatline', false);

    act(() => {
      result.current.setSlot1Checks(newChecks);
    });

    expect(result.current.slot1Checks.get('r-301')).toBe(true);
    expect(result.current.slot1Checks.get('flatline')).toBe(false);
  });
});
