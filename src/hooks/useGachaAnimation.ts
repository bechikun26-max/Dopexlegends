import { useState, useCallback, useRef } from 'react';

/**
 * ガチャ演出フック。
 * ボタンを押すと候補が高速で切り替わり、徐々に減速して最終結果で停止する。
 */
export function useGachaAnimation<T>(
  /** 演出中にランダム表示する候補リスト */
  candidates: T[],
  /** 演出完了後に呼ばれるコールバック（実際のガチャ実行） */
  onComplete: () => void,
  /** 演出時間（ミリ秒） */
  duration: number = 1500
) {
  const [displayItem, setDisplayItem] = useState<T | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const startAnimation = useCallback(() => {
    if (candidates.length === 0 || isAnimating) return;

    setIsAnimating(true);

    // Clear any previous timeouts
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    // Calculate animation steps: start fast, get slower
    const totalSteps = 20;
    let elapsed = 0;

    for (let i = 0; i < totalSteps; i++) {
      // Easing: each step takes longer than the last (exponential slowdown)
      const stepDuration = (duration / totalSteps) * (1 + (i / totalSteps) * 3);
      elapsed += stepDuration;

      const timeout = setTimeout(() => {
        // Pick a random candidate for display
        const randomIndex = Math.floor(Math.random() * candidates.length);
        setDisplayItem(candidates[randomIndex]);

        // On last step, execute the real gacha and stop
        if (i === totalSteps - 1) {
          setTimeout(() => {
            onComplete();
            setIsAnimating(false);
          }, 100);
        }
      }, elapsed);

      timeoutRefs.current.push(timeout);
    }
  }, [candidates, isAnimating, duration, onComplete]);

  return { displayItem, isAnimating, startAnimation };
}
