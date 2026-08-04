import { Legend, Weapon } from '../types';

/**
 * Nessie Easter Egg Detection Engine
 * Pure functions for evaluating the Nessie easter egg trigger conditions.
 * No side effects — all functions depend only on their inputs.
 */

/** Input for the combined Nessie condition check */
export interface NessieConditionInput {
  /** レジェンドガチャのパーティ結果 */
  partyResult: Legend[] | null;
  /** スロット1の武器チェック状態 */
  slot1Checks: Map<string, boolean>;
  /** スロット2の武器チェック状態 */
  slot2Checks: Map<string, boolean>;
  /** ケアパッケージフラグ */
  carePackageFlags: Map<string, boolean>;
  /** スロット1の結果 */
  slot1Result: Weapon | null;
  /** スロット2の結果 */
  slot2Result: Weapon | null;
  /** スリング（スロット3）の結果 */
  slot3Result: Weapon | null;
}

/**
 * Check if the party result contains at least one legend with
 * `hasThirdWeaponSlot === true` (i.e., Ballistic).
 * @param partyResult - The legend gacha party result
 * @returns true if partyResult is non-null and contains a legend with hasThirdWeaponSlot
 */
export function hasBallistic(partyResult: Legend[] | null): boolean {
  if (partyResult === null) {
    return false;
  }
  return partyResult.some((legend) => legend.hasThirdWeaponSlot === true);
}

/**
 * Check if all non-care-package weapons in the slot checks are enabled (checked).
 * A weapon is considered "care package" if `carePackageFlags.get(id) === true`.
 * Returns true when every non-care-package weapon ID in slotChecks has value `true`.
 * @param slotChecks - Map of weapon ID to checked state
 * @param carePackageFlags - Map of weapon ID to care package flag
 * @returns true if all non-care-package weapons are checked
 */
export function isAllWeaponsEnabled(
  slotChecks: Map<string, boolean>,
  carePackageFlags: Map<string, boolean>
): boolean {
  for (const [id, checked] of slotChecks) {
    if (carePackageFlags.get(id) === true) {
      continue;
    }
    if (checked !== true) {
      return false;
    }
  }
  return true;
}

/**
 * Check if all three weapon slot results are non-null and share the same weapon ID.
 * @param slot1Result - Weapon result for slot 1
 * @param slot2Result - Weapon result for slot 2
 * @param slot3Result - Weapon result for slot 3 (sling)
 * @returns true if all are non-null and have the same ID
 */
export function isSameWeaponAllSlots(
  slot1Result: Weapon | null,
  slot2Result: Weapon | null,
  slot3Result: Weapon | null
): boolean {
  if (slot1Result === null || slot2Result === null || slot3Result === null) {
    return false;
  }
  return slot1Result.id === slot2Result.id && slot2Result.id === slot3Result.id;
}

/**
 * Evaluate all Nessie easter egg conditions combined with AND logic.
 * Conditions:
 *  1. Party contains Ballistic (hasThirdWeaponSlot === true)
 *  2. Slot 1 has all non-care-package weapons enabled
 *  3. Slot 2 has all non-care-package weapons enabled
 *  4. All three slot results are non-null and the same weapon
 * @param input - The complete condition input
 * @returns true if all conditions are met
 */
export function checkNessieCondition(input: NessieConditionInput): boolean {
  return (
    hasBallistic(input.partyResult) &&
    isAllWeaponsEnabled(input.slot1Checks, input.carePackageFlags) &&
    isAllWeaponsEnabled(input.slot2Checks, input.carePackageFlags) &&
    isSameWeaponAllSlots(input.slot1Result, input.slot2Result, input.slot3Result)
  );
}
