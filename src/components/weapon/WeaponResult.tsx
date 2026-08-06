import type { Weapon } from '../../types';
import { useTranslation } from '../../i18n';
import styles from './WeaponResult.module.css';

interface WeaponResultProps {
  slot1Result: Weapon | null;
  slot2Result: Weapon | null;
  slot3Result?: Weapon | null;
}

/** 弾薬種類ごとの背景色 */
const AMMO_COLORS: Record<string, string> = {
  Shotgun: '#8b2020',
  Light: '#8b5e20',
  Heavy: '#1a5c4a',
  Energy: '#4a5c0a',
  Sniper: '#2a2a6b',
  Arrow: '#6b5a0a',
};

/** 武器の弾薬種類に応じた背景スタイルを返す */
function getAmmoBackground(weapon: Weapon): React.CSSProperties {
  if (weapon.ammoTypes.length > 1) {
    // C.A.R. など複数弾薬の場合は斜めグラデーション
    return {
      background: `linear-gradient(135deg, ${AMMO_COLORS[weapon.ammoTypes[0]]} 50%, ${AMMO_COLORS[weapon.ammoTypes[1]]} 50%)`,
    };
  }
  return {
    backgroundColor: AMMO_COLORS[weapon.ammoTypes[0]] || '#16213e',
  };
}

function SlotResult({ weapon, slotNumber }: { weapon: Weapon; slotNumber: number }) {
  const { t } = useTranslation();
  const slotLabel = slotNumber === 3 ? t('weaponGacha.slingLabel') : t('weaponGacha.slotLabel', { number: slotNumber });
  const ariaLabel = slotNumber === 3 ? t('weaponGacha.slingResult') : t('weaponGacha.slotResult', { number: slotNumber });
  return (
    <div
      className={styles.slotResult}
      style={getAmmoBackground(weapon)}
      aria-label={ariaLabel}
    >
      <span className={styles.slotLabel}>{slotLabel}</span>
      <img
        src={weapon.imagePath}
        alt={t(`weapons.${weapon.id}`)}
        className={styles.weaponImage}
      />
      <span className={styles.weaponName}>{t(`weapons.${weapon.id}`)}</span>
      <span className={styles.category}>{t(`categories.${weapon.category}`)}</span>
      <span className={styles.ammoType}>
        {weapon.ammoTypes.map((ammo) => t(`ammoTypes.${ammo}`)).join(' / ')}
      </span>
    </div>
  );
}

export function WeaponResult({ slot1Result, slot2Result, slot3Result }: WeaponResultProps) {
  const { t } = useTranslation();
  const hasAnyResult = slot1Result || slot2Result || slot3Result;

  if (!hasAnyResult) {
    return null;
  }

  return (
    <div className={styles.container} role="region" aria-label={t('weaponGacha.resultAriaLabel')}>
      {slot1Result && <SlotResult weapon={slot1Result} slotNumber={1} />}
      {slot2Result && <SlotResult weapon={slot2Result} slotNumber={2} />}
      {slot3Result && <SlotResult weapon={slot3Result} slotNumber={3} />}
    </div>
  );
}
