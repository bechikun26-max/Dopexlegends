import { useCallback, useState, useEffect, useRef } from 'react';
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
function RoulettePanel({ slot, triggerSpin }: { slot: RouletteSlot; triggerSpin: number }) {
  const handleSpin = useCallback(() => {
    slot.spinSlot();
  }, [slot]);

  const { displayItem, isAnimating, startAnimation } = useGachaAnimation<Rule>(
    slot.rules,
    handleSpin,
    1500
  );

  // triggerSpinが変わったら（全ルーレット実行された）アニメーションを開始
  const prevTrigger = useRef(triggerSpin);
  useEffect(() => {
    if (triggerSpin !== prevTrigger.current && slot.enabled) {
      prevTrigger.current = triggerSpin;
      startAnimation();
    }
  }, [triggerSpin, slot.enabled, startAnimation]);

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
  } = useRuleRoulette({
    legendChecks,
    weaponSlot1Checks,
    weaponSlot2Checks,
    setLegendChecks,
    setWeaponSlot1Checks,
    setWeaponSlot2Checks,
  });

  const anyEnabled = legendClassSlot.enabled || weaponCategorySlot.enabled || ammoTypeSlot.enabled;

  // 全ルーレット実行トリガー（インクリメントして各パネルに通知）
  const [spinAllTrigger, setSpinAllTrigger] = useState(0);

  const handleSpinAll = useCallback(() => {
    setSpinAllTrigger((prev) => prev + 1);
  }, []);

  return (
    <section className={styles.container} aria-label="縛りルールルーレット">
      <div className={styles.header}>
        <h2 className={styles.title}>縛りルールルーレット</h2>
        <button
          type="button"
          className={styles.spinAllButton}
          onClick={handleSpinAll}
          disabled={!anyEnabled}
          aria-label="全ルーレット実行"
        >
          全ルーレット実行
        </button>
      </div>

      <div className={styles.panelGrid}>
        <RoulettePanel slot={legendClassSlot} triggerSpin={spinAllTrigger} />
        <RoulettePanel slot={weaponCategorySlot} triggerSpin={spinAllTrigger} />
        <RoulettePanel slot={ammoTypeSlot} triggerSpin={spinAllTrigger} />
      </div>
    </section>
  );
}
