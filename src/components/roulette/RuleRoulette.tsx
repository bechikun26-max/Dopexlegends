import { useCallback } from 'react';
import { useRuleRoulette } from '../../hooks/useRuleRoulette';
import { useGachaAnimation } from '../../hooks/useGachaAnimation';
import { RULES } from '../../data/rules';
import type { Rule } from '../../types';
import { RouletteResult } from './RouletteResult';
import { RouletteControls } from './RouletteControls';
import styles from './RuleRoulette.module.css';

interface RuleRouletteProps {
  legendChecks: Map<string, boolean>;
  weaponSlot1Checks: Map<string, boolean>;
  setLegendChecks: (checks: Map<string, boolean>) => void;
  setWeaponSlot1Checks: (checks: Map<string, boolean>) => void;
}

/**
 * 縛りルールルーレットメインコンポーネント。
 * ルーレット実行ボタン、結果表示、リセット/適用トグルを提供する。
 *
 * Requirements: 9.1, 9.4, 10.1, 10.2, 10.3, 10.4, 10.5
 */
export function RuleRoulette({
  legendChecks,
  weaponSlot1Checks,
  setLegendChecks,
  setWeaponSlot1Checks,
}: RuleRouletteProps) {
  const {
    currentResult,
    isApplied,
    spinRoulette,
    resetRoulette,
    toggleApply,
  } = useRuleRoulette({ setLegendChecks, setWeaponSlot1Checks });

  const handleSpin = useCallback(() => {
    spinRoulette(legendChecks, weaponSlot1Checks);
  }, [spinRoulette, legendChecks, weaponSlot1Checks]);

  const { displayItem, isAnimating, startAnimation } = useGachaAnimation<Rule>(
    RULES,
    handleSpin,
    1500
  );

  /** 演出中は仮表示、完了後は確定結果を表示 */
  const shownRule = isAnimating ? displayItem : currentResult;

  return (
    <section className={styles.container} aria-label="縛りルールルーレット">
      <h2 className={styles.title}>縛りルールルーレット</h2>

      <button
        type="button"
        className={`${styles.spinButton} ${isAnimating ? styles.spinning : ''}`}
        onClick={startAnimation}
        disabled={isAnimating}
        aria-label="ルーレット実行"
      >
        {isAnimating ? '抽選中...' : 'ルーレット実行'}
      </button>

      <div className={`${styles.resultArea} ${isAnimating ? styles.animating : ''}`}>
        <RouletteResult rule={shownRule} />
      </div>

      <RouletteControls
        hasResult={currentResult !== null}
        isApplied={isApplied}
        onReset={resetRoulette}
        onToggleApply={toggleApply}
      />
    </section>
  );
}
