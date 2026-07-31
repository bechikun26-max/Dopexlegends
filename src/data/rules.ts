import type { Rule } from '../types';

/** 全18種類の縛りルールマスターデータ */
export const RULES: Rule[] = [
  // レジェンドクラス縛り (5種)
  { id: 'assault-only', name: 'アサルトクラス縛り', category: 'LegendClass', filterValue: 'Assault' },
  { id: 'skirmisher-only', name: 'スカーミッシャークラス縛り', category: 'LegendClass', filterValue: 'Skirmisher' },
  { id: 'recon-only', name: 'リコンクラス縛り', category: 'LegendClass', filterValue: 'Recon' },
  { id: 'support-only', name: 'サポートクラス縛り', category: 'LegendClass', filterValue: 'Support' },
  { id: 'controller-only', name: 'コントローラークラス縛り', category: 'LegendClass', filterValue: 'Controller' },

  // 武器カテゴリ縛り (7種)
  { id: 'shotgun-required', name: '武器1つはショットガン縛り', category: 'WeaponCategory', filterValue: 'Shotgun' },
  { id: 'smg-required', name: '武器1つはサブマシンガン縛り', category: 'WeaponCategory', filterValue: 'SMG' },
  { id: 'pistol-required', name: '武器1つはピストル縛り', category: 'WeaponCategory', filterValue: 'Pistol' },
  { id: 'ar-required', name: '武器1つはアサルトライフル縛り', category: 'WeaponCategory', filterValue: 'AR' },
  { id: 'lmg-required', name: '武器1つはライトマシンガン縛り', category: 'WeaponCategory', filterValue: 'LMG' },
  { id: 'marksman-required', name: '武器1つはマークスマン縛り', category: 'WeaponCategory', filterValue: 'Marksman' },
  { id: 'sniper-required', name: '武器1つはスナイパーライフル縛り', category: 'WeaponCategory', filterValue: 'Sniper' },

  // 弾薬種類縛り (6種)
  { id: 'shotgun-ammo', name: '武器1つはショットガンアモ武器縛り', category: 'AmmoType', filterValue: 'Shotgun' },
  { id: 'light-ammo', name: '武器1つはライトアモ武器縛り', category: 'AmmoType', filterValue: 'Light' },
  { id: 'heavy-ammo', name: '武器1つはヘビーアモ武器縛り', category: 'AmmoType', filterValue: 'Heavy' },
  { id: 'energy-ammo', name: '武器1つはエネルギー武器縛り', category: 'AmmoType', filterValue: 'Energy' },
  { id: 'sniper-ammo', name: '武器1つはスナイパーアモ武器縛り', category: 'AmmoType', filterValue: 'Sniper' },
  { id: 'arrow-ammo', name: '武器1つはアロー武器縛り', category: 'AmmoType', filterValue: 'Arrow' },
];
