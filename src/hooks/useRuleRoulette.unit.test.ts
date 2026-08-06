import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRuleRoulette } from './useRuleRoulette';
import { LEGENDS } from '../data/legends';
import { WEAPONS } from '../data/weapons';
import { LEGEND_CLASS_RULES, WEAPON_CATEGORY_RULES, AMMO_TYPE_RULES } from '../data/rules';
import * as rouletteEngine from '../engines/rouletteEngine';

/** Create a default all-true checks map for legends */
function createLegendChecks(allChecked = true): Map<string, boolean> {
  return new Map(LEGENDS.map((l) => [l.id, allChecked]));
}

/** Create a default all-true checks map for weapons */
function createWeaponChecks(allChecked = true): Map<string, boolean> {
  return new Map(WEAPONS.map((w) => [w.id, allChecked]));
}

describe('useRuleRoulette (3 independent slots)', () => {
  let setLegendChecks: ReturnType<typeof vi.fn>;
  let setWeaponSlot1Checks: ReturnType<typeof vi.fn>;
  let setWeaponSlot2Checks: ReturnType<typeof vi.fn>;

  const defaultParams = () => ({
    legendChecks: createLegendChecks(),
    weaponSlot1Checks: createWeaponChecks(),
    weaponSlot2Checks: createWeaponChecks(),
    setLegendChecks,
    setWeaponSlot1Checks,
    setWeaponSlot2Checks,
  });

  beforeEach(() => {
    setLegendChecks = vi.fn();
    setWeaponSlot1Checks = vi.fn();
    setWeaponSlot2Checks = vi.fn();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should initialize all 3 slots with null result, isApplied=false, enabled=true', () => {
      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      expect(result.current.legendClassSlot.currentResult).toBeNull();
      expect(result.current.legendClassSlot.isApplied).toBe(false);
      expect(result.current.legendClassSlot.enabled).toBe(true);

      expect(result.current.weaponCategorySlot.currentResult).toBeNull();
      expect(result.current.weaponCategorySlot.isApplied).toBe(false);
      expect(result.current.weaponCategorySlot.enabled).toBe(true);

      expect(result.current.ammoTypeSlot.currentResult).toBeNull();
      expect(result.current.ammoTypeSlot.isApplied).toBe(false);
      expect(result.current.ammoTypeSlot.enabled).toBe(true);
    });

    it('should provide correct titles', () => {
      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      expect(result.current.legendClassSlot.title).toBe('roulette.legendClassSlot');
      expect(result.current.weaponCategorySlot.title).toBe('roulette.weaponCategorySlot');
      expect(result.current.ammoTypeSlot.title).toBe('roulette.ammoTypeSlot');
    });

    it('should provide correct rule sets', () => {
      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      expect(result.current.legendClassSlot.rules).toEqual(LEGEND_CLASS_RULES);
      expect(result.current.weaponCategorySlot.rules).toEqual(WEAPON_CATEGORY_RULES);
      expect(result.current.ammoTypeSlot.rules).toEqual(AMMO_TYPE_RULES);
    });
  });

  describe('legendClassSlot', () => {
    it('should spin and apply legend class rule to legendChecks only', () => {
      const assaultRule = LEGEND_CLASS_RULES.find((r) => r.id === 'assault-only')!;
      vi.spyOn(rouletteEngine, 'spin').mockReturnValue(assaultRule);

      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      act(() => {
        result.current.legendClassSlot.spinSlot();
      });

      expect(result.current.legendClassSlot.currentResult).toEqual(assaultRule);
      expect(result.current.legendClassSlot.isApplied).toBe(true);
      expect(setLegendChecks).toHaveBeenCalled();
      expect(setWeaponSlot1Checks).not.toHaveBeenCalled();
      expect(setWeaponSlot2Checks).not.toHaveBeenCalled();

      // Verify only Assault class legends are checked
      const appliedChecks: Map<string, boolean> = setLegendChecks.mock.calls[0][0];
      for (const [id, checked] of appliedChecks) {
        const legend = LEGENDS.find((l) => l.id === id)!;
        expect(checked).toBe(legend.class === 'Assault');
      }
    });

    it('should reset: restore snapshot and clear result', () => {
      const assaultRule = LEGEND_CLASS_RULES.find((r) => r.id === 'assault-only')!;
      vi.spyOn(rouletteEngine, 'spin').mockReturnValue(assaultRule);

      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      act(() => {
        result.current.legendClassSlot.spinSlot();
      });

      setLegendChecks.mockClear();

      act(() => {
        result.current.legendClassSlot.resetSlot();
      });

      expect(result.current.legendClassSlot.currentResult).toBeNull();
      expect(result.current.legendClassSlot.isApplied).toBe(false);
      expect(setLegendChecks).toHaveBeenCalled();

      // Restored to all-true snapshot
      const restoredChecks: Map<string, boolean> = setLegendChecks.mock.calls[0][0];
      for (const [, checked] of restoredChecks) {
        expect(checked).toBe(true);
      }
    });

    it('should toggle off: restore snapshot but keep result', () => {
      const assaultRule = LEGEND_CLASS_RULES.find((r) => r.id === 'assault-only')!;
      vi.spyOn(rouletteEngine, 'spin').mockReturnValue(assaultRule);

      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      act(() => {
        result.current.legendClassSlot.spinSlot();
      });

      setLegendChecks.mockClear();

      act(() => {
        result.current.legendClassSlot.toggleApply(false);
      });

      expect(result.current.legendClassSlot.currentResult).toEqual(assaultRule);
      expect(result.current.legendClassSlot.isApplied).toBe(false);
      expect(setLegendChecks).toHaveBeenCalled();
    });

    it('should toggle on: re-apply auto-filter', () => {
      const assaultRule = LEGEND_CLASS_RULES.find((r) => r.id === 'assault-only')!;
      vi.spyOn(rouletteEngine, 'spin').mockReturnValue(assaultRule);

      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      act(() => {
        result.current.legendClassSlot.spinSlot();
      });
      act(() => {
        result.current.legendClassSlot.toggleApply(false);
      });

      setLegendChecks.mockClear();

      act(() => {
        result.current.legendClassSlot.toggleApply(true);
      });

      expect(result.current.legendClassSlot.isApplied).toBe(true);
      expect(setLegendChecks).toHaveBeenCalled();

      const appliedChecks: Map<string, boolean> = setLegendChecks.mock.calls[0][0];
      for (const [id, checked] of appliedChecks) {
        const legend = LEGENDS.find((l) => l.id === id)!;
        expect(checked).toBe(legend.class === 'Assault');
      }
    });

    it('should ignore reset when no result exists', () => {
      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      act(() => {
        result.current.legendClassSlot.resetSlot();
      });

      expect(setLegendChecks).not.toHaveBeenCalled();
    });
  });

  describe('weaponCategorySlot', () => {
    it('should spin and apply weapon category rule to slot1 checks only', () => {
      const shotgunRule = WEAPON_CATEGORY_RULES.find((r) => r.id === 'shotgun-required')!;
      vi.spyOn(rouletteEngine, 'spin').mockReturnValue(shotgunRule);

      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      act(() => {
        result.current.weaponCategorySlot.spinSlot();
      });

      expect(result.current.weaponCategorySlot.currentResult).toEqual(shotgunRule);
      expect(result.current.weaponCategorySlot.isApplied).toBe(true);
      expect(setWeaponSlot1Checks).toHaveBeenCalled();
      expect(setLegendChecks).not.toHaveBeenCalled();
      expect(setWeaponSlot2Checks).not.toHaveBeenCalled();

      // Verify only shotgun weapons are checked
      const appliedChecks: Map<string, boolean> = setWeaponSlot1Checks.mock.calls[0][0];
      for (const [id, checked] of appliedChecks) {
        const weapon = WEAPONS.find((w) => w.id === id)!;
        expect(checked).toBe(weapon.category === 'Shotgun');
      }
    });

    it('should reset: restore snapshot and clear result', () => {
      const shotgunRule = WEAPON_CATEGORY_RULES.find((r) => r.id === 'shotgun-required')!;
      vi.spyOn(rouletteEngine, 'spin').mockReturnValue(shotgunRule);

      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      act(() => {
        result.current.weaponCategorySlot.spinSlot();
      });

      setWeaponSlot1Checks.mockClear();

      act(() => {
        result.current.weaponCategorySlot.resetSlot();
      });

      expect(result.current.weaponCategorySlot.currentResult).toBeNull();
      expect(setWeaponSlot1Checks).toHaveBeenCalled();
    });
  });

  describe('ammoTypeSlot', () => {
    it('should spin and apply ammo type rule to slot2 checks only', () => {
      const lightAmmoRule = AMMO_TYPE_RULES.find((r) => r.id === 'light-ammo')!;
      vi.spyOn(rouletteEngine, 'spin').mockReturnValue(lightAmmoRule);

      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      act(() => {
        result.current.ammoTypeSlot.spinSlot();
      });

      expect(result.current.ammoTypeSlot.currentResult).toEqual(lightAmmoRule);
      expect(result.current.ammoTypeSlot.isApplied).toBe(true);
      expect(setWeaponSlot2Checks).toHaveBeenCalled();
      expect(setLegendChecks).not.toHaveBeenCalled();
      expect(setWeaponSlot1Checks).not.toHaveBeenCalled();

      // Verify: weapons with Light ammo should be checked
      const appliedChecks: Map<string, boolean> = setWeaponSlot2Checks.mock.calls[0][0];
      // C.A.R. has Light ammo
      expect(appliedChecks.get('car')).toBe(true);
      // R-301 has Light ammo
      expect(appliedChecks.get('r-301')).toBe(true);
      // Flatline has Heavy ammo, should be false
      expect(appliedChecks.get('flatline')).toBe(false);
    });

    it('should reset: restore snapshot and clear result', () => {
      const lightAmmoRule = AMMO_TYPE_RULES.find((r) => r.id === 'light-ammo')!;
      vi.spyOn(rouletteEngine, 'spin').mockReturnValue(lightAmmoRule);

      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      act(() => {
        result.current.ammoTypeSlot.spinSlot();
      });

      setWeaponSlot2Checks.mockClear();

      act(() => {
        result.current.ammoTypeSlot.resetSlot();
      });

      expect(result.current.ammoTypeSlot.currentResult).toBeNull();
      expect(setWeaponSlot2Checks).toHaveBeenCalled();
    });
  });

  describe('enable/disable', () => {
    it('should toggle enabled state', () => {
      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      act(() => {
        result.current.legendClassSlot.toggleEnabled(false);
      });

      expect(result.current.legendClassSlot.enabled).toBe(false);
    });
  });

  describe('spinAll', () => {
    it('should spin all enabled slots', () => {
      const assaultRule = LEGEND_CLASS_RULES.find((r) => r.id === 'assault-only')!;
      vi.spyOn(rouletteEngine, 'spin').mockReturnValue(assaultRule);

      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      act(() => {
        result.current.spinAll();
      });

      // All 3 slots should have results (mock returns same rule but that's fine)
      expect(result.current.legendClassSlot.currentResult).not.toBeNull();
      expect(result.current.weaponCategorySlot.currentResult).not.toBeNull();
      expect(result.current.ammoTypeSlot.currentResult).not.toBeNull();
    });

    it('should only spin enabled slots', () => {
      const assaultRule = LEGEND_CLASS_RULES.find((r) => r.id === 'assault-only')!;
      vi.spyOn(rouletteEngine, 'spin').mockReturnValue(assaultRule);

      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      // Disable the ammo type slot
      act(() => {
        result.current.ammoTypeSlot.toggleEnabled(false);
      });

      act(() => {
        result.current.spinAll();
      });

      expect(result.current.legendClassSlot.currentResult).not.toBeNull();
      expect(result.current.weaponCategorySlot.currentResult).not.toBeNull();
      expect(result.current.ammoTypeSlot.currentResult).toBeNull();
      expect(setWeaponSlot2Checks).not.toHaveBeenCalled();
    });
  });

  describe('slots are independent', () => {
    it('spinning one slot should not affect others', () => {
      const assaultRule = LEGEND_CLASS_RULES.find((r) => r.id === 'assault-only')!;
      vi.spyOn(rouletteEngine, 'spin').mockReturnValue(assaultRule);

      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      act(() => {
        result.current.legendClassSlot.spinSlot();
      });

      expect(result.current.legendClassSlot.currentResult).toEqual(assaultRule);
      expect(result.current.weaponCategorySlot.currentResult).toBeNull();
      expect(result.current.ammoTypeSlot.currentResult).toBeNull();
    });

    it('resetting one slot should not affect others', () => {
      const assaultRule = LEGEND_CLASS_RULES.find((r) => r.id === 'assault-only')!;
      const shotgunRule = WEAPON_CATEGORY_RULES.find((r) => r.id === 'shotgun-required')!;

      const { result } = renderHook(() => useRuleRoulette(defaultParams()));

      // Spin legend class
      vi.spyOn(rouletteEngine, 'spin').mockReturnValue(assaultRule);
      act(() => {
        result.current.legendClassSlot.spinSlot();
      });

      // Spin weapon category
      vi.spyOn(rouletteEngine, 'spin').mockReturnValue(shotgunRule);
      act(() => {
        result.current.weaponCategorySlot.spinSlot();
      });

      // Reset legend class only
      act(() => {
        result.current.legendClassSlot.resetSlot();
      });

      expect(result.current.legendClassSlot.currentResult).toBeNull();
      expect(result.current.weaponCategorySlot.currentResult).toEqual(shotgunRule);
      expect(result.current.weaponCategorySlot.isApplied).toBe(true);
    });
  });
});
