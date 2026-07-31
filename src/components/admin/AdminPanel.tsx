import { useAppContext } from '../../context/AppContext';
import { WEAPONS } from '../../data/weapons';
import { CarePackageManager } from '../weapon/CarePackageManager';
import styles from './AdminPanel.module.css';

/**
 * 管理画面。URLに ?admin=true を付けてアクセス。
 * ケアパッケージ武器のトグル設定を提供する。
 */
export function AdminPanel() {
  const { weaponGacha } = useAppContext();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>⚙️ 管理画面</h2>
        <span className={styles.badge}>ADMIN</span>
      </div>
      <p className={styles.description}>
        ケアパッケージ武器の設定を変更できます。変更は即座にガチャに反映されます。
      </p>

      <CarePackageManager
        weapons={WEAPONS}
        carePackageFlags={weaponGacha.carePackageFlags}
        onToggleCarePackage={weaponGacha.toggleCarePackage}
      />
    </div>
  );
}
