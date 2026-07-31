import { useRef, useEffect, useMemo } from 'react';
import type { LegendClass } from '../../types';
import { LEGENDS } from '../../data/legends';
import { CheckboxGroup } from '../shared/CheckboxGroup';
import { ClassGroupCheckbox } from '../shared/ClassGroupCheckbox';
import styles from './LegendLineup.module.css';

interface LegendLineupProps {
  checks: Map<string, boolean>;
  onToggleLegend: (legendId: string) => void;
  onToggleClass: (className: LegendClass) => void;
  onToggleAll: () => void;
}

/** クラスの表示順序と日本語名 */
const CLASS_ORDER: { class: LegendClass; label: string }[] = [
  { class: 'Assault', label: 'アサルト' },
  { class: 'Skirmisher', label: 'スカーミッシャー' },
  { class: 'Recon', label: 'リコン' },
  { class: 'Support', label: 'サポート' },
  { class: 'Controller', label: 'コントローラー' },
];

export function LegendLineup({ checks, onToggleLegend, onToggleClass, onToggleAll }: LegendLineupProps) {
  const selectAllRef = useRef<HTMLInputElement>(null);

  /** クラスごとにグループ化されたレジェンド */
  const legendsByClass = useMemo(() => {
    const grouped = new Map<LegendClass, typeof LEGENDS>();
    for (const entry of CLASS_ORDER) {
      grouped.set(entry.class, LEGENDS.filter(l => l.class === entry.class));
    }
    return grouped;
  }, []);

  const totalChecked = useMemo(() => {
    let count = 0;
    for (const checked of checks.values()) {
      if (checked) count++;
    }
    return count;
  }, [checks]);

  const allChecked = totalChecked === LEGENDS.length;
  const noneChecked = totalChecked === 0;
  const isIndeterminate = !allChecked && !noneChecked;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div className={styles.container} role="region" aria-label="レジェンドラインナップ">
      {/* 全選択チェックボックス */}
      <label className={styles.selectAll}>
        <input
          ref={selectAllRef}
          type="checkbox"
          checked={allChecked}
          onChange={onToggleAll}
          className={styles.selectAllCheckbox}
          aria-label="全レジェンドを選択"
        />
        <span className={styles.selectAllLabel}>全選択 ({totalChecked}/{LEGENDS.length})</span>
      </label>

      {/* クラスごとのグループ */}
      {CLASS_ORDER.map(({ class: legendClass, label }) => {
        const classLegends = legendsByClass.get(legendClass) ?? [];
        const memberIds = classLegends.map(l => l.id);

        return (
          <div key={legendClass} className={styles.classSection}>
            <ClassGroupCheckbox
              groupName={label}
              memberIds={memberIds}
              checks={checks}
              onToggleGroup={() => onToggleClass(legendClass)}
            />
            <CheckboxGroup
              items={classLegends}
              checks={checks}
              onChange={onToggleLegend}
              groupLabel={`${label}クラスのレジェンド`}
            />
          </div>
        );
      })}
    </div>
  );
}
