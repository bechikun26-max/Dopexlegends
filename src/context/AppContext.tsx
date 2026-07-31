import { createContext, useContext, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { LegendClass, Legend } from '../types';
import { LEGENDS } from '../data/legends';
import { useLegendGacha } from '../hooks/useLegendGacha';
import type { UseLegendGachaReturn } from '../hooks/useLegendGacha';
import { useWeaponGacha } from '../hooks/useWeaponGacha';
import type { UseWeaponGachaReturn } from '../hooks/useWeaponGacha';
import { useRuleRoulette } from '../hooks/useRuleRoulette';
import type { UseRuleRouletteReturn } from '../hooks/useRuleRoulette';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { recordToMap } from '../utils/storage';
import { getEffectiveLineup } from '../engines/legendGachaEngine';
import { filterByClass } from '../utils/filter';

// === Profile State ===

const PROFILE_STORAGE_KEY = 'user-profile-owned-legends';

function createDefaultOwned(): Record<string, boolean> {
  const record: Record<string, boolean> = {};
  for (const legend of LEGENDS) {
    record[legend.id] = true;
  }
  return record;
}

export interface ProfileState {
  /** Owned legends as Map<legendId, isOwned> */
  ownedLegends: Map<string, boolean>;
  /** Toggle a single legend ownership */
  toggleLegend: (legendId: string) => void;
  /** Toggle all legends in a class */
  toggleClass: (className: LegendClass) => void;
  /** Toggle all legends */
  toggleAll: () => void;
}

// === Context Value ===

export interface AppContextValue {
  legendGacha: UseLegendGachaReturn;
  weaponGacha: UseWeaponGachaReturn;
  roulette: UseRuleRouletteReturn;
  profile: ProfileState;
  /** Effective legend lineup (intersection of host lineup and user profile) */
  effectiveLineup: Legend[];
}

const AppContext = createContext<AppContextValue | null>(null);

// === Provider ===

export function AppProvider({ children }: { children: ReactNode }) {
  // Core hooks
  const legendGacha = useLegendGacha();
  const weaponGacha = useWeaponGacha();

  // Wire roulette to legend/weapon state setters for auto-filter
  const roulette = useRuleRoulette({
    setLegendChecks: legendGacha.setChecks,
    setWeaponSlot1Checks: weaponGacha.setSlot1Checks,
  });

  // Profile state (owned legends)
  const [ownedRecord, setOwnedRecord] = useLocalStorage<Record<string, boolean>>(
    PROFILE_STORAGE_KEY,
    createDefaultOwned()
  );

  const ownedLegends = useMemo(() => recordToMap(ownedRecord), [ownedRecord]);

  const toggleProfileLegend = useCallback(
    (legendId: string) => {
      setOwnedRecord((prev) => ({ ...prev, [legendId]: !prev[legendId] }));
    },
    [setOwnedRecord]
  );

  const toggleProfileClass = useCallback(
    (className: LegendClass) => {
      setOwnedRecord((prev) => {
        const classMembers = filterByClass(LEGENDS, className);
        const allChecked = classMembers.every((l) => prev[l.id]);
        const newRecord = { ...prev };
        for (const l of classMembers) {
          newRecord[l.id] = !allChecked;
        }
        return newRecord;
      });
    },
    [setOwnedRecord]
  );

  const toggleProfileAll = useCallback(() => {
    setOwnedRecord((prev) => {
      const allChecked = LEGENDS.every((l) => prev[l.id]);
      const newRecord: Record<string, boolean> = {};
      for (const l of LEGENDS) {
        newRecord[l.id] = !allChecked;
      }
      return newRecord;
    });
  }, [setOwnedRecord]);

  const profileState: ProfileState = useMemo(
    () => ({
      ownedLegends,
      toggleLegend: toggleProfileLegend,
      toggleClass: toggleProfileClass,
      toggleAll: toggleProfileAll,
    }),
    [ownedLegends, toggleProfileLegend, toggleProfileClass, toggleProfileAll]
  );

  // Compute effective legend lineup: intersection of host lineup (checks) and profile (owned)
  const effectiveLineup = useMemo(() => {
    const hostLineup = new Set<string>(
      LEGENDS.filter((l) => legendGacha.checks.get(l.id)).map((l) => l.id)
    );
    const userProfile = new Set<string>(
      LEGENDS.filter((l) => ownedLegends.get(l.id)).map((l) => l.id)
    );
    return getEffectiveLineup(hostLineup, userProfile, LEGENDS);
  }, [legendGacha.checks, ownedLegends]);

  const contextValue: AppContextValue = useMemo(
    () => ({
      legendGacha,
      weaponGacha,
      roulette,
      profile: profileState,
      effectiveLineup,
    }),
    [legendGacha, weaponGacha, roulette, profileState, effectiveLineup]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// === Consumer Hook ===

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
