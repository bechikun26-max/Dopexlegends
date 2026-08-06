import { useMemo } from 'react';
import { useTranslation } from '../../i18n';
import type { Weapon } from '../../types';
import styles from './CarePackageManager.module.css';

interface CarePackageManagerProps {
  weapons: Weapon[];
  carePackageFlags: Map<string, boolean>;
  onToggleCarePackage: (weaponId: string) => void;
}

/**
 * ケアパッケージ武器管理コンポーネント。
 * ケアパッケージ武器を別セクションに一覧表示し、各武器にトグルUIを提供する。
 * Requirements 8.1, 8.2, 8.3, 8.4, 8.5
 */
export function CarePackageManager({ weapons, carePackageFlags, onToggleCarePackage }: CarePackageManagerProps) {
  const { t } = useTranslation();

  /** ケアパッケージ武器（フラグがtrue） */
  const carePackageWeapons = useMemo(
    () => weapons.filter((w) => carePackageFlags.get(w.id) === true),
    [weapons, carePackageFlags]
  );

  /** 通常武器（フラグがfalseまたは未設定） */
  const normalWeapons = useMemo(
    () => weapons.filter((w) => carePackageFlags.get(w.id) !== true),
    [weapons, carePackageFlags]
  );

  return (
    <div className={styles.container} role="region" aria-label={t('admin.carePackageAriaLabel')}>
      {/* ケアパッケージ武器セクション */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('admin.carePackageWeapons')}</h3>
        {carePackageWeapons.length === 0 ? (
          <p className={styles.emptyMessage}>{t('admin.noCarePackageWeapons')}</p>
        ) : (
          carePackageWeapons.map((weapon) => (
            <WeaponToggleRow
              key={weapon.id}
              weapon={weapon}
              isCarePackage={true}
              onToggle={onToggleCarePackage}
            />
          ))
        )}
      </div>

      {/* 通常武器セクション */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('admin.normalWeapons')}</h3>
        {normalWeapons.length === 0 ? (
          <p className={styles.emptyMessage}>{t('admin.noNormalWeapons')}</p>
        ) : (
          normalWeapons.map((weapon) => (
            <WeaponToggleRow
              key={weapon.id}
              weapon={weapon}
              isCarePackage={false}
              onToggle={onToggleCarePackage}
            />
          ))
        )}
      </div>
    </div>
  );
}

/** 個別武器のトグル行 */
function WeaponToggleRow({
  weapon,
  isCarePackage,
  onToggle,
}: {
  weapon: Weapon;
  isCarePackage: boolean;
  onToggle: (weaponId: string) => void;
}) {
  const { t } = useTranslation();
  const weaponName = t(`weapons.${weapon.id}`);
  const categoryLabel = t(`categories.${weapon.category}`);
  const ammoLabel = weapon.ammoTypes.map(ammo => t(`ammoTypes.${ammo}`)).join(' / ');

  return (
    <div className={`${styles.weaponRow} ${isCarePackage ? styles.carePackage : ''}`}>
      <div className={styles.weaponInfo}>
        <span className={styles.weaponName}>{weaponName}</span>
        <span className={styles.weaponMeta}>
          {categoryLabel} ・ {ammoLabel}
        </span>
      </div>
      <label className={styles.toggle} aria-label={isCarePackage ? t('admin.toggleNormal', { weapon: weaponName }) : t('admin.toggleCarePackage', { weapon: weaponName })}>
        <input
          type="checkbox"
          checked={isCarePackage}
          onChange={() => onToggle(weapon.id)}
          aria-checked={isCarePackage}
        />
        <span className={styles.slider} />
      </label>
    </div>
  );
}
