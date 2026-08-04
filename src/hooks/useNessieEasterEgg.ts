import { useState, useEffect, useCallback, useRef } from 'react';
import { Legend, Weapon } from '../types';
import { checkNessieCondition } from '../engines/nessieEasterEggEngine';

/**
 * ネッシーイースターエッグの条件監視とアニメーション状態管理を行うカスタムHook。
 *
 * 武器ガチャの全スロット結果が揃ったタイミングで条件を評価し、
 * 条件成立時にアニメーションを発火する。
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

  useEffect(() => {
    // Only evaluate when all three slot results are available
    if (slot1Result === null || slot2Result === null || slot3Result === null) {
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
