import { useCallback, useMemo } from 'react';
import type { Rule, FilterResult } from '../types';
import { LEGENDS } from '../data/legends';
import { WEAPONS } from '../data/weapons';
import { LEGEND_CLASS_RULES, WEAPON_CATEGORY_RULES, AMMO_TYPE_RULES } from '../data/rules';
import { spin } from '../engines/rouletteEngine';
import { applyRule } from '../engines/autoFilterEngine';
import { useLocalStorage } from './useLocalStorage';
import { mapToRecord, recordToMap } from '../utils/storage';

// === Types ===

export type RouletteSlotId = 'legendClass' | 'weaponCategory' | 'ammoType';

/** State for a single roulette slot */
export interface RouletteSlotState {
  /** Current result (null if not spun yet) */
  currentResult: Rule | null;
  /** Whether the result is currently applied to checkboxes */
  isApplied: boolean;
  /** Whether this roulette slot is enabled */
  enabled: boolean;
}

/** Actions for a single roulette slot */
export interface RouletteSlotActions {
  /** Spin this roulette slot */
  spinSlot: () => void;
  /** Reset this roulette slot */
  resetSlot: () => void;
  /** Toggle apply state */
  toggleApply: (on: boolean) => void;
  /** Toggle enabled state */
  toggleEnabled: (on: boolean) => void;
}

/** Combined state + actions for a single roulette slot */
export interface RouletteSlot extends RouletteSlotState, RouletteSlotActions {
  /** The rules this slot draws from */
  rules: Rule[];
  /** Display title */
  title: string;
}

export interface UseRuleRouletteParams {
  /** Current legend checks (for snapshotting) */
  legendChecks: Map<string, boolean>;
  /** Current weapon slot 1 checks (for snapshotting) */
  weaponSlot1Checks: Map<string, boolean>;
  /** Current weapon slot 2 checks (for snapshotting) */
  weaponSlot2Checks: Map<string, boolean>;
  /** Setter to update legend checks state */
  setLegendChecks: (checks: Map<string, boolean>) => void;
  /** Setter to update weapon slot 1 checks state */
  setWeaponSlot1Checks: (checks: Map<string, boolean>) => void;
  /** Setter to update weapon slot 2 checks state */
  setWeaponSlot2Checks: (checks: Map<string, boolean>) => void;
}

export interface UseRuleRouletteReturn {
  /** Legend class roulette slot */
  legendClassSlot: RouletteSlot;
  /** Weapon category (slot1) roulette slot */
  weaponCategorySlot: RouletteSlot;
  /** Ammo type (slot2) roulette slot */
  ammoTypeSlot: RouletteSlot;
  /** Spin all enabled roulettes simultaneously */
  spinAll: () => void;
}

/** Serializable snapshot for a single slot */
interface SerializableSnapshot {
  checks: Record<string, boolean>;
}

/**
 * Hook for managing 3 independent rule roulette slots.
 * Each slot has its own result, apply state, enabled state, and snapshot.
 *
 * - legendClassSlot: draws from LEGEND_CLASS_RULES, applies to legendChecks
 * - weaponCategorySlot: draws from WEAPON_CATEGORY_RULES, applies to weaponSlot1Checks
 * - ammoTypeSlot: draws from AMMO_TYPE_RULES, applies to weaponSlot2Checks
 */
export function useRuleRoulette({
  legendChecks,
  weaponSlot1Checks,
  weaponSlot2Checks,
  setLegendChecks,
  setWeaponSlot1Checks,
  setWeaponSlot2Checks,
}: UseRuleRouletteParams): UseRuleRouletteReturn {

  // === Legend Class Slot State ===
  const [lcResult, setLcResult] = useLocalStorage<Rule | null>('roulette-legendClass-result', null);
  const [lcApplied, setLcApplied] = useLocalStorage<boolean>('roulette-legendClass-applied', false);
  const [lcEnabled, setLcEnabled] = useLocalStorage<boolean>('roulette-legendClass-enabled', true);
  const [lcSnapshot, setLcSnapshot] = useLocalStorage<SerializableSnapshot | null>('roulette-legendClass-snapshot', null);

  // === Weapon Category Slot State ===
  const [wcResult, setWcResult] = useLocalStorage<Rule | null>('roulette-weaponCategory-result', null);
  const [wcApplied, setWcApplied] = useLocalStorage<boolean>('roulette-weaponCategory-applied', false);
  const [wcEnabled, setWcEnabled] = useLocalStorage<boolean>('roulette-weaponCategory-enabled', true);
  const [wcSnapshot, setWcSnapshot] = useLocalStorage<SerializableSnapshot | null>('roulette-weaponCategory-snapshot', null);

  // === Ammo Type Slot State ===
  const [atResult, setAtResult] = useLocalStorage<Rule | null>('roulette-ammoType-result', null);
  const [atApplied, setAtApplied] = useLocalStorage<boolean>('roulette-ammoType-applied', false);
  const [atEnabled, setAtEnabled] = useLocalStorage<boolean>('roulette-ammoType-enabled', true);
  const [atSnapshot, setAtSnapshot] = useLocalStorage<SerializableSnapshot | null>('roulette-ammoType-snapshot', null);

  // === Snapshot Map conversions ===
  const lcSnapshotMap = useMemo(() => lcSnapshot ? recordToMap(lcSnapshot.checks) : null, [lcSnapshot]);
  const wcSnapshotMap = useMemo(() => wcSnapshot ? recordToMap(wcSnapshot.checks) : null, [wcSnapshot]);
  const atSnapshotMap = useMemo(() => atSnapshot ? recordToMap(atSnapshot.checks) : null, [atSnapshot]);

  // === Legend Class Slot Actions ===
  const spinLegendClass = useCallback(() => {
    // Save snapshot of current legend checks before applying rule
    setLcSnapshot({ checks: mapToRecord(legendChecks) });

    const rule = spin(LEGEND_CLASS_RULES);
    setLcResult(rule);

    const filterResult: FilterResult = applyRule(rule, LEGENDS, WEAPONS);
    if (filterResult.legendChecks) {
      setLegendChecks(filterResult.legendChecks);
    }
    setLcApplied(true);
  }, [legendChecks, setLcSnapshot, setLcResult, setLcApplied, setLegendChecks]);

  const resetLegendClass = useCallback(() => {
    if (!lcResult || !lcSnapshotMap) return;
    setLegendChecks(new Map(lcSnapshotMap));
    setLcResult(null);
    setLcApplied(false);
    setLcSnapshot(null);
  }, [lcResult, lcSnapshotMap, setLegendChecks, setLcResult, setLcApplied, setLcSnapshot]);

  const toggleApplyLegendClass = useCallback((on: boolean) => {
    if (!lcResult || !lcSnapshotMap) return;
    if (on) {
      const filterResult = applyRule(lcResult, LEGENDS, WEAPONS);
      if (filterResult.legendChecks) {
        setLegendChecks(filterResult.legendChecks);
      }
    } else {
      setLegendChecks(new Map(lcSnapshotMap));
    }
    setLcApplied(on);
  }, [lcResult, lcSnapshotMap, setLegendChecks, setLcApplied]);

  // === Weapon Category Slot Actions ===
  const spinWeaponCategory = useCallback(() => {
    // Save snapshot of current weapon slot 1 checks
    setWcSnapshot({ checks: mapToRecord(weaponSlot1Checks) });

    const rule = spin(WEAPON_CATEGORY_RULES);
    setWcResult(rule);

    const filterResult: FilterResult = applyRule(rule, LEGENDS, WEAPONS);
    if (filterResult.weaponSlot1Checks) {
      setWeaponSlot1Checks(filterResult.weaponSlot1Checks);
    }
    setWcApplied(true);
  }, [weaponSlot1Checks, setWcSnapshot, setWcResult, setWcApplied, setWeaponSlot1Checks]);

  const resetWeaponCategory = useCallback(() => {
    if (!wcResult || !wcSnapshotMap) return;
    setWeaponSlot1Checks(new Map(wcSnapshotMap));
    setWcResult(null);
    setWcApplied(false);
    setWcSnapshot(null);
  }, [wcResult, wcSnapshotMap, setWeaponSlot1Checks, setWcResult, setWcApplied, setWcSnapshot]);

  const toggleApplyWeaponCategory = useCallback((on: boolean) => {
    if (!wcResult || !wcSnapshotMap) return;
    if (on) {
      const filterResult = applyRule(wcResult, LEGENDS, WEAPONS);
      if (filterResult.weaponSlot1Checks) {
        setWeaponSlot1Checks(filterResult.weaponSlot1Checks);
      }
    } else {
      setWeaponSlot1Checks(new Map(wcSnapshotMap));
    }
    setWcApplied(on);
  }, [wcResult, wcSnapshotMap, setWeaponSlot1Checks, setWcApplied]);

  // === Ammo Type Slot Actions ===
  const spinAmmoType = useCallback(() => {
    // Save snapshot of current weapon slot 2 checks
    setAtSnapshot({ checks: mapToRecord(weaponSlot2Checks) });

    const rule = spin(AMMO_TYPE_RULES);
    setAtResult(rule);

    const filterResult: FilterResult = applyRule(rule, LEGENDS, WEAPONS);
    if (filterResult.weaponSlot2Checks) {
      setWeaponSlot2Checks(filterResult.weaponSlot2Checks);
    }
    setAtApplied(true);
  }, [weaponSlot2Checks, setAtSnapshot, setAtResult, setAtApplied, setWeaponSlot2Checks]);

  const resetAmmoType = useCallback(() => {
    if (!atResult || !atSnapshotMap) return;
    setWeaponSlot2Checks(new Map(atSnapshotMap));
    setAtResult(null);
    setAtApplied(false);
    setAtSnapshot(null);
  }, [atResult, atSnapshotMap, setWeaponSlot2Checks, setAtResult, setAtApplied, setAtSnapshot]);

  const toggleApplyAmmoType = useCallback((on: boolean) => {
    if (!atResult || !atSnapshotMap) return;
    if (on) {
      const filterResult = applyRule(atResult, LEGENDS, WEAPONS);
      if (filterResult.weaponSlot2Checks) {
        setWeaponSlot2Checks(filterResult.weaponSlot2Checks);
      }
    } else {
      setWeaponSlot2Checks(new Map(atSnapshotMap));
    }
    setAtApplied(on);
  }, [atResult, atSnapshotMap, setWeaponSlot2Checks, setAtApplied]);

  // === Spin All Enabled ===
  const spinAll = useCallback(() => {
    if (lcEnabled) spinLegendClass();
    if (wcEnabled) spinWeaponCategory();
    if (atEnabled) spinAmmoType();
  }, [lcEnabled, wcEnabled, atEnabled, spinLegendClass, spinWeaponCategory, spinAmmoType]);

  // === Build slot objects ===

  /** レジェンドクラス縛りを無効にしたとき全選択に戻す */
  const toggleEnabledLegendClass = useCallback((on: boolean) => {
    setLcEnabled(on);
    if (!on) {
      // 全レジェンドをチェックONに戻す
      const allChecked = new Map<string, boolean>();
      for (const l of LEGENDS) { allChecked.set(l.id, true); }
      setLegendChecks(allChecked);
      // 結果もクリア
      setLcResult(null);
      setLcApplied(false);
      setLcSnapshot(null);
    }
  }, [setLcEnabled, setLegendChecks, setLcResult, setLcApplied, setLcSnapshot]);

  /** 武器カテゴリ縛りを無効にしたときスロット1を全選択に戻す */
  const toggleEnabledWeaponCategory = useCallback((on: boolean) => {
    setWcEnabled(on);
    if (!on) {
      const allChecked = new Map<string, boolean>();
      for (const w of WEAPONS) {
        if (!w.isCarePackage) { allChecked.set(w.id, true); }
      }
      setWeaponSlot1Checks(allChecked);
      setWcResult(null);
      setWcApplied(false);
      setWcSnapshot(null);
    }
  }, [setWcEnabled, setWeaponSlot1Checks, setWcResult, setWcApplied, setWcSnapshot]);

  /** 弾薬縛りを無効にしたときスロット2を全選択に戻す */
  const toggleEnabledAmmoType = useCallback((on: boolean) => {
    setAtEnabled(on);
    if (!on) {
      const allChecked = new Map<string, boolean>();
      for (const w of WEAPONS) {
        if (!w.isCarePackage) { allChecked.set(w.id, true); }
      }
      setWeaponSlot2Checks(allChecked);
      setAtResult(null);
      setAtApplied(false);
      setAtSnapshot(null);
    }
  }, [setAtEnabled, setWeaponSlot2Checks, setAtResult, setAtApplied, setAtSnapshot]);

  const legendClassSlot: RouletteSlot = useMemo(() => ({
    currentResult: lcResult,
    isApplied: lcApplied,
    enabled: lcEnabled,
    rules: LEGEND_CLASS_RULES,
    title: 'クラス縛り',
    spinSlot: spinLegendClass,
    resetSlot: resetLegendClass,
    toggleApply: toggleApplyLegendClass,
    toggleEnabled: toggleEnabledLegendClass,
  }), [lcResult, lcApplied, lcEnabled, spinLegendClass, resetLegendClass, toggleApplyLegendClass, toggleEnabledLegendClass]);

  const weaponCategorySlot: RouletteSlot = useMemo(() => ({
    currentResult: wcResult,
    isApplied: wcApplied,
    enabled: wcEnabled,
    rules: WEAPON_CATEGORY_RULES,
    title: '武器1カテゴリ縛り',
    spinSlot: spinWeaponCategory,
    resetSlot: resetWeaponCategory,
    toggleApply: toggleApplyWeaponCategory,
    toggleEnabled: toggleEnabledWeaponCategory,
  }), [wcResult, wcApplied, wcEnabled, spinWeaponCategory, resetWeaponCategory, toggleApplyWeaponCategory, toggleEnabledWeaponCategory]);

  const ammoTypeSlot: RouletteSlot = useMemo(() => ({
    currentResult: atResult,
    isApplied: atApplied,
    enabled: atEnabled,
    rules: AMMO_TYPE_RULES,
    title: '武器2弾薬縛り',
    spinSlot: spinAmmoType,
    resetSlot: resetAmmoType,
    toggleApply: toggleApplyAmmoType,
    toggleEnabled: toggleEnabledAmmoType,
  }), [atResult, atApplied, atEnabled, spinAmmoType, resetAmmoType, toggleApplyAmmoType, toggleEnabledAmmoType]);

  return {
    legendClassSlot,
    weaponCategorySlot,
    ammoTypeSlot,
    spinAll,
  };
}
