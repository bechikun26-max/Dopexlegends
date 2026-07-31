import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRuleRoulette } from './useRuleRoulette';
import { LEGENDS } from '../data/legends';
import { WEAPONS } from '../data/weapons';
import { RULES } from '../data/rules';
import * as rouletteEngine from '../engines/rouletteEngine';

/** Create a default all-true checks map for legends */
function createLegendChecks(allChecked = true): Map<string, boolean> {
  return new Map(LEGENDS.map((l) => [l.id, allChecked]));
}

/** Create a default all-true checks map for weapon slot 1 */
function createWeaponSlot1Checks(allChecked = true): Map<string, boolean> {
  return new Map(WEAPONS.map((w) => [w.id, allChecked]));
}

describe('useRuleRoulette', () => {
  let setLegendChecks: ReturnType<typeof vi.fn>;
  let setWeaponSlot1Checks: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setLegendChecks = vi.fn();
    setWeaponSlot1Checks = vi.fn();
    vi.restoreAllMocks();
  });

  it('should initialize with null result and isApplied=false', () => {
    const { result } = renderHook(() =>
      useRuleRoulette({ setLegendChecks, setWeaponSlot1Checks })
    );

    expect(result.current.currentResult).toBeNull();
    expect(result.current.isApplied).toBe(false);
  });

  it('should spin roulette and set currentResult and isApplied=true', () => {
    const { result } = renderHook(() =>
      useRuleRoulette({ setLegendChecks, setWeaponSlot1Checks })
    );

    act(() => {
      result.current.spinRoulette(createLegendChecks(), createWeaponSlot1Checks());
    });

    expect(result.current.currentResult).not.toBeNull();
    expect(RULES).toContainEqual(result.current.currentResult);
    expect(result.current.isApplied).toBe(true);
    // Should have called at least one setter
    expect(setLegendChecks.mock.calls.length + setWeaponSlot1Checks.mock.calls.length).toBeGreaterThan(0);
  });

  it('should apply legend class rule to legendChecks only', () => {
    const assaultRule = RULES.find((r) => r.id === 'assault-only')!;
    vi.spyOn(rouletteEngine, 'spin').mockReturnValue(assaultRule);

    const { result } = renderHook(() =>
      useRuleRoulette({ setLegendChecks, setWeaponSlot1Checks })
    );

    act(() => {
      result.current.spinRoulette(createLegendChecks(), createWeaponSlot1Checks());
    });

    expect(result.current.currentResult).toEqual(assaultRule);
    expect(setLegendChecks).toHaveBeenCalled();
    // LegendClass rules don't modify weapon slot 1
    expect(setWeaponSlot1Checks).not.toHaveBeenCalled();

    // Verify the legendChecks map - only Assault class should be checked
    const appliedChecks: Map<string, boolean> = setLegendChecks.mock.calls[0][0];
    for (const [id, checked] of appliedChecks) {
      const legend = LEGENDS.find((l) => l.id === id)!;
      if (legend.class === 'Assault') {
        expect(checked).toBe(true);
      } else {
        expect(checked).toBe(false);
      }
    }
  });

  it('should apply weapon category rule to weaponSlot1Checks only', () => {
    const shotgunRule = RULES.find((r) => r.id === 'shotgun-required')!;
    vi.spyOn(rouletteEngine, 'spin').mockReturnValue(shotgunRule);

    const { result } = renderHook(() =>
      useRuleRoulette({ setLegendChecks, setWeaponSlot1Checks })
    );

    act(() => {
      result.current.spinRoulette(createLegendChecks(), createWeaponSlot1Checks());
    });

    expect(result.current.currentResult).toEqual(shotgunRule);
    expect(setWeaponSlot1Checks).toHaveBeenCalled();
    // WeaponCategory rules don't modify legend checks
    expect(setLegendChecks).not.toHaveBeenCalled();

    // Verify only shotgun weapons are checked
    const appliedChecks: Map<string, boolean> = setWeaponSlot1Checks.mock.calls[0][0];
    for (const [id, checked] of appliedChecks) {
      const weapon = WEAPONS.find((w) => w.id === id)!;
      if (weapon.category === 'Shotgun') {
        expect(checked).toBe(true);
      } else {
        expect(checked).toBe(false);
      }
    }
  });

  it('should reset roulette: restore snapshot and clear result', () => {
    const assaultRule = RULES.find((r) => r.id === 'assault-only')!;
    vi.spyOn(rouletteEngine, 'spin').mockReturnValue(assaultRule);

    const { result } = renderHook(() =>
      useRuleRoulette({ setLegendChecks, setWeaponSlot1Checks })
    );

    const initialLegendChecks = createLegendChecks();
    const initialWeaponSlot1Checks = createWeaponSlot1Checks();

    // Spin first
    act(() => {
      result.current.spinRoulette(initialLegendChecks, initialWeaponSlot1Checks);
    });

    expect(result.current.currentResult).not.toBeNull();
    setLegendChecks.mockClear();
    setWeaponSlot1Checks.mockClear();

    // Reset
    act(() => {
      result.current.resetRoulette();
    });

    expect(result.current.currentResult).toBeNull();
    expect(result.current.isApplied).toBe(false);
    // Should restore legend checks to initial state
    expect(setLegendChecks).toHaveBeenCalled();
    expect(setWeaponSlot1Checks).toHaveBeenCalled();

    // Verify restored checks match the snapshot (all true)
    const restoredLegend: Map<string, boolean> = setLegendChecks.mock.calls[0][0];
    for (const [, checked] of restoredLegend) {
      expect(checked).toBe(true);
    }
    const restoredWeapon: Map<string, boolean> = setWeaponSlot1Checks.mock.calls[0][0];
    for (const [, checked] of restoredWeapon) {
      expect(checked).toBe(true);
    }
  });

  it('should toggle off: restore snapshot but keep result (Req 11.4)', () => {
    const assaultRule = RULES.find((r) => r.id === 'assault-only')!;
    vi.spyOn(rouletteEngine, 'spin').mockReturnValue(assaultRule);

    const { result } = renderHook(() =>
      useRuleRoulette({ setLegendChecks, setWeaponSlot1Checks })
    );

    const initialLegendChecks = createLegendChecks();
    const initialWeaponSlot1Checks = createWeaponSlot1Checks();

    // Spin first
    act(() => {
      result.current.spinRoulette(initialLegendChecks, initialWeaponSlot1Checks);
    });

    setLegendChecks.mockClear();
    setWeaponSlot1Checks.mockClear();

    // Toggle off
    act(() => {
      result.current.toggleApply(false);
    });

    // Result should be kept
    expect(result.current.currentResult).toEqual(assaultRule);
    expect(result.current.isApplied).toBe(false);
    // Legend checks should be restored to snapshot (all true)
    expect(setLegendChecks).toHaveBeenCalled();
    const restoredChecks: Map<string, boolean> = setLegendChecks.mock.calls[0][0];
    for (const [, checked] of restoredChecks) {
      expect(checked).toBe(true);
    }
  });

  it('should toggle on: re-apply auto-filter from current result (Req 11.5)', () => {
    const assaultRule = RULES.find((r) => r.id === 'assault-only')!;
    vi.spyOn(rouletteEngine, 'spin').mockReturnValue(assaultRule);

    const { result } = renderHook(() =>
      useRuleRoulette({ setLegendChecks, setWeaponSlot1Checks })
    );

    // Spin
    act(() => {
      result.current.spinRoulette(createLegendChecks(), createWeaponSlot1Checks());
    });

    // Toggle off
    act(() => {
      result.current.toggleApply(false);
    });

    setLegendChecks.mockClear();
    setWeaponSlot1Checks.mockClear();

    // Toggle on
    act(() => {
      result.current.toggleApply(true);
    });

    expect(result.current.isApplied).toBe(true);
    // Legend checks should be re-applied (only assault class checked)
    expect(setLegendChecks).toHaveBeenCalled();
    const reAppliedChecks: Map<string, boolean> = setLegendChecks.mock.calls[0][0];
    for (const [id, checked] of reAppliedChecks) {
      const legend = LEGENDS.find((l) => l.id === id)!;
      if (legend.class === 'Assault') {
        expect(checked).toBe(true);
      } else {
        expect(checked).toBe(false);
      }
    }
  });

  it('should ignore reset when no result exists (Req 11.6)', () => {
    const { result } = renderHook(() =>
      useRuleRoulette({ setLegendChecks, setWeaponSlot1Checks })
    );

    // Reset with no result - should be no-op
    act(() => {
      result.current.resetRoulette();
    });

    expect(setLegendChecks).not.toHaveBeenCalled();
    expect(setWeaponSlot1Checks).not.toHaveBeenCalled();
  });

  it('should ignore toggleApply when no result exists (Req 11.6)', () => {
    const { result } = renderHook(() =>
      useRuleRoulette({ setLegendChecks, setWeaponSlot1Checks })
    );

    // Toggle with no result - should be no-op
    act(() => {
      result.current.toggleApply(true);
    });

    expect(setLegendChecks).not.toHaveBeenCalled();
    expect(setWeaponSlot1Checks).not.toHaveBeenCalled();
  });

  it('should re-spin: save new snapshot from current state (Req 9.4)', () => {
    const assaultRule = RULES.find((r) => r.id === 'assault-only')!;
    const shotgunRule = RULES.find((r) => r.id === 'shotgun-required')!;

    // First spin: assault rule
    vi.spyOn(rouletteEngine, 'spin').mockReturnValue(assaultRule);

    const { result } = renderHook(() =>
      useRuleRoulette({ setLegendChecks, setWeaponSlot1Checks })
    );

    act(() => {
      result.current.spinRoulette(createLegendChecks(), createWeaponSlot1Checks());
    });

    expect(result.current.currentResult).toEqual(assaultRule);

    // Second spin with different checks - simulates user having modified state
    vi.spyOn(rouletteEngine, 'spin').mockReturnValue(shotgunRule);
    const partialLegendChecks = createLegendChecks(false);
    partialLegendChecks.set('bangalore', true);
    const partialWeaponSlot1Checks = createWeaponSlot1Checks(false);
    partialWeaponSlot1Checks.set('eva-8', true);

    setLegendChecks.mockClear();
    setWeaponSlot1Checks.mockClear();

    act(() => {
      result.current.spinRoulette(partialLegendChecks, partialWeaponSlot1Checks);
    });

    expect(result.current.currentResult).toEqual(shotgunRule);

    // Reset should restore to the second spin's snapshot (partial checks)
    setLegendChecks.mockClear();
    setWeaponSlot1Checks.mockClear();

    act(() => {
      result.current.resetRoulette();
    });

    const restoredLegend: Map<string, boolean> = setLegendChecks.mock.calls[0][0];
    expect(restoredLegend.get('bangalore')).toBe(true);
    // Other legends should be false (from the partial state we passed as current)
    expect(restoredLegend.get('wraith')).toBe(false);

    const restoredWeapon: Map<string, boolean> = setWeaponSlot1Checks.mock.calls[0][0];
    expect(restoredWeapon.get('eva-8')).toBe(true);
    expect(restoredWeapon.get('r-301')).toBe(false);
  });

  it('should handle ammo type rule applying to weapon slot 1', () => {
    const lightAmmoRule = RULES.find((r) => r.id === 'light-ammo')!;
    vi.spyOn(rouletteEngine, 'spin').mockReturnValue(lightAmmoRule);

    const { result } = renderHook(() =>
      useRuleRoulette({ setLegendChecks, setWeaponSlot1Checks })
    );

    act(() => {
      result.current.spinRoulette(createLegendChecks(), createWeaponSlot1Checks());
    });

    expect(result.current.currentResult).toEqual(lightAmmoRule);
    expect(setWeaponSlot1Checks).toHaveBeenCalled();
    // AmmoType rules don't modify legend checks
    expect(setLegendChecks).not.toHaveBeenCalled();

    // Verify: C.A.R. should be checked (has Light in ammoTypes)
    const appliedChecks: Map<string, boolean> = setWeaponSlot1Checks.mock.calls[0][0];
    expect(appliedChecks.get('car')).toBe(true);
    // R-301 has Light ammo
    expect(appliedChecks.get('r-301')).toBe(true);
    // Flatline has Heavy ammo, should be false
    expect(appliedChecks.get('flatline')).toBe(false);
  });
});
