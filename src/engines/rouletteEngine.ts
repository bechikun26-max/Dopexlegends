import type { Rule } from '../types';
import { pickRandom } from '../utils/random';

/**
 * Spin the roulette to randomly select a rule from the rule set.
 * @param rules - Array of available rules to choose from
 * @returns A randomly selected Rule with uniform probability
 * @throws Error if rules array is empty
 */
export function spin(rules: Rule[]): Rule {
  return pickRandom(rules);
}
