import { useCallback, useMemo } from 'react';
import type { Weapon, WeaponCategory, ValidationResult } from '../types';
import { WEAPONS } from '../data/weapons';
import {
  pickWeapon,
  pickAllSlots,
  getEffectiveWeaponLineup,
  validateWeaponGacha,
} from '../engines/weaponGachaEngine';
import { useLocalStorage } from './useLocalStorage';
import { mapToRecord, recordToMap } from '../utils/storage';
import { filterByCategory } from '../utils/filter';

// === Types ===

export type SlotNumber = 1 | 2 | 3;

export interface WeaponGachaState {
  slot1Checks: Map<string, boolean>;
  slot2Checks: Map<string, boolean>;
  slot3Checks: Map<string, boolean>;
  carePackageFlags: Map<string, boolean>;
  slot1Result: Weapon | null;
  slot2Result: Weapon | null;
  slot3Result: Weapon | null;
  error: string | null;
}

export interface UseWeaponGachaReturn {
  slot1Checks: Map<string, boolean>;
  slot2Checks: Map<string, boolean>;
  slot3Checks: Map<string, boolean>;
  carePackageFlags: Map<string, boolean>;
  slot1Result: Weapon | null;
  slot2Result: Weapon | null;
  slot3Result: Weapon | null;
  error: string | null;
  toggleWeapon: (slot: SlotNumber, weaponId: string) => void;
  toggleCategory: (slot: SlotNumber, category: WeaponCategory) => void;
  executeSlotGacha: (slot: SlotNumber) => void;
  executeAllSlotsGacha: () => void;
  toggleCarePackage: (weaponId: string) => void;
  setSlot1Checks: (checks: Map<string, boolean>) => void;
  setSlot2Checks: (checks: Map<string, boolean>) => void;
  setSlot3Checks: (checks: Map<string, boolean>) => void;
  setSlot3Result: (result: Weapon | null) => void;
}

// === Helpers ===

/** Build initial checks: all non-care-package weapons set to true */
function buildInitialChecks(): Record<string, boolean> {
  const record: Record<string, boolean> = {};
  for (const weapon of WEAPONS) {
    if (!weapon.isCarePackage) {
      record[weapon.id] = true;
    }
  }
  return record;
}

/** Build initial care package flags from the static data */
function buildInitialCarePackageFlags(): Record<string, boolean> {
  const record: Record<string, boolean> = {};
  for (const weapon of WEAPONS) {
    record[weapon.id] = weapon.isCarePackage;
  }
  return record;
}

// === Hook ===

export function useWeaponGacha(): UseWeaponGachaReturn {
  // Persisted state as Records (JSON-serializable)
  const [slot1ChecksRecord, setSlot1ChecksRecord] = useLocalStorage<Record<string, boolean>>(
    'weaponSlot1',
    buildInitialChecks()
  );
  const [slot2ChecksRecord, setSlot2ChecksRecord] = useLocalStorage<Record<string, boolean>>(
    'weaponSlot2',
    buildInitialChecks()
  );
  const [slot3ChecksRecord, setSlot3ChecksRecord] = useLocalStorage<Record<string, boolean>>(
    'weaponSlot3',
    buildInitialChecks()
  );
  const [carePackageFlagsRecord, setCarePackageFlagsRecord] = useLocalStorage<Record<string, boolean>>(
    'carePackageFlags',
    buildInitialCarePackageFlags()
  );

  // Gacha results (not persisted)
  const [slot1Result, setSlot1Result] = useLocalStorage<Weapon | null>('weaponSlot1Result', null);
  const [slot2Result, setSlot2Result] = useLocalStorage<Weapon | null>('weaponSlot2Result', null);
  const [slot3Result, setSlot3Result] = useLocalStorage<Weapon | null>('weaponSlot3Result', null);
  const [error, setError] = useLocalStorage<string | null>('weaponGachaError', null);

  // Convert Records to Maps for use
  const slot1Checks = useMemo(() => recordToMap(slot1ChecksRecord), [slot1ChecksRecord]);
  const slot2Checks = useMemo(() => recordToMap(slot2ChecksRecord), [slot2ChecksRecord]);
  const slot3Checks = useMemo(() => recordToMap(slot3ChecksRecord), [slot3ChecksRecord]);
  const carePackageFlags = useMemo(() => recordToMap(carePackageFlagsRecord), [carePackageFlagsRecord]);

  // Helper: get the setter for a slot
  const getSlotSetter = useCallback(
    (slot: SlotNumber) => {
      switch (slot) {
        case 1:
          return setSlot1ChecksRecord;
        case 2:
          return setSlot2ChecksRecord;
        case 3:
          return setSlot3ChecksRecord;
      }
    },
    [setSlot1ChecksRecord, setSlot2ChecksRecord, setSlot3ChecksRecord]
  );

  // Helper: get the checks record for a slot
  const getSlotChecksRecord = useCallback(
    (slot: SlotNumber) => {
      switch (slot) {
        case 1:
          return slot1ChecksRecord;
        case 2:
          return slot2ChecksRecord;
        case 3:
          return slot3ChecksRecord;
      }
    },
    [slot1ChecksRecord, slot2ChecksRecord, slot3ChecksRecord]
  );

  // === Actions ===

  /** Toggle a single weapon in a specific slot */
  const toggleWeapon = useCallback(
    (slot: SlotNumber, weaponId: string) => {
      const setter = getSlotSetter(slot);
      const currentRecord = getSlotChecksRecord(slot);
      const newRecord = { ...currentRecord };
      newRecord[weaponId] = !newRecord[weaponId];
      setter(newRecord);
      setError(null);
    },
    [getSlotSetter, getSlotChecksRecord, setError]
  );

  /** Toggle all weapons in a category for a specific slot.
   *  If all category members are checked → uncheck all.
   *  Otherwise → check all.
   */
  const toggleCategory = useCallback(
    (slot: SlotNumber, category: WeaponCategory) => {
      const setter = getSlotSetter(slot);
      const currentRecord = getSlotChecksRecord(slot);
      const categoryWeapons = filterByCategory(WEAPONS, category);

      // Determine if all are currently checked
      const allChecked = categoryWeapons.every(
        (w) => currentRecord[w.id] === true
      );

      const newRecord = { ...currentRecord };
      for (const weapon of categoryWeapons) {
        // Only toggle weapons that are in the record (not care package excluded)
        if (weapon.id in newRecord) {
          newRecord[weapon.id] = !allChecked;
        }
      }
      setter(newRecord);
      setError(null);
    },
    [getSlotSetter, getSlotChecksRecord, setError]
  );

  /** Toggle care package flag for a weapon.
   *  When toggling TO care package (flag→true): remove weapon from all slots.
   *  When toggling FROM care package (flag→false): add weapon to all slots unchecked.
   */
  const toggleCarePackage = useCallback(
    (weaponId: string) => {
      const currentFlag = carePackageFlagsRecord[weaponId] ?? false;
      const newFlag = !currentFlag;

      // Update care package flags
      const newFlags = { ...carePackageFlagsRecord };
      newFlags[weaponId] = newFlag;
      setCarePackageFlagsRecord(newFlags);

      if (newFlag) {
        // Toggling TO care package: remove weapon from all slot lineups
        const newSlot1 = { ...slot1ChecksRecord };
        const newSlot2 = { ...slot2ChecksRecord };
        const newSlot3 = { ...slot3ChecksRecord };
        delete newSlot1[weaponId];
        delete newSlot2[weaponId];
        delete newSlot3[weaponId];
        setSlot1ChecksRecord(newSlot1);
        setSlot2ChecksRecord(newSlot2);
        setSlot3ChecksRecord(newSlot3);
      } else {
        // Toggling FROM care package: add weapon to all slots unchecked
        const newSlot1 = { ...slot1ChecksRecord };
        const newSlot2 = { ...slot2ChecksRecord };
        const newSlot3 = { ...slot3ChecksRecord };
        newSlot1[weaponId] = false;
        newSlot2[weaponId] = false;
        newSlot3[weaponId] = false;
        setSlot1ChecksRecord(newSlot1);
        setSlot2ChecksRecord(newSlot2);
        setSlot3ChecksRecord(newSlot3);
      }
    },
    [
      carePackageFlagsRecord,
      setCarePackageFlagsRecord,
      slot1ChecksRecord,
      slot2ChecksRecord,
      slot3ChecksRecord,
      setSlot1ChecksRecord,
      setSlot2ChecksRecord,
      setSlot3ChecksRecord,
    ]
  );

  /** Execute gacha for a single slot */
  const executeSlotGacha = useCallback(
    (slot: SlotNumber) => {
      const checksMap = slot === 1 ? slot1Checks : slot === 2 ? slot2Checks : slot3Checks;
      const lineup = getEffectiveWeaponLineup(checksMap, carePackageFlags, WEAPONS);

      if (lineup.length === 0) {
        setError(`スロット${slot}に最低1丁の武器を選択してください`);
        return;
      }

      const result = pickWeapon(lineup);
      if (slot === 1) setSlot1Result(result);
      else if (slot === 2) setSlot2Result(result);
      else setSlot3Result(result);
      setError(null);
    },
    [slot1Checks, slot2Checks, slot3Checks, carePackageFlags, setSlot1Result, setSlot2Result, setSlot3Result, setError]
  );

  /** Execute gacha for slot 1 and slot 2 together */
  const executeAllSlotsGacha = useCallback(() => {
    const slot1Lineup = getEffectiveWeaponLineup(slot1Checks, carePackageFlags, WEAPONS);
    const slot2Lineup = getEffectiveWeaponLineup(slot2Checks, carePackageFlags, WEAPONS);

    const validation: ValidationResult = validateWeaponGacha(slot1Lineup, slot2Lineup);
    if (!validation.valid) {
      if (validation.error === 'SLOT1_EMPTY') {
        setError('スロット1に最低1丁の武器を選択してください');
      } else if (validation.error === 'SLOT2_EMPTY') {
        setError('スロット2に最低1丁の武器を選択してください');
      }
      return;
    }

    const [weapon1, weapon2] = pickAllSlots(slot1Lineup, slot2Lineup);
    setSlot1Result(weapon1);
    setSlot2Result(weapon2);
    setError(null);
  }, [slot1Checks, slot2Checks, carePackageFlags, setSlot1Result, setSlot2Result, setError]);

  // Expose setters for external state manipulation (e.g., roulette auto-filter)
  const setSlot1ChecksExternal = useCallback(
    (checks: Map<string, boolean>) => {
      setSlot1ChecksRecord(mapToRecord(checks));
    },
    [setSlot1ChecksRecord]
  );

  const setSlot2ChecksExternal = useCallback(
    (checks: Map<string, boolean>) => {
      setSlot2ChecksRecord(mapToRecord(checks));
    },
    [setSlot2ChecksRecord]
  );

  const setSlot3ChecksExternal = useCallback(
    (checks: Map<string, boolean>) => {
      setSlot3ChecksRecord(mapToRecord(checks));
    },
    [setSlot3ChecksRecord]
  );

  return {
    slot1Checks,
    slot2Checks,
    slot3Checks,
    carePackageFlags,
    slot1Result,
    slot2Result,
    slot3Result,
    error,
    toggleWeapon,
    toggleCategory,
    executeSlotGacha,
    executeAllSlotsGacha,
    toggleCarePackage,
    setSlot1Checks: setSlot1ChecksExternal,
    setSlot2Checks: setSlot2ChecksExternal,
    setSlot3Checks: setSlot3ChecksExternal,
    setSlot3Result,
  };
}
