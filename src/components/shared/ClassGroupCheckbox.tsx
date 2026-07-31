import { useRef, useEffect } from 'react';
import styles from './ClassGroupCheckbox.module.css';

interface ClassGroupCheckboxProps {
  groupName: string;
  memberIds: string[];
  checks: Map<string, boolean>;
  onToggleGroup: () => void;
}

export function ClassGroupCheckbox({ groupName, memberIds, checks, onToggleGroup }: ClassGroupCheckboxProps) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  const checkedCount = memberIds.filter(id => checks.get(id) === true).length;
  const allChecked = checkedCount === memberIds.length;
  const noneChecked = checkedCount === 0;
  const isIndeterminate = !allChecked && !noneChecked;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div className={styles.groupHeader}>
      <label className={styles.label}>
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={allChecked}
          onChange={onToggleGroup}
          className={styles.checkbox}
        />
        <span className={styles.groupName}>{groupName}</span>
        <span className={styles.count}>({checkedCount}/{memberIds.length})</span>
      </label>
    </div>
  );
}
