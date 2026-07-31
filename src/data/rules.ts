import type { Rule } from '../types';

/** レジェンドクラス縛りルール (5種) */
export const LEGEND_CLASS_RULES: Rule[] = [
  { id: 'assault-only', name: 'アサルトクラス縛り', category: 'LegendClass', filterValue: 'Assault' },
  { id: 'skirmisher-only', name: 'スカーミッシャークラス縛り', category: 'LegendClass', filterValue: 'Skirmisher' },
  { id: 'recon-only', name: 'リコンクラス縛り', category: 'LegendClass', filterValue: 'Recon' },
  { id: 'support-only', name: 'サポートクラス縛り', category: 'LegendClass', filterValue: 'Support' },
  { id: 'controller-only', name: 'コントローラークラス縛り', category: 'LegendClass', filterValue: 'Controller' },
];

/** 武器カテゴリ縛りルール - スロット1対象 (7種) */
export const WEAPON_CATEGORY_RULES: Rule[] = [
  { id: 'shotgun-required', name: '武器1はショットガン縛り', category: 'WeaponCategory', filterValue: 'Shotgun' },
  { id: 'smg-required', name: '武器1はサブマシンガン縛り', category: 'WeaponCategory', filterValue: 'SMG' },
  { id: 'pistol-required', name: '武器1はピストル縛り', category: 'WeaponCategory', filterValue: 'Pistol' },
  { id: 'ar-required', name: '武器1はアサルトライフル縛り', category: 'WeaponCategory', filterValue: 'AR' },
  { id: 'lmg-required', name: '武器1はライトマシンガン縛り', category: 'WeaponCategory', filterValue: 'LMG' },
  { id: 'marksman-required', name: '武器1はマークスマン縛り', category: 'WeaponCategory', filterValue: 'Marksman' },
  { id: 'sniper-required', name: '武器1はスナイパーライフル縛り', category: 'WeaponCategory', filterValue: 'Sniper' },
];

/** 弾薬種類縛りルール - スロット2対象 (6種) */
export const AMMO_TYPE_RULES: Rule[] = [
  { id: 'shotgun-ammo', name: '武器2はショットガンアモ武器縛り', category: 'AmmoType', filterValue: 'Shotgun' },
  { id: 'light-ammo', name: '武器2はライトアモ武器縛り', category: 'AmmoType', filterValue: 'Light' },
  { id: 'heavy-ammo', name: '武器2はヘビーアモ武器縛り', category: 'AmmoType', filterValue: 'Heavy' },
  { id: 'energy-ammo', name: '武器2はエネルギー武器縛り', category: 'AmmoType', filterValue: 'Energy' },
  { id: 'sniper-ammo', name: '武器2はスナイパーアモ武器縛り', category: 'AmmoType', filterValue: 'Sniper' },
  { id: 'arrow-ammo', name: '武器2はアロー武器縛り', category: 'AmmoType', filterValue: 'Arrow' },
];

/** 全18種類の縛りルール（後方互換） */
export const RULES: Rule[] = [...LEGEND_CLASS_RULES, ...WEAPON_CATEGORY_RULES, ...AMMO_TYPE_RULES];
