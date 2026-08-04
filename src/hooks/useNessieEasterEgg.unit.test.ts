import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useNessieEasterEgg } from './useNessieEasterEgg';
import { Legend, Weapon } from '../types';
import * as nessieEngine from '../engines/nessieEasterEggEngine';

const mockLegendBallistic: Legend = {
  id: 'ballistic',
  name: 'バリスティック',
  class: 'Assault',
  imagePath: '/images/legends/ballistic.png',
  hasThirdWeaponSlot: true,
};

const mockWeapon: Weapon = {
  id: 'r-301',
  name: 'R-301',
  category: 'AR',
  ammoTypes: ['Light'],
  imagePath: '/images/weapons/r-301.png',
  isCarePackage: false,
};

const mockWeapon2: Weapon = {
  id: 'flatline',
  name: 'フラットライン',
  category: 'AR',
  ammoTypes: ['Heavy'],
  imagePath: '/images/weapons/flatline.png',
  isCarePackage: false,
};

// Stable references to avoid infinite re-renders from useEffect dependencies
const slot1Checks = new Map([
  ['r-301', true],
  ['flatline', true],
  ['peacekeeper', true],
]);

const slot2Checks = new Map([
  ['r-301', true],
  ['flatline', true],
  ['peacekeeper', true],
]);

const carePackageFlags = new Map([
  ['r-301', false],
  ['flatline', false],
  ['peacekeeper', false],
]);

const emptyMap = new Map<string, boolean>();
const partyWithBallistic: Legend[] = [mockLegendBallistic];

describe('useNessieEasterEgg', () => {
  it('should initialize with isPlaying=false and animationKey=0', () => {
    const { result } = renderHook(() =>
      useNessieEasterEgg(
        null,
        emptyMap,
        emptyMap,
        emptyMap,
        null,
        null,
        null
      )
    );

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.animationKey).toBe(0);
    expect(typeof result.current.onAnimationEnd).toBe('function');
  });

  it('should not trigger when slot results are null', () => {
    const spy = vi.spyOn(nessieEngine, 'checkNessieCondition');

    renderHook(() =>
      useNessieEasterEgg(
        partyWithBallistic,
        slot1Checks,
        slot2Checks,
        carePackageFlags,
        null,
        null,
        null
      )
    );

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should evaluate condition when all slot results become non-null', () => {
    const spy = vi.spyOn(nessieEngine, 'checkNessieCondition').mockReturnValue(false);

    const { rerender } = renderHook(
      ({ slot1, slot2, slot3 }) =>
        useNessieEasterEgg(
          partyWithBallistic,
          slot1Checks,
          slot2Checks,
          carePackageFlags,
          slot1,
          slot2,
          slot3
        ),
      {
        initialProps: {
          slot1: null as Weapon | null,
          slot2: null as Weapon | null,
          slot3: null as Weapon | null,
        },
      }
    );

    // Simulate gacha execution — all slots get results
    rerender({ slot1: mockWeapon, slot2: mockWeapon, slot3: mockWeapon });

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should set isPlaying=true and increment animationKey when condition is met', () => {
    vi.spyOn(nessieEngine, 'checkNessieCondition').mockReturnValue(true);

    const { result, rerender } = renderHook(
      ({ slot1, slot2, slot3 }) =>
        useNessieEasterEgg(
          partyWithBallistic,
          slot1Checks,
          slot2Checks,
          carePackageFlags,
          slot1,
          slot2,
          slot3
        ),
      {
        initialProps: {
          slot1: null as Weapon | null,
          slot2: null as Weapon | null,
          slot3: null as Weapon | null,
        },
      }
    );

    rerender({ slot1: mockWeapon, slot2: mockWeapon, slot3: mockWeapon });

    expect(result.current.isPlaying).toBe(true);
    expect(result.current.animationKey).toBe(1);

    vi.restoreAllMocks();
  });

  it('should not set isPlaying when condition is not met', () => {
    vi.spyOn(nessieEngine, 'checkNessieCondition').mockReturnValue(false);

    const { result, rerender } = renderHook(
      ({ slot1, slot2, slot3 }) =>
        useNessieEasterEgg(
          partyWithBallistic,
          slot1Checks,
          slot2Checks,
          carePackageFlags,
          slot1,
          slot2,
          slot3
        ),
      {
        initialProps: {
          slot1: null as Weapon | null,
          slot2: null as Weapon | null,
          slot3: null as Weapon | null,
        },
      }
    );

    rerender({ slot1: mockWeapon, slot2: mockWeapon2, slot3: mockWeapon });

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.animationKey).toBe(0);

    vi.restoreAllMocks();
  });

  it('should set isPlaying=false when onAnimationEnd is called', () => {
    vi.spyOn(nessieEngine, 'checkNessieCondition').mockReturnValue(true);

    const { result, rerender } = renderHook(
      ({ slot1, slot2, slot3 }) =>
        useNessieEasterEgg(
          partyWithBallistic,
          slot1Checks,
          slot2Checks,
          carePackageFlags,
          slot1,
          slot2,
          slot3
        ),
      {
        initialProps: {
          slot1: null as Weapon | null,
          slot2: null as Weapon | null,
          slot3: null as Weapon | null,
        },
      }
    );

    rerender({ slot1: mockWeapon, slot2: mockWeapon, slot3: mockWeapon });
    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.onAnimationEnd();
    });

    expect(result.current.isPlaying).toBe(false);

    vi.restoreAllMocks();
  });

  it('should re-trigger by incrementing animationKey when slot results change again', () => {
    vi.spyOn(nessieEngine, 'checkNessieCondition').mockReturnValue(true);

    const weapon1 = { ...mockWeapon };
    const weapon2 = { ...mockWeapon, id: 'r-301' }; // same id but different reference

    const { result, rerender } = renderHook(
      ({ slot1, slot2, slot3 }) =>
        useNessieEasterEgg(
          partyWithBallistic,
          slot1Checks,
          slot2Checks,
          carePackageFlags,
          slot1,
          slot2,
          slot3
        ),
      {
        initialProps: {
          slot1: null as Weapon | null,
          slot2: null as Weapon | null,
          slot3: null as Weapon | null,
        },
      }
    );

    // First trigger
    rerender({ slot1: weapon1, slot2: weapon1, slot3: weapon1 });
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.animationKey).toBe(1);

    // Re-trigger with different references (simulates new gacha result)
    rerender({ slot1: weapon2, slot2: weapon2, slot3: weapon2 });
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.animationKey).toBe(2);

    vi.restoreAllMocks();
  });

  it('should re-trigger during active animation (Requirement 4.2)', () => {
    vi.spyOn(nessieEngine, 'checkNessieCondition').mockReturnValue(true);

    const weapon1 = { ...mockWeapon };
    const weapon2 = { ...mockWeapon, id: 'r-301' }; // different reference

    const { result, rerender } = renderHook(
      ({ slot1, slot2, slot3 }) =>
        useNessieEasterEgg(
          partyWithBallistic,
          slot1Checks,
          slot2Checks,
          carePackageFlags,
          slot1,
          slot2,
          slot3
        ),
      {
        initialProps: {
          slot1: null as Weapon | null,
          slot2: null as Weapon | null,
          slot3: null as Weapon | null,
        },
      }
    );

    // First trigger
    rerender({ slot1: weapon1, slot2: weapon1, slot3: weapon1 });
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.animationKey).toBe(1);

    // Do NOT call onAnimationEnd — still playing — re-trigger with new refs
    rerender({ slot1: weapon2, slot2: weapon2, slot3: weapon2 });
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.animationKey).toBe(2);

    vi.restoreAllMocks();
  });

  it('should not re-trigger when only checks change (not slot results)', () => {
    vi.spyOn(nessieEngine, 'checkNessieCondition').mockReturnValue(true);

    const { result, rerender } = renderHook(
      ({ checks }) =>
        useNessieEasterEgg(
          partyWithBallistic,
          checks,
          slot2Checks,
          carePackageFlags,
          mockWeapon,
          mockWeapon,
          mockWeapon
        ),
      {
        initialProps: {
          checks: slot1Checks,
        },
      }
    );

    // Initial render triggers because slot results are all non-null from the start
    // (this is a valid initial state from localStorage restoration)
    const initialKey = result.current.animationKey;

    // Changing checks should NOT re-trigger
    const newChecks = new Map([['r-301', true], ['flatline', false], ['peacekeeper', true]]);
    rerender({ checks: newChecks });

    // animationKey should not increment on checks change
    expect(result.current.animationKey).toBe(initialKey);

    vi.restoreAllMocks();
  });
});
