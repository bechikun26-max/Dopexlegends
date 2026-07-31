import type { Rule, RuleCategory } from '../../types';
import styles from './RouletteResult.module.css';

interface RouletteResultProps {
  rule: Rule | null;
}

/** ルールカテゴリの日本語表示マッピング */
const CATEGORY_LABELS: Record<RuleCategory, string> = {
  LegendClass: 'レジェンドクラス縛り',
  WeaponCategory: '武器カテゴリ縛り',
  AmmoType: '弾薬種類縛り',
};

export function RouletteResult({ rule }: RouletteResultProps) {
  if (!rule) {
    return null;
  }

  return (
    <div className={styles.result}>
      <span className={styles.name}>{rule.name}</span>
      <span className={styles.category}>{CATEGORY_LABELS[rule.category]}</span>
    </div>
  );
}
