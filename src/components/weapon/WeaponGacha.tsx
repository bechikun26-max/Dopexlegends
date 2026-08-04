import { useMemo, useCallback, useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useGachaAnimation } from '../../hooks/useGachaAnimation';
import { WEAPONS } from '../../data/weapons';
import type { Weapon } from '../../types';
import { WeaponSlotLineup } from './WeaponSlotLineup';
import { WeaponResult } from './WeaponResult';
import { ErrorMessage } from '../shared/ErrorMessage';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import styles from './WeaponGacha.module.css';

export interface WeaponGachaProps {
  showSlot3?: boolean;
}

/**
 * 武器ガチャのメインコンポーネント。
 * 全スロットガチャ実行ボタン、個別スロットガチャボタン、
 * 結果表示、ラインナップ制御、エラーメッセージを統合する。
 *
 * showSlot3 プロパティにより、バリスティック選択時にスロット3を表示する。
 *
 * Requirements: 4.1, 4.4, 5.1, 5.2, 5.3, 7.1, 7.2, 7.3, 7.4, 7.5
 */
export function WeaponGacha({ showSlot3 = false }: WeaponGachaProps) {
  const { weaponGacha } = useAppContext();
  const {
    slot1Checks,
    slot2Checks,
    slot3Checks,
    slot1Result,
    slot2Result,
    slot3Result,
    error,
    toggleWeapon,
    toggleCategory,
    executeSlotGacha,
    executeAllSlotsGacha,
    carePackageFlags,
    setSlot1Checks,
    setSlot2Checks,
  } = weaponGacha;

  /** 非ケアパッケージ武器のみ（演出候補） */
  const animationCandidates = useMemo(
    () => WEAPONS.filter((w) => !w.isCarePackage),
    []
  );

  /** スロット1のラインナップが空かどうか */
  const isSlot1Empty = useMemo(() => {
    for (const checked of slot1Checks.values()) {
      if (checked) return false;
    }
    return true;
  }, [slot1Checks]);

  /** スロット2のラインナップが空かどうか */
  const isSlot2Empty = useMemo(() => {
    for (const checked of slot2Checks.values()) {
      if (checked) return false;
    }
    return true;
  }, [slot2Checks]);

  /** スロット3のラインナップが空かどうか */
  const isSlot3Empty = useMemo(() => {
    for (const checked of slot3Checks.values()) {
      if (checked) return false;
    }
    return true;
  }, [slot3Checks]);

  /** 全スロットガチャが実行可能か（スロット1と2両方にラインナップが必要） */
  const isAllSlotsDisabled = isSlot1Empty || isSlot2Empty;

  // --- スリングガチャ用の独自結果管理 ---
  const [slingResult, setSlingResult] = useState<Weapon | null>(slot3Result);

  /** スリングガチャ実行: ケアパケ以外の全武器からランダム1つ */
  const executeSlingGacha = useCallback(() => {
    if (animationCandidates.length === 0) return;
    const randomIndex = Math.floor(Math.random() * animationCandidates.length);
    setSlingResult(animationCandidates[randomIndex]);
  }, [animationCandidates]);

  const handleComplete = useCallback(() => {
    executeAllSlotsGacha();
    if (showSlot3) {
      executeSlingGacha();
    }
  }, [executeAllSlotsGacha, showSlot3, executeSlingGacha]);

  const { displayItem, isAnimating, startAnimation } = useGachaAnimation<Weapon>(
    animationCandidates,
    handleComplete,
    1500
  );

  // --- 個別スロットアニメーション ---
  const [slot1Animating, setSlot1Animating] = useState(false);
  const [slot2Animating, setSlot2Animating] = useState(false);
  const [slot3Animating, setSlot3Animating] = useState(false);
  const [slot1Display, setSlot1Display] = useState<Weapon | null>(null);
  const [slot2Display, setSlot2Display] = useState<Weapon | null>(null);
  const [slot3Display, setSlot3Display] = useState<Weapon | null>(null);
  const slotTimeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const startSlotAnimation = useCallback((slot: 1 | 2 | 3) => {
    if (animationCandidates.length === 0) return;

    const setAnimating = slot === 1 ? setSlot1Animating : slot === 2 ? setSlot2Animating : setSlot3Animating;
    const setDisplay = slot === 1 ? setSlot1Display : slot === 2 ? setSlot2Display : setSlot3Display;

    setAnimating(true);

    // Clear any previous timeouts for this slot
    slotTimeoutRefs.current.forEach(clearTimeout);
    slotTimeoutRefs.current = [];

    const duration = 1500;
    const totalSteps = 20;
    let elapsed = 0;

    for (let i = 0; i < totalSteps; i++) {
      const stepDuration = (duration / totalSteps) * (1 + (i / totalSteps) * 3);
      elapsed += stepDuration;

      const timeout = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * animationCandidates.length);
        setDisplay(animationCandidates[randomIndex]);

        if (i === totalSteps - 1) {
          setTimeout(() => {
            if (slot === 3) {
              // スリングはケアパケ以外全武器からランダム
              executeSlingGacha();
            } else {
              executeSlotGacha(slot);
            }
            setAnimating(false);
          }, 100);
        }
      }, elapsed);

      slotTimeoutRefs.current.push(timeout);
    }
  }, [animationCandidates, executeSlotGacha]);

  /** 演出中は仮表示、完了後は確定結果を表示 */
  const shownSlot1 = isAnimating ? displayItem : slot1Animating ? slot1Display : slot1Result;
  const shownSlot2 = isAnimating ? displayItem : slot2Animating ? slot2Display : slot2Result;
  const shownSlot3 = isAnimating ? displayItem : slot3Animating ? slot3Display : slingResult;

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>武器ガチャ</h2>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.executeAllButton} ${isAnimating ? styles.spinning : ''}`}
          onClick={startAnimation}
          disabled={isAllSlotsDisabled || isAnimating}
          aria-label="全スロットガチャ実行"
        >
          {isAnimating ? '抽選中...' : '全スロットガチャ実行'}
        </button>

        <button
          type="button"
          className={`${styles.slotButton} ${slot1Animating ? styles.spinning : ''}`}
          onClick={() => startSlotAnimation(1)}
          disabled={isSlot1Empty || isAnimating || slot1Animating}
          aria-label="スロット1 ガチャ"
        >
          {slot1Animating ? '抽選中...' : 'スロット1 ガチャ'}
        </button>

        <button
          type="button"
          className={`${styles.slotButton} ${slot2Animating ? styles.spinning : ''}`}
          onClick={() => startSlotAnimation(2)}
          disabled={isSlot2Empty || isAnimating || slot2Animating}
          aria-label="スロット2 ガチャ"
        >
          {slot2Animating ? '抽選中...' : 'スロット2 ガチャ'}
        </button>

        {showSlot3 && (
          <button
            type="button"
            className={`${styles.slotButton} ${slot3Animating ? styles.spinning : ''}`}
            onClick={() => startSlotAnimation(3)}
            disabled={isSlot3Empty || isAnimating || slot3Animating}
            aria-label="スリングガチャ"
          >
            {slot3Animating ? '抽選中...' : 'スリングガチャ'}
          </button>
        )}
      </div>

      <ErrorMessage message={error} />

      <div className={`${styles.resultSection} ${(isAnimating || slot1Animating || slot2Animating || slot3Animating) ? styles.animating : ''}`}>
        <WeaponResult
          slot1Result={shownSlot1}
          slot2Result={shownSlot2}
          slot3Result={showSlot3 ? shownSlot3 : undefined}
        />
      </div>

      <div className={styles.lineupSection}>
        <CollapsibleSection title="武器ラインナップ設定">
          <div className={styles.slotsRow}>
            <WeaponSlotLineup
              slotNumber={1}
              checks={slot1Checks}
              carePackageFlags={carePackageFlags}
              onToggleWeapon={(weaponId) => toggleWeapon(1, weaponId)}
              onToggleCategory={(category) => toggleCategory(1, category)}
              onSetChecks={setSlot1Checks}
            />

            <WeaponSlotLineup
              slotNumber={2}
              checks={slot2Checks}
              carePackageFlags={carePackageFlags}
              onToggleWeapon={(weaponId) => toggleWeapon(2, weaponId)}
              onToggleCategory={(category) => toggleCategory(2, category)}
              onSetChecks={setSlot2Checks}
            />
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
