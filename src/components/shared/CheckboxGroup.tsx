import styles from './CheckboxGroup.module.css';

export interface CheckboxItem {
  id: string;
  name: string;
  imagePath?: string;
  isCarePackage?: boolean;
}

interface CheckboxGroupProps {
  items: CheckboxItem[];
  checks: Map<string, boolean>;
  onChange: (id: string) => void;
  groupLabel?: string;
  /** 無効化されるアイテムIDのセット（プロフィール未所持等） */
  disabledIds?: Set<string>;
  /** 動的ケアパケフラグ（localStorageから取得したもの） */
  carePackageFlags?: Map<string, boolean>;
}

export function CheckboxGroup({ items, checks, onChange, groupLabel, disabledIds, carePackageFlags }: CheckboxGroupProps) {
  return (
    <div className={styles.group} role="group" aria-label={groupLabel}>
      {groupLabel && <span className={styles.groupLabel}>{groupLabel}</span>}
      <div className={styles.items}>
        {items.map((item) => {
          const isDisabled = disabledIds?.has(item.id) ?? false;
          // 動的carePackageFlagsがあればそれを優先、なければ静的isCarePackageを使用
          const isCarePackage = carePackageFlags
            ? (carePackageFlags.get(item.id) === true)
            : (item.isCarePackage ?? false);
          return (
            <label
              key={item.id}
              className={`${styles.item} ${isDisabled ? styles.disabled : ''}`}
            >
              <input
                type="checkbox"
                checked={isDisabled ? false : (checks.get(item.id) ?? false)}
                onChange={() => { if (!isDisabled) onChange(item.id); }}
                disabled={isDisabled}
              />
              {item.imagePath && (
                <img src={item.imagePath} alt={item.name} className={styles.image} />
              )}
              <span className={`${styles.name} ${isCarePackage ? styles.carePackageName : ''}`}>
                {item.name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
