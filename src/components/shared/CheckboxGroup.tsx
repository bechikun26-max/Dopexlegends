import styles from './CheckboxGroup.module.css';

export interface CheckboxItem {
  id: string;
  name: string;
  imagePath?: string;
}

interface CheckboxGroupProps {
  items: CheckboxItem[];
  checks: Map<string, boolean>;
  onChange: (id: string) => void;
  groupLabel?: string;
  /** ルーレットで自動選択された武器IDのセット（赤枠ハイライト） */
  highlightedIds?: Set<string>;
}

export function CheckboxGroup({ items, checks, onChange, groupLabel, highlightedIds }: CheckboxGroupProps) {
  return (
    <div className={styles.group} role="group" aria-label={groupLabel}>
      {groupLabel && <span className={styles.groupLabel}>{groupLabel}</span>}
      <div className={styles.items}>
        {items.map((item) => {
          const isHighlighted = highlightedIds?.has(item.id) ?? false;
          return (
            <label
              key={item.id}
              className={`${styles.item} ${isHighlighted ? styles.highlighted : ''}`}
            >
              <input
                type="checkbox"
                checked={checks.get(item.id) ?? false}
                onChange={() => onChange(item.id)}
              />
              {item.imagePath && (
                <img src={item.imagePath} alt={item.name} className={styles.image} />
              )}
              <span className={styles.name}>{item.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
