import { useCallback } from 'react';
import { useRuleRoulette } from '../../hooks/useRuleRoulette';
import type { RouletteSlot } from '../../hooks/useRuleRoulette';
import { useGachaAnimation } from '../../hooks/useGachaAnimation';
import type { Rule } from '../../types';
import { RouletteResult } from './RouletteResult';
import { RouletteControls } from './RouletteControls';
import styles from './RuleRoulette.module.css';

interface RuleRouletteProps {
  legendChecks: Map<string, boolean>;
  weaponSlot1Checks: Map<string, boolean>;
  weaponSlot2Checks: Map<string, boolean>;
  setLegendChecks: (checks: Map<string, boolean>) => void;
  setWeaponSlot1Checks: (checks: Map<string, boolean>) => void;
  setWeaponSlot2Checks: (checks: Map<string, boolean>) => void;
}

/** A single roulette panel with its own animation, result, and controls */
function RoulettePanel({ slot }: { slot: RouletteSlot }) {
  const handleSpin = useCallback(() => {
    slot.spinSlot();
  }, [slot]);

  const { displayItem, isAnimating, startAnimation } = useGachaAnimation<Rule>(
    slot.rules,
    handleSpin,
    1500
  );

  const shownRule = isAnimating ? displayItem : slot.currentResult;

  return (
    <div className={`${styles.panel} ${!slot.enabled ? styles.panelDisabled : ''}`}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>{slot.title}</h3>
        <label className={styles.enableToggle}>
          <input
            type="checkbox"
            checked={slot.enabled}
            onChange={(e) => slot.toggleEnabled(e.target.checked)}
          />
          <span className={styles.enableLabel}>有効</span>
        </label>
      </div>

      {slot.enabled && (
        <div className={styles.panelBody}>
          <button
            type="button"
            className={`${styles.spinButton} ${isAnimating ? styles.spinning : ''}`}
            onClick={startAnimation}
            disabled={isAnimating}
            aria-label={`${slot.title}ルーレット実行`}
          >
            {isAnimating ? '抽選中...' : '実行'}
          </button>

          <div className={`${styles.resultArea} ${isAnimating ? styles.animating : ''}`}>
            <RouletteResult rule={shownRule} />
          </div>

          <RouletteControls
            hasResult={slot.currentResult !== null}
            isApplied={slot.isApplied}
            onReset={slot.resetSlot}
            onToggleApply={slot.toggleApply}
          />
        </div>
      )}
    </div>
  );
}

/**
 * 3つの独立した縛りルールルーレットを横並びで表示するコンポーネント。
 * - クラス縛り (LegendClass)
 * - 武器1カテゴリ縛り (WeaponCategory → slot1)
 * - 武器2弾薬縛り (AmmoType → slot2)
 */
export function RuleRoulette({
  legendChecks,
  weaponSlot1Checks,
  weaponSlot2Checks,
  setLegendChecks,
  setWeaponSlot1Checks,
  setWeaponSlot2Checks,
}: RuleRouletteProps) {
  const {
    legendClassSlot,
    weaponCategorySlot,
    ammoTypeSlot,
    spinAll,
  } = useRuleRoulette({
    legendChecks,
    weaponSlot1Checks,
    weaponSlot2Checks,
    setLegendChecks,
    setWeaponSlot1Checks,
    setWeaponSlot2Checks,
  });

  const anyEnabled = legendClassSlot.enabled || weaponCategorySlot.enabled || ammoTypeSlot.enabled;

  return (
    <section className={styles.container} aria-label="縛りルールルーレット">
      <div className={styles.header}>
        <h2 className={styles.title}>縛りルールルーレット</h2>
        <button
          type="button"
          className={styles.spinAllButton}
          onClick={spinAll}
          disabled={!anyEnabled}
          aria-label="全ルーレット実行"
        >
          全ルーレット実行
        </button>
      </div>

      <div className={styles.panelGrid}>
        <RoulettePanel slot={legendClassSlot} />
        <RoulettePanel slot={weaponCategorySlot} />
        <RoulettePanel slot={ammoTypeSlot} />
      </div>
    </section>
  );
}
