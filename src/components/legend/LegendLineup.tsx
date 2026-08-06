import { useRef, useEffect, useMemo } from 'react';
import type { LegendClass } from '../../types';
import { LEGENDS } from '../../data/legends';
import { CheckboxGroup } from '../shared/CheckboxGroup';
import { ClassGroupCheckbox } from '../shared/ClassGroupCheckbox';
import { useTranslation } from '../../i18n';
import styles from './LegendLineup.module.css';

interface LegendLineupProps {
  checks: Map<string, boolean>;
  onToggleLegend: (legendId: string) => void;
  onToggleClass: (className: LegendClass) => void;
  onToggleAll: () => void;
  disabledIds?: Set<string>;
}

/** クラスの表示順序 */
const CLASS_ORDER: LegendClass[] = [
  'Assault',
  'Skirmisher',
  'Recon',
  'Support',
  'Controller',
];

export function LegendLineup({ checks, onToggleLegend, onToggleClass, onToggleAll, disabledIds }: LegendLineupProps) {
  const { t } = useTranslation();
  const selectAllRef = useRef<HTMLInputElement>(null);

  /** クラスごとにグループ化されたレジェンド */
  const legendsByClass = useMemo(() => {
    const grouped = new Map<LegendClass, typeof LEGENDS>();
    for (const legendClass of CLASS_ORDER) {
      grouped.set(legendClass, LEGENDS.filter(l => l.class === legendClass));
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
    <div className={styles.container} role="region" aria-label={t('legendGacha.lineupAriaLabel')}>
      {/* 全選択チェックボックス */}
      <label className={styles.selectAll}>
        <input
          ref={selectAllRef}
          type="checkbox"
          checked={allChecked}
          onChange={onToggleAll}
          className={styles.selectAllCheckbox}
          aria-label={t('legendGacha.selectAllLegends')}
        />
        <span className={styles.selectAllLabel}>{t('common.selectAllCount', { checked: totalChecked, total: LEGENDS.length })}</span>
      </label>

      {/* クラスごとのグループ */}
      {CLASS_ORDER.map((legendClass) => {
        const classLegends = legendsByClass.get(legendClass) ?? [];
        const memberIds = classLegends.map(l => l.id);
        const className = t(`classes.${legendClass}`);
        const translatedLegends = classLegends.map(l => ({
          ...l,
          name: t(`legends.${l.id}`),
        }));

        return (
          <div key={legendClass} className={styles.classSection}>
            <ClassGroupCheckbox
              groupName={className}
              memberIds={memberIds}
              checks={checks}
              onToggleGroup={() => onToggleClass(legendClass)}
            />
            <CheckboxGroup
              items={translatedLegends}
              checks={checks}
              onChange={onToggleLegend}
              groupLabel={t('legendGacha.classLegendsGroup', { className })}
              disabledIds={disabledIds}
            />
          </div>
        );
      })}
    </div>
  );
}
