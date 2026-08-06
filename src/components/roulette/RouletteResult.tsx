import { useTranslation } from '../../i18n';
import type { Rule, RuleCategory } from '../../types';
import styles from './RouletteResult.module.css';

interface RouletteResultProps {
  rule: Rule | null;
}

/** Map rule categories to translation keys */
const CATEGORY_TRANSLATION_KEYS: Record<RuleCategory, string> = {
  LegendClass: 'roulette.ruleCategoryLegendClass',
  WeaponCategory: 'roulette.ruleCategoryWeaponCategory',
  AmmoType: 'roulette.ruleCategoryAmmoType',
};

export function RouletteResult({ rule }: RouletteResultProps) {
  const { t } = useTranslation();

  if (!rule) {
    return null;
  }

  return (
    <div className={styles.result}>
      <span className={styles.name}>{t(`rules.${rule.id}`)}</span>
      <span className={styles.category}>{t(CATEGORY_TRANSLATION_KEYS[rule.category])}</span>
    </div>
  );
}
