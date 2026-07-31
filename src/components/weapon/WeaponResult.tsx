import type { Weapon, WeaponCategory, AmmoType } from '../../types';
import styles from './WeaponResult.module.css';

interface WeaponResultProps {
  slot1Result: Weapon | null;
  slot2Result: Weapon | null;
  slot3Result?: Weapon | null;
}

/** 武器カテゴリの日本語表示マッピング */
const CATEGORY_LABELS: Record<WeaponCategory, string> = {
  Shotgun: 'ショットガン',
  SMG: 'サブマシンガン',
  Pistol: 'ピストル',
  AR: 'アサルトライフル',
  LMG: 'ライトマシンガン',
  Marksman: 'マークスマン',
  Sniper: 'スナイパーライフル',
};

/** 弾薬種類の日本語表示マッピング */
const AMMO_LABELS: Record<AmmoType, string> = {
  Shotgun: 'ショットガンアモ',
  Light: 'ライトアモ',
  Heavy: 'ヘビーアモ',
  Energy: 'エネルギー',
  Sniper: 'スナイパーアモ',
  Arrow: 'アロー',
};

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
  const slotLabel = slotNumber === 3 ? 'スリング' : `スロット${slotNumber}`;
  return (
    <div
      className={styles.slotResult}
      style={getAmmoBackground(weapon)}
      aria-label={`${slotLabel}の結果`}
    >
      <span className={styles.slotLabel}>{slotLabel}</span>
      <img
        src={weapon.imagePath}
        alt={weapon.name}
        className={styles.weaponImage}
      />
      <span className={styles.weaponName}>{weapon.name}</span>
      <span className={styles.category}>{CATEGORY_LABELS[weapon.category]}</span>
      <span className={styles.ammoType}>
        {weapon.ammoTypes.map((ammo) => AMMO_LABELS[ammo]).join(' / ')}
      </span>
    </div>
  );
}

export function WeaponResult({ slot1Result, slot2Result, slot3Result }: WeaponResultProps) {
  const hasAnyResult = slot1Result || slot2Result || slot3Result;

  if (!hasAnyResult) {
    return null;
  }

  return (
    <div className={styles.container} role="region" aria-label="武器ガチャ結果">
      {slot1Result && <SlotResult weapon={slot1Result} slotNumber={1} />}
      {slot2Result && <SlotResult weapon={slot2Result} slotNumber={2} />}
      {slot3Result && <SlotResult weapon={slot3Result} slotNumber={3} />}
    </div>
  );
}
