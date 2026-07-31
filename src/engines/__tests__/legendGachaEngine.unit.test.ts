import { describe, it, expect } from 'vitest';
import {
  pickOne,
  getEffectiveLineup,
  pickParty,
  validateLegendGacha,
  validatePartyGacha,
} from '../legendGachaEngine';
import { Legend } from '../../types';

// Test fixtures
const makeLegend = (id: string, name?: string): Legend => ({
  id,
  name: name ?? id,
  class: 'Assault',
  imagePath: `/images/legends/${id}.png`,
  hasThirdWeaponSlot: false,
});

const legends: Legend[] = [
  makeLegend('bangalore', 'バンガロール'),
  makeLegend('revenant', 'レヴナント'),
  makeLegend('fuse', 'ヒューズ'),
  makeLegend('mad-maggie', 'マッドマギー'),
  makeLegend('ballistic', 'バリスティック'),
];

describe('legendGachaEngine', () => {
  describe('pickOne', () => {
    it('should return a legend from the lineup', () => {
      const result = pickOne(legends);
      expect(legends).toContain(result);
    });

    it('should return the only legend when lineup has one entry', () => {
      const single = [makeLegend('solo')];
      expect(pickOne(single)).toBe(single[0]);
    });

    it('should throw when lineup is empty', () => {
      expect(() => pickOne([])).toThrow();
    });
  });

  describe('getEffectiveLineup', () => {
    it('should return legends present in both host lineup and user profile', () => {
      const hostLineup = new Set(['bangalore', 'revenant', 'fuse']);
      const userProfile = new Set(['revenant', 'fuse', 'mad-maggie']);
      const result = getEffectiveLineup(hostLineup, userProfile, legends);

      expect(result).toHaveLength(2);
      expect(result.map((l) => l.id)).toEqual(
        expect.arrayContaining(['revenant', 'fuse'])
      );
    });

    it('should return empty array when no intersection', () => {
      const hostLineup = new Set(['bangalore']);
      const userProfile = new Set(['mad-maggie']);
      const result = getEffectiveLineup(hostLineup, userProfile, legends);
      expect(result).toHaveLength(0);
    });

    it('should return all legends when both sets contain all IDs', () => {
      const allIds = new Set(legends.map((l) => l.id));
      const result = getEffectiveLineup(allIds, allIds, legends);
      expect(result).toHaveLength(legends.length);
    });

    it('should handle empty host lineup', () => {
      const hostLineup = new Set<string>();
      const userProfile = new Set(legends.map((l) => l.id));
      const result = getEffectiveLineup(hostLineup, userProfile, legends);
      expect(result).toHaveLength(0);
    });

    it('should handle empty user profile', () => {
      const hostLineup = new Set(legends.map((l) => l.id));
      const userProfile = new Set<string>();
      const result = getEffectiveLineup(hostLineup, userProfile, legends);
      expect(result).toHaveLength(0);
    });
  });

  describe('pickParty', () => {
    it('should return unique legends for each party member', () => {
      const lineups = [legends, legends, legends];
      const result = pickParty(lineups, 3);

      expect(result).toHaveLength(3);
      const ids = result.map((l) => l.id);
      expect(new Set(ids).size).toBe(3); // All unique
    });

    it('should pick from each member lineup', () => {
      const lineup1 = [makeLegend('a')];
      const lineup2 = [makeLegend('b')];
      const result = pickParty([lineup1, lineup2], 2);

      expect(result[0].id).toBe('a');
      expect(result[1].id).toBe('b');
    });

    it('should throw when a member has no available legends', () => {
      // Both members have the same single legend - second member will fail
      const lineup = [makeLegend('only-one')];
      expect(() => pickParty([lineup, lineup], 2)).toThrow();
    });

    it('should handle party size of 1', () => {
      const result = pickParty([legends], 1);
      expect(result).toHaveLength(1);
      expect(legends).toContain(result[0]);
    });
  });

  describe('validateLegendGacha', () => {
    it('should return valid: true for non-empty lineup', () => {
      expect(validateLegendGacha(legends)).toEqual({ valid: true });
    });

    it('should return valid: false with error for empty lineup', () => {
      expect(validateLegendGacha([])).toEqual({
        valid: false,
        error: 'NO_LEGENDS_SELECTED',
      });
    });
  });

  describe('validatePartyGacha', () => {
    it('should return valid: true when all members have sufficient legends', () => {
      const lineups = [legends, legends, legends];
      expect(validatePartyGacha(lineups, 3)).toEqual({ valid: true });
    });

    it('should return valid: false when a member has empty lineup', () => {
      const lineups = [legends, [], legends];
      const result = validatePartyGacha(lineups, 3);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('MEMBER_INSUFFICIENT');
      expect(result.memberIndex).toBe(1);
    });

    it('should return valid: false when members cannot all get unique legends', () => {
      // All three members only have the same single legend
      const singleLegend = [makeLegend('only')];
      const lineups = [singleLegend, singleLegend, singleLegend];
      const result = validatePartyGacha(lineups, 3);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('MEMBER_INSUFFICIENT');
    });

    it('should handle party size of 1', () => {
      expect(validatePartyGacha([legends], 1)).toEqual({ valid: true });
    });
  });
});
