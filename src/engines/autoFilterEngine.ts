import type { Rule, Legend, Weapon, FilterResult } from '../types';

/**
 * Apply a roulette rule to produce the resulting checkbox states.
 * - LegendClass rules: legendChecks map where matching class = true, others = false
 * - WeaponCategory rules: weaponSlot1Checks where matching category = true, others = false
 * - AmmoType rules: weaponSlot2Checks where matching ammo type = true (uses includes() for multi-ammo), others = false
 */
export function applyRule(rule: Rule, legends: Legend[], weapons: Weapon[]): FilterResult {
  switch (rule.category) {
    case 'LegendClass': {
      const legendChecks = new Map<string, boolean>();
      for (const legend of legends) {
        legendChecks.set(legend.id, legend.class === rule.filterValue);
      }
      return { legendChecks };
    }
    case 'WeaponCategory': {
      const weaponSlot1Checks = new Map<string, boolean>();
      for (const weapon of weapons) {
        weaponSlot1Checks.set(weapon.id, weapon.category === rule.filterValue);
      }
      return { weaponSlot1Checks };
    }
    case 'AmmoType': {
      const weaponSlot2Checks = new Map<string, boolean>();
      for (const weapon of weapons) {
        weaponSlot2Checks.set(weapon.id, weapon.ammoTypes.includes(rule.filterValue as typeof weapon.ammoTypes[number]));
      }
      return { weaponSlot2Checks };
    }
  }
}

/**
 * Save the current checkbox state as a snapshot for later restoration.
 */
export function saveSnapshot(
  legendChecks: Map<string, boolean>,
  weaponSlot1Checks: Map<string, boolean>
): { legendChecks: Map<string, boolean>; weaponSlot1Checks: Map<string, boolean> } {
  return {
    legendChecks: new Map(legendChecks),
    weaponSlot1Checks: new Map(weaponSlot1Checks),
  };
}

/**
 * Reset to a previously saved snapshot.
 */
export function resetToSnapshot(
  snapshot: { legendChecks: Map<string, boolean>; weaponSlot1Checks: Map<string, boolean> }
): { legendChecks: Map<string, boolean>; weaponSlot1Checks: Map<string, boolean> } {
  return {
    legendChecks: new Map(snapshot.legendChecks),
    weaponSlot1Checks: new Map(snapshot.weaponSlot1Checks),
  };
}

/**
 * Toggle apply logic:
 * - Toggle OFF (on = false): restore from snapshot (return snapshot state)
 * - Toggle ON (on = true): re-apply the rule (call applyRule again with the current rule)
 */
export function toggleApply(
  on: boolean,
  rule: Rule,
  snapshot: { legendChecks: Map<string, boolean>; weaponSlot1Checks: Map<string, boolean> },
  legends: Legend[],
  weapons: Weapon[]
): { legendChecks: Map<string, boolean>; weaponSlot1Checks: Map<string, boolean> } {
  if (!on) {
    // Toggle OFF: restore from snapshot
    return resetToSnapshot(snapshot);
  }
  // Toggle ON: re-apply the rule
  const filterResult = applyRule(rule, legends, weapons);
  return {
    legendChecks: filterResult.legendChecks ?? new Map(snapshot.legendChecks),
    weaponSlot1Checks: filterResult.weaponSlot1Checks ?? new Map(snapshot.weaponSlot1Checks),
  };
}
