import { useMemo, useCallback } from 'react';
import { useWeaponGacha } from '../../hooks/useWeaponGacha';
import { useGachaAnimation } from '../../hooks/useGachaAnimation';
import { WEAPONS } from '../../data/weapons';
import type { Weapon } from '../../types';
import { WeaponSlotLineup } from './WeaponSlotLineup';
import { WeaponResult } from './WeaponResult';
import { ErrorMessage } from '../shared/ErrorMessage';
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
  } = useWeaponGacha();

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

  const handleComplete = useCallback(() => {
    executeAllSlotsGacha();
  }, [executeAllSlotsGacha]);

  const { displayItem, isAnimating, startAnimation } = useGachaAnimation<Weapon>(
    animationCandidates,
    handleComplete,
    1500
  );

  /** 演出中は仮表示、完了後は確定結果を表示 */
  const shownSlot1 = isAnimating ? displayItem : slot1Result;
  const shownSlot2 = isAnimating ? displayItem : slot2Result;

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
          className={styles.slotButton}
          onClick={() => executeSlotGacha(1)}
          disabled={isSlot1Empty}
          aria-label="スロット1 ガチャ"
        >
          スロット1 ガチャ
        </button>

        <button
          type="button"
          className={styles.slotButton}
          onClick={() => executeSlotGacha(2)}
          disabled={isSlot2Empty}
          aria-label="スロット2 ガチャ"
        >
          スロット2 ガチャ
        </button>

        {showSlot3 && (
          <button
            type="button"
            className={styles.slotButton}
            onClick={() => executeSlotGacha(3)}
            disabled={isSlot3Empty}
            aria-label="スロット3 ガチャ"
          >
            スロット3 ガチャ
          </button>
        )}
      </div>

      <ErrorMessage message={error} />

      <div className={`${styles.resultSection} ${isAnimating ? styles.animating : ''}`}>
        <WeaponResult
          slot1Result={shownSlot1}
          slot2Result={shownSlot2}
          slot3Result={showSlot3 ? slot3Result : undefined}
        />
      </div>

      <div className={styles.lineupSection}>
        <div className={styles.slotsRow}>
          <WeaponSlotLineup
            slotNumber={1}
            checks={slot1Checks}
            onToggleWeapon={(weaponId) => toggleWeapon(1, weaponId)}
            onToggleCategory={(category) => toggleCategory(1, category)}
          />

          <WeaponSlotLineup
            slotNumber={2}
            checks={slot2Checks}
            onToggleWeapon={(weaponId) => toggleWeapon(2, weaponId)}
            onToggleCategory={(category) => toggleCategory(2, category)}
          />
        </div>

        {showSlot3 && (
          <WeaponSlotLineup
            slotNumber={3}
            checks={slot3Checks}
            onToggleWeapon={(weaponId) => toggleWeapon(3, weaponId)}
            onToggleCategory={(category) => toggleCategory(3, category)}
          />
        )}
      </div>
    </div>
  );
}
