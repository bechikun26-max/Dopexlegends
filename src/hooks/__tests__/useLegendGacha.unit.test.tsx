import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useLegendGacha } from '../useLegendGacha';
import { LEGENDS } from '../../data/legends';

describe('useLegendGacha', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with all legends checked', () => {
    const { result } = renderHook(() => useLegendGacha());
    const checks = result.current.checks;

    expect(checks.size).toBe(LEGENDS.length);
    for (const legend of LEGENDS) {
      expect(checks.get(legend.id)).toBe(true);
    }
  });

  it('toggleLegend flips the check state of a single legend', () => {
    const { result } = renderHook(() => useLegendGacha());

    act(() => {
      result.current.toggleLegend('bangalore');
    });

    expect(result.current.checks.get('bangalore')).toBe(false);
    // Others remain checked
    expect(result.current.checks.get('revenant')).toBe(true);
  });

  it('toggleClass unchecks all if all class members are checked', () => {
    const { result } = renderHook(() => useLegendGacha());

    // All Assault members start as checked
    act(() => {
      result.current.toggleClass('Assault');
    });

    // All Assault members should now be unchecked
    const assaultLegends = LEGENDS.filter((l) => l.class === 'Assault');
    for (const legend of assaultLegends) {
      expect(result.current.checks.get(legend.id)).toBe(false);
    }

    // Other classes remain checked
    const nonAssaultLegends = LEGENDS.filter((l) => l.class !== 'Assault');
    for (const legend of nonAssaultLegends) {
      expect(result.current.checks.get(legend.id)).toBe(true);
    }
  });

  it('toggleClass checks all if some class members are unchecked', () => {
    const { result } = renderHook(() => useLegendGacha());

    // Uncheck one Assault member first
    act(() => {
      result.current.toggleLegend('bangalore');
    });

    // Now toggle the class — should check all Assault
    act(() => {
      result.current.toggleClass('Assault');
    });

    const assaultLegends = LEGENDS.filter((l) => l.class === 'Assault');
    for (const legend of assaultLegends) {
      expect(result.current.checks.get(legend.id)).toBe(true);
    }
  });

  it('toggleAll unchecks all if all are checked', () => {
    const { result } = renderHook(() => useLegendGacha());

    act(() => {
      result.current.toggleAll();
    });

    for (const legend of LEGENDS) {
      expect(result.current.checks.get(legend.id)).toBe(false);
    }
  });

  it('toggleAll checks all if any are unchecked', () => {
    const { result } = renderHook(() => useLegendGacha());

    // Uncheck one first
    act(() => {
      result.current.toggleLegend('wraith');
    });

    // Toggle all should check all
    act(() => {
      result.current.toggleAll();
    });

    for (const legend of LEGENDS) {
      expect(result.current.checks.get(legend.id)).toBe(true);
    }
  });

  it('executeGacha returns a legend from the checked lineup', () => {
    const { result } = renderHook(() => useLegendGacha());

    act(() => {
      result.current.executeGacha();
    });

    expect(result.current.result).not.toBeNull();
    expect(result.current.error).toBeNull();
    // Should be one of the 28 legends
    expect(LEGENDS.some((l) => l.id === result.current.result!.id)).toBe(true);
  });

  it('executeGacha returns error when no legends are checked', () => {
    const { result } = renderHook(() => useLegendGacha());

    // Uncheck all
    act(() => {
      result.current.toggleAll();
    });

    act(() => {
      result.current.executeGacha();
    });

    expect(result.current.result).toBeNull();
    expect(result.current.error).toBe('NO_LEGENDS_SELECTED');
  });

  it('executeGacha respects user profile filter', () => {
    const { result } = renderHook(() => useLegendGacha());

    // Only own bangalore
    const userProfile = new Set(['bangalore']);

    act(() => {
      result.current.executeGacha(userProfile);
    });

    expect(result.current.result).not.toBeNull();
    expect(result.current.result!.id).toBe('bangalore');
    expect(result.current.error).toBeNull();
  });

  it('executePartyGacha returns unique legends', () => {
    const { result } = renderHook(() => useLegendGacha());

    // All legends available for all members
    const lineups = [LEGENDS, LEGENDS, LEGENDS];

    act(() => {
      result.current.executePartyGacha(lineups, 3);
    });

    expect(result.current.partyResult).not.toBeNull();
    expect(result.current.partyResult!.length).toBe(3);
    expect(result.current.error).toBeNull();

    // All unique
    const ids = result.current.partyResult!.map((l) => l.id);
    expect(new Set(ids).size).toBe(3);
  });

  it('executePartyGacha returns error when lineup is insufficient', () => {
    const { result } = renderHook(() => useLegendGacha());

    // Empty lineups
    const lineups: never[][] = [[], [], []];

    act(() => {
      result.current.executePartyGacha(lineups, 3);
    });

    expect(result.current.partyResult).toBeNull();
    expect(result.current.error).toBe('MEMBER_INSUFFICIENT');
  });

  it('setChecks sets the checks directly', () => {
    const { result } = renderHook(() => useLegendGacha());

    const newChecks = new Map<string, boolean>();
    for (const legend of LEGENDS) {
      newChecks.set(legend.id, false);
    }
    newChecks.set('wraith', true);

    act(() => {
      result.current.setChecks(newChecks);
    });

    expect(result.current.checks.get('wraith')).toBe(true);
    expect(result.current.checks.get('bangalore')).toBe(false);
  });
});
