import { useState, useCallback, useRef, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../i18n';
import { LEGENDS } from '../../data/legends';
import type { Legend } from '../../types';
import { LegendLineup } from './LegendLineup';
import { ErrorMessage } from '../shared/ErrorMessage';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import styles from './LegendGacha.module.css';

const PARTY_SIZES = [1, 2, 3] as const;

/** Map error codes to translation keys */
function getErrorTranslationKey(error: string | null): string | null {
  if (!error) return null;
  switch (error) {
    case 'NO_LEGENDS_SELECTED':
      return 'legendGacha.noLegendsError';
    case 'MEMBER_INSUFFICIENT':
      return 'legendGacha.insufficientError';
    default:
      return null;
  }
}

/**
 * レジェンドガチャのメインコンポーネント（ピック候補専用）。
 */
export function LegendGacha() {
  const { legendGacha, effectiveLineup, profile } = useAppContext();
  const { checks, partyResult, error, toggleLegend, toggleClass, toggleAll, executePartyGacha } = legendGacha;
  const { t } = useTranslation();

  /** プロフィールで未所持のレジェンドID */
  const disabledLegendIds = useMemo(() => {
    const ids = new Set<string>();
    for (const l of LEGENDS) {
      if (profile.ownedLegends.get(l.id) !== true) {
        ids.add(l.id);
      }
    }
    return ids;
  }, [profile.ownedLegends]);

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
  const errorKey = getErrorTranslationKey(error);
  const displayError = errorKey ? t(errorKey) : null;

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>{t('legendGacha.title')}</h2>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.executeButton} ${isAnimating ? styles.spinning : ''}`}
          onClick={startAnimation}
          disabled={isAnimating}
          aria-label={t('legendGacha.execute')}
        >
          {isAnimating ? t('common.drawing') : t('legendGacha.execute')}
        </button>

        <span className={styles.sizeLabel}>{t('legendGacha.pickCandidates')}</span>
        <div className={styles.sizeButtons}>
          {PARTY_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              className={`${styles.sizeButton} ${partySize === size ? styles.sizeButtonActive : ''}`}
              onClick={() => setPartySize(size)}
              aria-pressed={partySize === size}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <ErrorMessage message={displayError} />

      {shownMembers && shownMembers.length > 0 && (
        <div className={styles.results}>
          <span className={styles.resultsTitle}>{t('legendGacha.result')}</span>
          <div className={`${styles.memberList} ${isAnimating ? styles.animating : ''}`}>
            {shownMembers.map((legend, index) => (
              <div key={index} className={styles.memberCard}>
                <span className={styles.memberLabel}>{t('legendGacha.candidate', { index: index + 1 })}</span>
                <img
                  src={legend.imagePath}
                  alt={t(`legends.${legend.id}`)}
                  className={styles.memberImage}
                />
                <span className={styles.memberName}>{t(`legends.${legend.id}`)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.lineupSection}>
        <CollapsibleSection title={t('legendGacha.lineupSettings')}>
          <LegendLineup
            checks={checks}
            onToggleLegend={toggleLegend}
            onToggleClass={toggleClass}
            onToggleAll={toggleAll}
            disabledIds={disabledLegendIds}
          />
        </CollapsibleSection>
      </div>
    </div>
  );
}
