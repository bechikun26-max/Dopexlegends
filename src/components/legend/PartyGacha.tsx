import { useState, useCallback, useRef } from 'react';
import type { Legend } from '../../types';
import { LEGENDS } from '../../data/legends';
import { useTranslation } from '../../i18n';
import { ErrorMessage } from '../shared/ErrorMessage';
import styles from './PartyGacha.module.css';

interface PartyGachaProps {
  /** Function to execute party gacha */
  onExecute: (lineups: Legend[][], partySize: number) => void;
  /** Current party gacha results (null if not executed) */
  partyResult: Legend[] | null;
  /** Error message */
  error: string | null;
  /** Current effective lineup for creating per-member lineups */
  effectiveLineup: Legend[];
}

const PARTY_SIZES = [1, 2, 3] as const;

export function PartyGacha({ onExecute, partyResult, error, effectiveLineup }: PartyGachaProps) {
  const { t } = useTranslation();
  const [partySize, setPartySize] = useState<number>(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayMembers, setDisplayMembers] = useState<Legend[]>([]);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleExecute = useCallback(() => {
    // Create an array of lineups (same lineup for all members for simplicity)
    const lineups = Array.from({ length: partySize }, () => effectiveLineup);
    onExecute(lineups, partySize);
  }, [partySize, effectiveLineup, onExecute]);

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

  return (
    <div className={styles.container}>
      <div className={styles.sizeSelector}>
        <span className={styles.sizeLabel}>{t('partyGacha.partySize')}</span>
        <div className={styles.sizeButtons}>
          {PARTY_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              className={`${styles.sizeButton} ${partySize === size ? styles.sizeButtonActive : ''}`}
              onClick={() => setPartySize(size)}
              aria-pressed={partySize === size}
            >
              {t('partyGacha.personCount', { count: size })}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={`${styles.executeButton} ${isAnimating ? styles.spinning : ''}`}
        onClick={startAnimation}
        disabled={isAnimating}
      >
        {isAnimating ? t('common.drawing') : t('partyGacha.execute')}
      </button>

      <ErrorMessage message={error} />

      {shownMembers && shownMembers.length > 0 && (
        <div className={styles.results}>
          <span className={styles.resultsTitle}>{t('partyGacha.result')}</span>
          <div className={`${styles.memberList} ${isAnimating ? styles.animating : ''}`}>
            {shownMembers.map((legend, index) => (
              <div key={index} className={styles.memberCard}>
                <span className={styles.memberLabel}>{t('partyGacha.member', { index: index + 1 })}</span>
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
    </div>
  );
}
