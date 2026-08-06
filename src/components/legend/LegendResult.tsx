import type { Legend } from '../../types';
import { useTranslation } from '../../i18n';
import styles from './LegendResult.module.css';

interface LegendResultProps {
  legend: Legend | null;
}

export function LegendResult({ legend }: LegendResultProps) {
  const { t } = useTranslation();

  if (!legend) {
    return null;
  }

  return (
    <div className={styles.result}>
      <img
        src={legend.imagePath}
        alt={t(`legends.${legend.id}`)}
        className={styles.image}
      />
      <div className={styles.info}>
        <span className={styles.name}>{t(`legends.${legend.id}`)}</span>
        <span className={styles.className}>
          {t(`classes.${legend.class}`)}
        </span>
      </div>
    </div>
  );
}
