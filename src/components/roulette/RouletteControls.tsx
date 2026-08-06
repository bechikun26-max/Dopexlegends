import { useTranslation } from '../../i18n';
import styles from './RouletteControls.module.css';

interface RouletteControlsProps {
  hasResult: boolean;
  isApplied: boolean;
  onReset: () => void;
  onToggleApply: (on: boolean) => void;
}

/**
 * ルーレット結果のリセットボタンと適用トグルを表示するコンポーネント。
 * ルーレット結果が存在する場合のみ表示される（Req 11.6）。
 */
export function RouletteControls({
  hasResult,
  isApplied,
  onReset,
  onToggleApply,
}: RouletteControlsProps) {
  const { t } = useTranslation();

  if (!hasResult) {
    return null;
  }

  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.resetButton}
        onClick={onReset}
        aria-label={t('common.reset')}
      >
        {t('common.reset')}
      </button>

      <label className={styles.applyToggle}>
        <input
          type="checkbox"
          checked={isApplied}
          onChange={() => onToggleApply(!isApplied)}
        />
        <span className={styles.applyLabel}>
          {isApplied ? t('common.unapply') : t('common.apply')}
        </span>
      </label>
    </div>
  );
}
