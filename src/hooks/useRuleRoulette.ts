import { useCallback, useState } from 'react';
import type { Rule, FilterResult } from '../types';
import { LEGENDS } from '../data/legends';
import { WEAPONS } from '../data/weapons';
import { RULES } from '../data/rules';
import { spin } from '../engines/rouletteEngine';
import { applyRule, saveSnapshot, resetToSnapshot, toggleApply as engineToggleApply } from '../engines/autoFilterEngine';

/** Snapshot of checkbox state before roulette was applied */
interface RouletteSnapshot {
  legendChecks: Map<string, boolean>;
  weaponSlot1Checks: Map<string, boolean>;
}

export interface UseRuleRouletteParams {
  /** Setter to update legend checks state */
  setLegendChecks: (checks: Map<string, boolean>) => void;
  /** Setter to update weapon slot 1 checks state */
  setWeaponSlot1Checks: (checks: Map<string, boolean>) => void;
}

export interface UseRuleRouletteReturn {
  /** Current roulette result (null if not spun yet) */
  currentResult: Rule | null;
  /** Whether the roulette result is currently applied to checkboxes */
  isApplied: boolean;
  /** Spin the roulette: saves snapshot, picks random rule, applies auto-filter */
  spinRoulette: (currentLegendChecks: Map<string, boolean>, currentWeaponSlot1Checks: Map<string, boolean>) => void;
  /** Reset roulette: restores snapshot, clears result */
  resetRoulette: () => void;
  /** Toggle apply state: off restores snapshot, on re-applies filter */
  toggleApply: (on: boolean) => void;
}

/**
 * Hook for managing rule roulette state and operations.
 * Accepts setters for legend and weapon slot 1 checks to integrate
 * with the parent context that manages those states.
 *
 * Requirements: 9.1, 9.4, 10.1, 10.2, 10.3, 10.4, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6
 */
export function useRuleRoulette({
  setLegendChecks,
  setWeaponSlot1Checks,
}: UseRuleRouletteParams): UseRuleRouletteReturn {
  const [currentResult, setCurrentResult] = useState<Rule | null>(null);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [preRouletteSnapshot, setPreRouletteSnapshot] = useState<RouletteSnapshot | null>(null);

  /**
   * Spin the roulette:
   * 1. Save current checkbox snapshot
   * 2. Pick a random rule from RULES
   * 3. Apply auto-filter based on the rule
   * 4. Set currentResult and isApplied=true
   */
  const spinRoulette = useCallback(
    (currentLegendChecks: Map<string, boolean>, currentWeaponSlot1Checks: Map<string, boolean>) => {
      // Save snapshot of current state
      const snapshot = saveSnapshot(currentLegendChecks, currentWeaponSlot1Checks);
      setPreRouletteSnapshot(snapshot);

      // Spin to get a random rule
      const rule = spin(RULES);
      setCurrentResult(rule);

      // Apply the rule's auto-filter
      const filterResult: FilterResult = applyRule(rule, LEGENDS, WEAPONS);

      // Apply filter result to state via setters
      if (filterResult.legendChecks) {
        setLegendChecks(filterResult.legendChecks);
      }
      if (filterResult.weaponSlot1Checks) {
        setWeaponSlot1Checks(filterResult.weaponSlot1Checks);
      }

      setIsApplied(true);
    },
    [setLegendChecks, setWeaponSlot1Checks]
  );

  /**
   * Reset roulette:
   * 1. Restore from snapshot
   * 2. Clear currentResult, isApplied=false, snapshot=null
   * Requirement 11.3: restore checkboxes to pre-roulette state
   * Requirement 11.6: ignore if no result exists
   */
  const resetRoulette = useCallback(() => {
    if (!currentResult || !preRouletteSnapshot) {
      return; // Req 11.6: ignore if no result
    }

    // Restore snapshot
    const restored = resetToSnapshot(preRouletteSnapshot);
    setLegendChecks(restored.legendChecks);
    setWeaponSlot1Checks(restored.weaponSlot1Checks);

    // Clear state
    setCurrentResult(null);
    setIsApplied(false);
    setPreRouletteSnapshot(null);
  }, [currentResult, preRouletteSnapshot, setLegendChecks, setWeaponSlot1Checks]);

  /**
   * Toggle apply:
   * - off (false): restore snapshot, keep currentResult (Req 11.4)
   * - on (true): re-apply auto-filter from currentResult (Req 11.5)
   * Requirement 11.6: ignore if no result exists
   */
  const toggleApply = useCallback(
    (on: boolean) => {
      if (!currentResult || !preRouletteSnapshot) {
        return; // Req 11.6: ignore if no result
      }

      const result = engineToggleApply(on, currentResult, preRouletteSnapshot, LEGENDS, WEAPONS);
      setLegendChecks(result.legendChecks);
      setWeaponSlot1Checks(result.weaponSlot1Checks);
      setIsApplied(on);
    },
    [currentResult, preRouletteSnapshot, setLegendChecks, setWeaponSlot1Checks]
  );

  return {
    currentResult,
    isApplied,
    spinRoulette,
    resetRoulette,
    toggleApply,
  };
}
