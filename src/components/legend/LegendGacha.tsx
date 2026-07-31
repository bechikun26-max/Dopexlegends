import { useMemo, useCallback } from 'react';
import { useLegendGacha } from '../../hooks/useLegendGacha';
import { useGachaAnimation } from '../../hooks/useGachaAnimation';
import { LEGENDS } from '../../data/legends';
import type { Legend } from '../../types';
import { LegendLineup } from './LegendLineup';
import { LegendResult } from './LegendResult';
import { ErrorMessage } from '../shared/ErrorMessage';
import styles from './LegendGacha.module.css';

/**
 * レジェンドガチャのメインコンポーネント。
 * ガチャ実行ボタン、スロット風演出、結果表示、ラインナップ制御を統合する。
 */
export function LegendGacha() {
  const {
    checks,
    result,
    error,
    toggleLegend,
    toggleClass,
    toggleAll,
    executeGacha,
  } = useLegendGacha();

  /** チェック済みレジェンドのリスト（演出候補） */
  const checkedLegends = useMemo(() => {
    return LEGENDS.filter((l) => checks.get(l.id) === true);
  }, [checks]);

  /** ラインナップが空かどうかを判定 */
  const isLineupEmpty = checkedLegends.length === 0;

  const handleComplete = useCallback(() => {
    executeGacha();
  }, [executeGacha]);

  const { displayItem, isAnimating, startAnimation } = useGachaAnimation<Legend>(
    checkedLegends,
    handleComplete,
    1500
  );

  /** 演出中は仮表示、完了後は確定結果を表示 */
  const shownLegend = isAnimating ? displayItem : result;

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>レジェンドピックガチャ</h2>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.executeButton} ${isAnimating ? styles.spinning : ''}`}
          onClick={startAnimation}
          disabled={isLineupEmpty || isAnimating}
          aria-label="ガチャ実行"
        >
          {isAnimating ? '抽選中...' : 'ガチャ実行'}
        </button>
      </div>

      <ErrorMessage message={error} />

      <div className={`${styles.resultSection} ${isAnimating ? styles.animating : ''}`}>
        <LegendResult legend={shownLegend} />
      </div>

      <div className={styles.lineupSection}>
        <LegendLineup
          checks={checks}
          onToggleLegend={toggleLegend}
          onToggleClass={toggleClass}
          onToggleAll={toggleAll}
        />
      </div>
    </div>
  );
}
