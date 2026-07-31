import type { Legend } from '../../types';
import styles from './LegendResult.module.css';

interface LegendResultProps {
  legend: Legend | null;
}

/** クラス名の日本語表示マッピング */
const CLASS_LABELS: Record<string, string> = {
  Assault: 'アサルト',
  Skirmisher: 'スカーミッシャー',
  Recon: 'リコン',
  Support: 'サポート',
  Controller: 'コントローラー',
};

export function LegendResult({ legend }: LegendResultProps) {
  if (!legend) {
    return null;
  }

  return (
    <div className={styles.result}>
      <img
        src={legend.imagePath}
        alt={legend.name}
        className={styles.image}
      />
      <div className={styles.info}>
        <span className={styles.name}>{legend.name}</span>
        <span className={styles.className}>
          {CLASS_LABELS[legend.class] ?? legend.class}
        </span>
      </div>
    </div>
  );
}
