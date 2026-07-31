import { useMemo, useCallback } from 'react';
import type { LegendClass } from '../../types';
import { LEGENDS } from '../../data/legends';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LegendLineup } from '../legend/LegendLineup';
import { recordToMap } from '../../utils/storage';
import { filterByClass } from '../../utils/filter';
import styles from './UserProfile.module.css';

const STORAGE_KEY = 'user-profile-owned-legends';

function createDefaultOwned(): Record<string, boolean> {
  const record: Record<string, boolean> = {};
  for (const legend of LEGENDS) {
    record[legend.id] = true;
  }
  return record;
}

export function UserProfile() {
  const [ownedRecord, setOwnedRecord] = useLocalStorage<Record<string, boolean>>(
    STORAGE_KEY,
    createDefaultOwned()
  );

  const checks = useMemo(() => recordToMap(ownedRecord), [ownedRecord]);

  const toggleLegend = useCallback((legendId: string) => {
    setOwnedRecord(prev => ({ ...prev, [legendId]: !prev[legendId] }));
  }, [setOwnedRecord]);

  const toggleClass = useCallback((className: LegendClass) => {
    setOwnedRecord(prev => {
      const classMembers = filterByClass(LEGENDS, className);
      const allChecked = classMembers.every(l => prev[l.id]);
      const newRecord = { ...prev };
      for (const l of classMembers) {
        newRecord[l.id] = !allChecked;
      }
      return newRecord;
    });
  }, [setOwnedRecord]);

  const toggleAll = useCallback(() => {
    setOwnedRecord(prev => {
      const allChecked = LEGENDS.every(l => prev[l.id]);
      const newRecord: Record<string, boolean> = {};
      for (const l of LEGENDS) {
        newRecord[l.id] = !allChecked;
      }
      return newRecord;
    });
  }, [setOwnedRecord]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>プロフィール - 所持レジェンド</h2>
      <p className={styles.description}>
        所持しているレジェンドにチェックを入れてください。未所持のレジェンドはガチャ対象から除外されます。
      </p>
      <LegendLineup
        checks={checks}
        onToggleLegend={toggleLegend}
        onToggleClass={toggleClass}
        onToggleAll={toggleAll}
      />
    </div>
  );
}
