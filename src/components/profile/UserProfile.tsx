import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../i18n';
import { LegendLineup } from '../legend/LegendLineup';
import styles from './UserProfile.module.css';

export function UserProfile() {
  const { t } = useTranslation();
  const { profile } = useAppContext();

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{t('profile.title')}</h2>
      <p className={styles.description}>
        {t('profile.description')}
      </p>
      <LegendLineup
        checks={profile.ownedLegends}
        onToggleLegend={profile.toggleLegend}
        onToggleClass={profile.toggleClass}
        onToggleAll={profile.toggleAll}
      />
    </div>
  );
}
