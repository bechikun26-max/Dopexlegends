import { useCallback, useMemo, useState } from 'react';
import type { Legend, LegendClass, ValidationResult } from '../types';
import { LEGENDS } from '../data/legends';
import {
  pickOne,
  getEffectiveLineup,
  pickParty,
  validateLegendGacha,
  validatePartyGacha,
} from '../engines/legendGachaEngine';
import { useLocalStorage } from './useLocalStorage';
import { mapToRecord, recordToMap } from '../utils/storage';
import { filterByClass } from '../utils/filter';

/** Storage key for legend lineup checks */
const STORAGE_KEY = 'legend-lineup-checks';

/** Create default checks with all legends checked */
function createDefaultChecks(): Record<string, boolean> {
  const record: Record<string, boolean> = {};
  for (const legend of LEGENDS) {
    record[legend.id] = true;
  }
  return record;
}

export interface UseLegendGachaReturn {
  /** Current checks state as a Map<legendId, isChecked> */
  checks: Map<string, boolean>;
  /** Last gacha result (single legend) */
  result: Legend | null;
  /** Last error message */
  error: string | null;
  /** Toggle a single legend's check state */
  toggleLegend: (legendId: string) => void;
  /** Toggle all legends of a given class */
  toggleClass: (className: LegendClass) => void;
  /** Toggle all legends */
  toggleAll: () => void;
  /** Execute single legend gacha */
  executeGacha: (userProfile?: Set<string>) => void;
  /** Execute party gacha */
  executePartyGacha: (lineups: Legend[][], partySize: number) => void;
  /** Party gacha result */
  partyResult: Legend[] | null;
  /** Set checks directly (for external control like roulette auto-filter) */
  setChecks: (checks: Map<string, boolean>) => void;
}

/**
 * Hook for managing legend gacha state and operations.
 * Persists legend lineup checks to localStorage.
 */
export function useLegendGacha(): UseLegendGachaReturn {
  // Persist checks as Record<string, boolean> in localStorage
  const [storedChecks, setStoredChecks] = useLocalStorage<Record<string, boolean>>(
    STORAGE_KEY,
    createDefaultChecks()
  );

  // Gacha result state
  const [result, setResult] = useState<Legend | null>(null);
  const [partyResult, setPartyResult] = useLocalStorage<Legend[] | null>('legend-partyResult', null);
  const [error, setError] = useState<string | null>(null);

  // Convert stored Record to Map for external consumers
  const checks = useMemo(() => recordToMap(storedChecks), [storedChecks]);

  // Set checks directly (for roulette auto-filter integration)
  const setChecks = useCallback(
    (newChecks: Map<string, boolean>) => {
      setStoredChecks(mapToRecord(newChecks));
    },
    [setStoredChecks]
  );

  // Toggle a single legend's check state
  const toggleLegend = useCallback(
    (legendId: string) => {
      setStoredChecks((prev) => ({
        ...prev,
        [legendId]: !prev[legendId],
      }));
    },
    [setStoredChecks]
  );

  // Toggle all legends of a given class
  // If all members are checked → uncheck all; otherwise → check all
  const toggleClass = useCallback(
    (className: LegendClass) => {
      setStoredChecks((prev) => {
        const classMembers = filterByClass(LEGENDS, className);
        const allChecked = classMembers.every((legend) => prev[legend.id]);
        const newChecks = { ...prev };
        for (const legend of classMembers) {
          newChecks[legend.id] = !allChecked;
        }
        return newChecks;
      });
    },
    [setStoredChecks]
  );

  // Toggle all legends
  // If all are checked → uncheck all; otherwise → check all
  const toggleAll = useCallback(() => {
    setStoredChecks((prev) => {
      const allChecked = LEGENDS.every((legend) => prev[legend.id]);
      const newChecks: Record<string, boolean> = {};
      for (const legend of LEGENDS) {
        newChecks[legend.id] = !allChecked;
      }
      return newChecks;
    });
  }, [setStoredChecks]);

  // Execute single legend gacha
  const executeGacha = useCallback(
    (userProfile?: Set<string>) => {
      setError(null);
      setPartyResult(null);

      // Build host lineup from checks
      const hostLineup = new Set<string>(
        LEGENDS.filter((l) => storedChecks[l.id]).map((l) => l.id)
      );

      // Determine effective lineup
      const profile = userProfile ?? new Set(LEGENDS.map((l) => l.id));
      const effectiveLineup = getEffectiveLineup(hostLineup, profile, LEGENDS);

      // Validate
      const validation: ValidationResult = validateLegendGacha(effectiveLineup);
      if (!validation.valid) {
        setResult(null);
        setError(validation.error ?? 'Unknown error');
        return;
      }

      // Pick one
      const selected = pickOne(effectiveLineup);
      setResult(selected);
    },
    [storedChecks]
  );

  // Execute party gacha
  const executePartyGacha = useCallback(
    (lineups: Legend[][], partySize: number) => {
      setError(null);
      setResult(null);

      // Validate
      const validation = validatePartyGacha(lineups, partySize);
      if (!validation.valid) {
        setPartyResult(null);
        setError(validation.error ?? 'Unknown error');
        return;
      }

      // Pick party
      try {
        const party = pickParty(lineups, partySize);
        setPartyResult(party);
      } catch (e) {
        setPartyResult(null);
        setError(e instanceof Error ? e.message : 'Unknown error');
      }
    },
    []
  );

  return {
    checks,
    result,
    error,
    toggleLegend,
    toggleClass,
    toggleAll,
    executeGacha,
    executePartyGacha,
    partyResult,
    setChecks,
  };
}
