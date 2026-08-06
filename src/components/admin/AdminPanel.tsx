import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../i18n';
import { WEAPONS } from '../../data/weapons';
import { CarePackageManager } from '../weapon/CarePackageManager';
import styles from './AdminPanel.module.css';

/**
 * 管理画面。URLに ?admin=true を付けてアクセス。
 * ケアパッケージ武器のトグル設定を提供する。
 */
export function AdminPanel() {
  const { weaponGacha } = useAppContext();
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>⚙️ {t('admin.title')}</h2>
        <span className={styles.badge}>{t('admin.badge')}</span>
      </div>
      <p className={styles.description}>
        {t('admin.description')}
      </p>

      <CarePackageManager
        weapons={WEAPONS}
        carePackageFlags={weaponGacha.carePackageFlags}
        onToggleCarePackage={weaponGacha.toggleCarePackage}
      />
    </div>
  );
}
