import { useMemo, useState, useRef, useEffect } from 'react';
import type { WeaponCategory } from '../../types';
import type { SlotNumber } from '../../hooks/useWeaponGacha';
import { WEAPONS } from '../../data/weapons';
import { CheckboxGroup } from '../shared/CheckboxGroup';
import { ClassGroupCheckbox } from '../shared/ClassGroupCheckbox';
import styles from './WeaponSlotLineup.module.css';

interface WeaponSlotLineupProps {
  slotNumber: SlotNumber;
  checks: Map<string, boolean>;
  carePackageFlags: Map<string, boolean>;
  onToggleWeapon: (weaponId: string) => void;
  onToggleCategory: (category: WeaponCategory) => void;
  onSetChecks: (checks: Map<string, boolean>) => void;
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

export function WeaponSlotLineup({ slotNumber, checks, carePackageFlags, onToggleWeapon, onToggleCategory, onSetChecks }: WeaponSlotLineupProps) {
  const [collapsed, setCollapsed] = useState<Set<WeaponCategory>>(new Set());
  const [includeCarePackage, setIncludeCarePackage] = useState(false);

  /** ケアパッケージ武器のリスト */
  const carePackageWeapons = useMemo(
    () => WEAPONS.filter((w) => carePackageFlags.get(w.id) === true),
    [carePackageFlags]
  );

  /** カテゴリごとにグループ化された武器 */
  const weaponsByCategory = useMemo(() => {
    const grouped = new Map<WeaponCategory, typeof WEAPONS>();
    for (const { category } of CATEGORY_ORDER) {
      const categoryWeapons = WEAPONS.filter((w) => {
        if (w.category !== category) return false;
        // checksに含まれていない = そもそも管理対象外
        if (!checks.has(w.id)) {
          // ケアパケ武器はchecksに含まれていない場合がある
          // includeCarePackageがONかつケアパケ武器なら表示
          if (includeCarePackage && carePackageFlags.get(w.id) === true) {
            return true;
          }
          return false;
        }
        // 通常武器: ケアパケフラグがtrueなら非表示（includeCarePackageがOFFの場合）
        if (!includeCarePackage && carePackageFlags.get(w.id) === true) {
          return false;
        }
        return true;
      });
      grouped.set(category, categoryWeapons);
    }
    return grouped;
  }, [checks, carePackageFlags, includeCarePackage]);

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
      <h3 className={styles.slotTitle}>{slotNumber === 3 ? 'バリスティック専用スリング' : `スロット${slotNumber}`}</h3>

      {/* ケアパケ武器含めるチェックボックス */}
      {carePackageWeapons.length > 0 && (
        <label className={styles.carePackageToggle}>
          <input
            type="checkbox"
            checked={includeCarePackage}
            onChange={() => setIncludeCarePackage(!includeCarePackage)}
          />
          <span>ケアパケ武器を含める</span>
        </label>
      )}

      {/* 全選択チェックボックス */}
      <SelectAllCheckbox
        checks={checks}
        weaponsByCategory={weaponsByCategory}
        onSetChecks={onSetChecks}
      />

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
                carePackageFlags={carePackageFlags}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** 全選択/全解除チェックボックス */
function SelectAllCheckbox({
  checks,
  weaponsByCategory,
  onSetChecks,
}: {
  checks: Map<string, boolean>;
  weaponsByCategory: Map<WeaponCategory, typeof WEAPONS>;
  onSetChecks: (checks: Map<string, boolean>) => void;
}) {
  const selectAllRef = useRef<HTMLInputElement>(null);

  // 表示中の全武器ID
  const allVisibleIds = useMemo(() => {
    const ids: string[] = [];
    for (const weapons of weaponsByCategory.values()) {
      for (const w of weapons) {
        ids.push(w.id);
      }
    }
    return ids;
  }, [weaponsByCategory]);

  const checkedCount = allVisibleIds.filter((id) => checks.get(id) === true).length;
  const allChecked = allVisibleIds.length > 0 && checkedCount === allVisibleIds.length;
  const noneChecked = checkedCount === 0;
  const isIndeterminate = !allChecked && !noneChecked;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const handleToggleAll = () => {
    // 一括でMapを作り直してセット
    const newChecks = new Map(checks);
    const targetValue = !allChecked; // 全チェック済み→全解除、それ以外→全選択
    for (const id of allVisibleIds) {
      newChecks.set(id, targetValue);
    }
    onSetChecks(newChecks);
  };

  if (allVisibleIds.length === 0) return null;

  return (
    <label className={styles.selectAll}>
      <input
        ref={selectAllRef}
        type="checkbox"
        checked={allChecked}
        onChange={handleToggleAll}
      />
      <span>全選択 ({checkedCount}/{allVisibleIds.length})</span>
    </label>
  );
}
