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
  if (!hasResult) {
    return null;
  }

  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.resetButton}
        onClick={onReset}
        aria-label="リセット"
      >
        リセット
      </button>

      <label className={styles.applyToggle}>
        <input
          type="checkbox"
          checked={isApplied}
          onChange={() => onToggleApply(!isApplied)}
        />
        <span className={styles.applyLabel}>適用</span>
      </label>
    </div>
  );
}
