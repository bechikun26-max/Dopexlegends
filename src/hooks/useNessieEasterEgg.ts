import { useState, useEffect, useCallback, useRef } from 'react';
import { Legend, Weapon } from '../types';
import { checkNessieCondition } from '../engines/nessieEasterEggEngine';

/**
 * ネッシーイースターエッグの条件監視とアニメーション状態管理を行うカスタムHook。
 *
 * 武器ガチャの全スロット結果が揃ったタイミングで条件を評価し、
 * 条件成立時にアニメーションを発火する。
 *
 * 注意: slot3Result（スリング）が変化したときのみ判定を行う。
 * これにより、slot1/slot2だけ更新されてslot3が前回の結果のまま残っている
 * 中間状態で誤発動することを防ぐ。
 */
export function useNessieEasterEgg(
  partyResult: Legend[] | null,
  slot1Checks: Map<string, boolean>,
  slot2Checks: Map<string, boolean>,
  carePackageFlags: Map<string, boolean>,
  slot1Result: Weapon | null,
  slot2Result: Weapon | null,
  slot3Result: Weapon | null
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const animationKeyRef = useRef(0);
  const [animationKey, setAnimationKey] = useState(0);
  const prevSlot3ResultRef = useRef<Weapon | null>(slot3Result);

  useEffect(() => {
    // Only evaluate when all three slot results are available
    if (slot1Result === null || slot2Result === null || slot3Result === null) {
      prevSlot3ResultRef.current = slot3Result;
      return;
    }

    // Only evaluate when slot3Result has actually changed.
    // This prevents false triggers when slot1/slot2 are updated but slot3
    // still holds a stale result from a previous gacha execution.
    const slot3Changed = prevSlot3ResultRef.current !== slot3Result;
    prevSlot3ResultRef.current = slot3Result;

    if (!slot3Changed) {
      return;
    }

    const conditionMet = checkNessieCondition({
      partyResult,
      slot1Checks,
      slot2Checks,
      carePackageFlags,
      slot1Result,
      slot2Result,
      slot3Result,
    });

    if (conditionMet) {
      // Increment animation key to force remount/restart even during active animation
      animationKeyRef.current += 1;
      setAnimationKey(animationKeyRef.current);
      setIsPlaying(true);
    }
  }, [slot1Result, slot2Result, slot3Result, partyResult, slot1Checks, slot2Checks, carePackageFlags]);

  const onAnimationEnd = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return { isPlaying, onAnimationEnd, animationKey };
}
