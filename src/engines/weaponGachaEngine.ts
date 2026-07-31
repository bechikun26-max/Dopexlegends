import { Weapon, ValidationResult } from '../types';
import { pickRandom } from '../utils/random';

/**
 * Weapon Gacha Engine
 * Pure functions for weapon gacha operations including single slot pick,
 * all-slots pick, effective lineup calculation, and validation.
 */

/**
 * Pick one weapon randomly from the slot lineup with uniform distribution.
 * @param lineup - Array of weapons available for the slot
 * @returns A randomly selected weapon
 * @throws Error if lineup is empty
 */
export function pickWeapon(lineup: Weapon[]): Weapon {
  return pickRandom(lineup);
}

/**
 * Pick weapons for both slots independently.
 * Each slot draws from its own lineup. The same weapon appearing in both
 * slots is allowed (per Req 4.2).
 * @param slot1Lineup - Array of weapons available for Slot 1
 * @param slot2Lineup - Array of weapons available for Slot 2
 * @returns Tuple of [Slot 1 weapon, Slot 2 weapon]
 * @throws Error if either lineup is empty
 */
export function pickAllSlots(
  slot1Lineup: Weapon[],
  slot2Lineup: Weapon[]
): [Weapon, Weapon] {
  const slot1 = pickRandom(slot1Lineup);
  const slot2 = pickRandom(slot2Lineup);
  return [slot1, slot2];
}

/**
 * Calculate the effective weapon lineup for a slot.
 * Returns weapons where the slot checkbox is checked AND the weapon is NOT
 * a care package weapon. Care package weapons are excluded from all lineups
 * regardless of checkbox state (per Req 8.3).
 * @param slotChecks - Map of weapon ID to checkbox state for the slot
 * @param carePackageFlags - Map of weapon ID to care package flag
 * @param allWeapons - Complete list of all weapons
 * @returns Weapons that are checked and not care package weapons
 */
export function getEffectiveWeaponLineup(
  slotChecks: Map<string, boolean>,
  carePackageFlags: Map<string, boolean>,
  allWeapons: Weapon[]
): Weapon[] {
  return allWeapons.filter(
    (weapon) =>
      slotChecks.get(weapon.id) === true &&
      carePackageFlags.get(weapon.id) !== true
  );
}

/**
 * Validate that a weapon gacha can be executed for both slots.
 * @param slot1Lineup - The effective lineup for Slot 1
 * @param slot2Lineup - The effective lineup for Slot 2
 * @returns ValidationResult indicating if gacha can proceed
 */
export function validateWeaponGacha(
  slot1Lineup: Weapon[],
  slot2Lineup: Weapon[]
): ValidationResult {
  if (slot1Lineup.length === 0) {
    return { valid: false, error: 'SLOT1_EMPTY' };
  }
  if (slot2Lineup.length === 0) {
    return { valid: false, error: 'SLOT2_EMPTY' };
  }
  return { valid: true };
}
