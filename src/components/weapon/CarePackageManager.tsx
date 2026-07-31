import { useMemo } from 'react';
import type { Weapon, WeaponCategory } from '../../types';
import styles from './CarePackageManager.module.css';

interface CarePackageManagerProps {
  weapons: Weapon[];
  carePackageFlags: Map<string, boolean>;
  onToggleCarePackage: (weaponId: string) => void;
}

/** カテゴリの日本語表示名 */
const CATEGORY_LABELS: Record<WeaponCategory, string> = {
  Shotgun: 'ショットガン',
  SMG: 'サブマシンガン',
  Pistol: 'ピストル',
  AR: 'アサルトライフル',
  LMG: 'ライトマシンガン',
  Marksman: 'マークスマン',
  Sniper: 'スナイパーライフル',
};

/**
 * ケアパッケージ武器管理コンポーネント。
 * ケアパッケージ武器を別セクションに一覧表示し、各武器にトグルUIを提供する。
 * Requirements 8.1, 8.2, 8.3, 8.4, 8.5
 */
export function CarePackageManager({ weapons, carePackageFlags, onToggleCarePackage }: CarePackageManagerProps) {
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
    <div className={styles.container} role="region" aria-label="ケアパッケージ武器管理">
      {/* ケアパッケージ武器セクション */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>ケアパッケージ武器</h3>
        {carePackageWeapons.length === 0 ? (
          <p className={styles.emptyMessage}>ケアパッケージ武器はありません</p>
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
        <h3 className={styles.sectionTitle}>通常武器</h3>
        {normalWeapons.length === 0 ? (
          <p className={styles.emptyMessage}>通常武器はありません</p>
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
  const categoryLabel = CATEGORY_LABELS[weapon.category];
  const ammoLabel = weapon.ammoTypes.join(' / ');

  return (
    <div className={`${styles.weaponRow} ${isCarePackage ? styles.carePackage : ''}`}>
      <div className={styles.weaponInfo}>
        <span className={styles.weaponName}>{weapon.name}</span>
        <span className={styles.weaponMeta}>
          {categoryLabel} ・ {ammoLabel}
        </span>
      </div>
      <label className={styles.toggle} aria-label={`${weapon.name}をケアパッケージに${isCarePackage ? '解除' : '設定'}`}>
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
