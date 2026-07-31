import { useMemo, useState } from 'react';
import type { WeaponCategory } from '../../types';
import type { SlotNumber } from '../../hooks/useWeaponGacha';
import { WEAPONS } from '../../data/weapons';
import { CheckboxGroup } from '../shared/CheckboxGroup';
import { ClassGroupCheckbox } from '../shared/ClassGroupCheckbox';
import styles from './WeaponSlotLineup.module.css';

interface WeaponSlotLineupProps {
  slotNumber: SlotNumber;
  checks: Map<string, boolean>;
  onToggleWeapon: (weaponId: string) => void;
  onToggleCategory: (category: WeaponCategory) => void;
}

/** カテゴリの表示順序と日本語名 */
const CATEGORY_ORDER: { category: WeaponCategory; label: string }[] = [
  { category: 'Shotgun', label: 'ショットガン' },
  { category: 'SMG', label: 'サブマシンガン' },
  { category: 'Pistol', label: 'ピストル' },
  { category: 'AR', label: 'アサルトライフル' },
  { category: 'LMG', label: 'ライトマシンガン' },
  { category: 'Marksman', label: 'マークスマン' },
  { category: 'Sniper', label: 'スナイパーライフル' },
];

export function WeaponSlotLineup({ slotNumber, checks, onToggleWeapon, onToggleCategory }: WeaponSlotLineupProps) {
  const [collapsed, setCollapsed] = useState<Set<WeaponCategory>>(new Set());

  /** カテゴリごとにグループ化された武器（checksに含まれる＝非ケアパッケージ武器のみ） */
  const weaponsByCategory = useMemo(() => {
    const grouped = new Map<WeaponCategory, typeof WEAPONS>();
    for (const { category } of CATEGORY_ORDER) {
      const categoryWeapons = WEAPONS.filter(
        (w) => w.category === category && checks.has(w.id)
      );
      grouped.set(category, categoryWeapons);
    }
    return grouped;
  }, [checks]);

  const toggleCollapse = (category: WeaponCategory) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <div className={styles.container} role="region" aria-label={`スロット${slotNumber}ラインナップ`}>
      <h3 className={styles.slotTitle}>スロット{slotNumber}</h3>

      {CATEGORY_ORDER.map(({ category, label }) => {
        const categoryWeapons = weaponsByCategory.get(category) ?? [];

        // カテゴリ内に武器がない場合はスキップ
        if (categoryWeapons.length === 0) return null;

        const memberIds = categoryWeapons.map((w) => w.id);
        const isCollapsed = collapsed.has(category);

        return (
          <div key={category} className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <button
                type="button"
                className={`${styles.collapseButton} ${isCollapsed ? styles.collapsed : ''}`}
                onClick={() => toggleCollapse(category)}
                aria-label={isCollapsed ? `${label}を展開` : `${label}を折りたたむ`}
              >
                ▼
              </button>
              <ClassGroupCheckbox
                groupName={label}
                memberIds={memberIds}
                checks={checks}
                onToggleGroup={() => onToggleCategory(category)}
              />
            </div>
            {!isCollapsed && (
              <CheckboxGroup
                items={categoryWeapons}
                checks={checks}
                onChange={onToggleWeapon}
                groupLabel={`${label}カテゴリの武器`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
