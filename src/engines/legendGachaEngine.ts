import { Legend, ValidationResult } from '../types';
import { pickRandom } from '../utils/random';

/**
 * Legend Gacha Engine
 * Pure functions for legend gacha operations including single pick,
 * effective lineup calculation, party gacha, and validation.
 */

/**
 * Pick one legend randomly from the lineup with uniform distribution.
 * @param lineup - Array of legends to pick from
 * @returns A randomly selected legend
 * @throws Error if lineup is empty
 */
export function pickOne(lineup: Legend[]): Legend {
  return pickRandom(lineup);
}

/**
 * Calculate the effective lineup by intersecting host lineup and user profile.
 * Returns legends that are both in the host's lineup AND owned by the user.
 * @param hostLineup - Set of legend IDs selected by the host
 * @param userProfile - Set of legend IDs owned by the user
 * @param allLegends - Complete list of all legends
 * @returns Legends present in both the host lineup and user profile
 */
export function getEffectiveLineup(
  hostLineup: Set<string>,
  userProfile: Set<string>,
  allLegends: Legend[]
): Legend[] {
  return allLegends.filter(
    (legend) => hostLineup.has(legend.id) && userProfile.has(legend.id)
  );
}

/**
 * Pick a party of unique legends across multiple members.
 * Each member picks from their own lineup, but no legend can appear more than once
 * across the entire party.
 * @param lineups - Array of lineups, one per party member
 * @param partySize - Number of members to pick for
 * @returns Array of selected legends (one per member, in order)
 * @throws Error if any member has no available legends after excluding already-picked ones
 */
export function pickParty(lineups: Legend[][], partySize: number): Legend[] {
  const picked: Legend[] = [];
  const pickedIds = new Set<string>();

  for (let i = 0; i < partySize; i++) {
    // Filter out already-picked legends from this member's lineup
    const available = lineups[i].filter((legend) => !pickedIds.has(legend.id));

    if (available.length === 0) {
      throw new Error(
        `Member ${i} has no available legends after excluding already-picked ones`
      );
    }

    const selected = pickRandom(available);
    picked.push(selected);
    pickedIds.add(selected.id);
  }

  return picked;
}

/**
 * Validate that a legend gacha can be executed.
 * @param lineup - The effective lineup to validate
 * @returns ValidationResult indicating if gacha can proceed
 */
export function validateLegendGacha(lineup: Legend[]): ValidationResult {
  if (lineup.length === 0) {
    return { valid: false, error: 'NO_LEGENDS_SELECTED' };
  }
  return { valid: true };
}

/**
 * Validate that a party gacha can be executed.
 * Checks each member's lineup has at least 1 available legend
 * after excluding previously picked legends (simulating the sequential pick).
 * @param lineups - Array of lineups, one per party member
 * @param partySize - Number of members to pick for
 * @returns ValidationResult indicating if party gacha can proceed
 */
export function validatePartyGacha(
  lineups: Legend[][],
  partySize: number
): ValidationResult {
  const pickedIds = new Set<string>();

  for (let i = 0; i < partySize; i++) {
    const available = lineups[i].filter((legend) => !pickedIds.has(legend.id));

    if (available.length === 0) {
      return { valid: false, error: 'MEMBER_INSUFFICIENT', memberIndex: i };
    }

    // Simulate a pick to track what could be taken
    // For validation, we just need to confirm at least one is available
    // We add all IDs from this member's available pool as "potentially picked"
    // Actually, for worst-case validation, we only need to confirm availability.
    // The actual uniqueness guarantee comes from the pickParty function.
    // For validation, we simulate by assuming one legend gets picked from each.
    // We pick the first available one to simulate a worst-case scenario isn't needed —
    // we just need to confirm at least 1 is available for each member.
    // However, we should track that SOME legend will be consumed.
    // Use the first available legend as a stand-in for validation purposes.
    pickedIds.add(available[0].id);
  }

  return { valid: true };
}
