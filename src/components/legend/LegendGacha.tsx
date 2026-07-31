import { useState, useCallback, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LEGENDS } from '../../data/legends';
import type { Legend } from '../../types';
import { LegendLineup } from './LegendLineup';
import { ErrorMessage } from '../shared/ErrorMessage';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import styles from './LegendGacha.module.css';

const PARTY_SIZES = [1, 2, 3] as const;

/** Map error codes to user-friendly Japanese messages */
function mapErrorMessage(error: string | null): string | null {
  if (!error) return null;
  switch (error) {
    case 'NO_LEGENDS_SELECTED':
      return '最低1人のレジェンドを選択してください';
    case 'MEMBER_INSUFFICIENT':
      return 'ガチャ対象のレジェンドが不足しています。ラインナップまたはプロフィールの所持レジェンド設定を確認してください';
    default:
      return error;
  }
}

/**
 * レジェンドガチャのメインコンポーネント（パーティピック専用）。
 * パーティ人数選択、ガチャ実行ボタン、結果表示、ラインナップ制御を統合する。
 */
export function LegendGacha() {
  const { legendGacha, effectiveLineup } = useAppContext();
  const { checks, partyResult, error, toggleLegend, toggleClass, toggleAll, executePartyGacha } = legendGacha;

  // Read roulette applied state directly from localStorage
  const [lcApplied] = useLocalStorage<boolean>('roulette-legendClass-applied', false);

  const [partySize, setPartySize] = useState<number>(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayMembers, setDisplayMembers] = useState<Legend[]>([]);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleExecute = useCallback(() => {
    const lineups = Array.from({ length: partySize }, () => effectiveLineup);
    executePartyGacha(lineups, partySize);
  }, [partySize, effectiveLineup, executePartyGacha]);

  const startAnimation = useCallback(() => {
    if (LEGENDS.length === 0 || isAnimating) return;

    setIsAnimating(true);

    // Clear any previous timeouts
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    const duration = 1500;
    const totalSteps = 20;
    let elapsed = 0;

    for (let i = 0; i < totalSteps; i++) {
      const stepDuration = (duration / totalSteps) * (1 + (i / totalSteps) * 3);
      elapsed += stepDuration;

      const timeout = setTimeout(() => {
        // Pick random legends for all member slots simultaneously
        const randomMembers = Array.from({ length: partySize }, () => {
          const randomIndex = Math.floor(Math.random() * LEGENDS.length);
          return LEGENDS[randomIndex];
        });
        setDisplayMembers(randomMembers);

        // On last step, execute the real gacha and stop
        if (i === totalSteps - 1) {
          setTimeout(() => {
            handleExecute();
            setIsAnimating(false);
          }, 100);
        }
      }, elapsed);

      timeoutRefs.current.push(timeout);
    }
  }, [isAnimating, partySize, handleExecute]);

  /** 演出中は仮表示、完了後は確定結果を表示 */
  const shownMembers = isAnimating ? displayMembers : partyResult;
  const displayError = mapErrorMessage(error);

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>レジェンドガチャ</h2>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.executeButton} ${isAnimating ? styles.spinning : ''}`}
          onClick={startAnimation}
          disabled={isAnimating}
          aria-label="パーティガチャ実行"
        >
          {isAnimating ? '抽選中...' : 'パーティガチャ実行'}
        </button>

        <span className={styles.sizeLabel}>パーティ人数:</span>
        <div className={styles.sizeButtons}>
          {PARTY_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              className={`${styles.sizeButton} ${partySize === size ? styles.sizeButtonActive : ''}`}
              onClick={() => setPartySize(size)}
              aria-pressed={partySize === size}
            >
              {size}人
            </button>
          ))}
        </div>
      </div>

      <ErrorMessage message={displayError} />

      {shownMembers && shownMembers.length > 0 && (
        <div className={styles.results}>
          <span className={styles.resultsTitle}>パーティ結果</span>
          <div className={`${styles.memberList} ${isAnimating ? styles.animating : ''}`}>
            {shownMembers.map((legend, index) => (
              <div key={index} className={styles.memberCard}>
                <span className={styles.memberLabel}>メンバー{index + 1}</span>
                <img
                  src={legend.imagePath}
                  alt={legend.name}
                  className={styles.memberImage}
                />
                <span className={styles.memberName}>{legend.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`${styles.lineupSection} ${lcApplied ? styles.highlighted : ''}`}>
        <CollapsibleSection title="レジェンドラインナップ設定">
          <LegendLineup
            checks={checks}
            onToggleLegend={toggleLegend}
            onToggleClass={toggleClass}
            onToggleAll={toggleAll}
          />
        </CollapsibleSection>
      </div>
    </div>
  );
}
