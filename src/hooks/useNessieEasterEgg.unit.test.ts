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

  it('should evaluate condition when all three slot results are non-null', () => {
    const spy = vi.spyOn(nessieEngine, 'checkNessieCondition').mockReturnValue(false);

    renderHook(() =>
      useNessieEasterEgg(
        partyWithBallistic,
        slot1Checks,
        slot2Checks,
        carePackageFlags,
        mockWeapon,
        mockWeapon,
        mockWeapon
      )
    );

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should set isPlaying=true and increment animationKey when condition is met', () => {
    vi.spyOn(nessieEngine, 'checkNessieCondition').mockReturnValue(true);

    const { result } = renderHook(() =>
      useNessieEasterEgg(
        partyWithBallistic,
        slot1Checks,
        slot2Checks,
        carePackageFlags,
        mockWeapon,
        mockWeapon,
        mockWeapon
      )
    );

    expect(result.current.isPlaying).toBe(true);
    expect(result.current.animationKey).toBe(1);

    vi.restoreAllMocks();
  });

  it('should not set isPlaying when condition is not met', () => {
    vi.spyOn(nessieEngine, 'checkNessieCondition').mockReturnValue(false);

    const { result } = renderHook(() =>
      useNessieEasterEgg(
        partyWithBallistic,
        slot1Checks,
        slot2Checks,
        carePackageFlags,
        mockWeapon,
        mockWeapon2,
        mockWeapon
      )
    );

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.animationKey).toBe(0);

    vi.restoreAllMocks();
  });

  it('should set isPlaying=false when onAnimationEnd is called', () => {
    vi.spyOn(nessieEngine, 'checkNessieCondition').mockReturnValue(true);

    const { result } = renderHook(() =>
      useNessieEasterEgg(
        partyWithBallistic,
        slot1Checks,
        slot2Checks,
        carePackageFlags,
        mockWeapon,
        mockWeapon,
        mockWeapon
      )
    );

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.onAnimationEnd();
    });

    expect(result.current.isPlaying).toBe(false);

    vi.restoreAllMocks();
  });

  it('should re-trigger by incrementing animationKey when condition is met again', () => {
    vi.spyOn(nessieEngine, 'checkNessieCondition').mockReturnValue(true);

    const weapon1 = { ...mockWeapon };
    const weapon2 = { ...mockWeapon };

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
          slot1: weapon1 as Weapon | null,
          slot2: weapon1 as Weapon | null,
          slot3: weapon1 as Weapon | null,
        },
      }
    );

    expect(result.current.isPlaying).toBe(true);
    expect(result.current.animationKey).toBe(1);

    // Re-trigger with different weapon reference (simulates new gacha result)
    rerender({
      slot1: weapon2,
      slot2: weapon2,
      slot3: weapon2,
    });

    expect(result.current.isPlaying).toBe(true);
    expect(result.current.animationKey).toBe(2);

    vi.restoreAllMocks();
  });

  it('should re-trigger during active animation (Requirement 4.2)', () => {
    vi.spyOn(nessieEngine, 'checkNessieCondition').mockReturnValue(true);

    const weapon1 = { ...mockWeapon };
    const weapon2 = { ...mockWeapon };

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
          slot1: weapon1 as Weapon | null,
          slot2: weapon1 as Weapon | null,
          slot3: weapon1 as Weapon | null,
        },
      }
    );

    // Animation is playing
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.animationKey).toBe(1);

    // Do NOT call onAnimationEnd — still playing — re-trigger
    rerender({
      slot1: weapon2,
      slot2: weapon2,
      slot3: weapon2,
    });

    // Should still be playing but with a new key (forces remount)
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.animationKey).toBe(2);

    vi.restoreAllMocks();
  });
});
