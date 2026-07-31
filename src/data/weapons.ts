import type { Weapon } from '../types';

/** 全29種類の武器マスターデータ */
export const WEAPONS: Weapon[] = [
  // Shotgun (4丁)
  { id: 'eva-8', name: 'EVA-8オート', category: 'Shotgun', ammoTypes: ['Shotgun'], imagePath: '/images/weapons/eva-8.png', isCarePackage: false },
  { id: 'mastiff', name: 'マスティフ', category: 'Shotgun', ammoTypes: ['Shotgun'], imagePath: '/images/weapons/mastiff.png', isCarePackage: false },
  { id: 'mozambique', name: 'モザンビーク', category: 'Shotgun', ammoTypes: ['Shotgun'], imagePath: '/images/weapons/mozambique.png', isCarePackage: false },
  { id: 'peacekeeper', name: 'ピースキーパー', category: 'Shotgun', ammoTypes: ['Shotgun'], imagePath: '/images/weapons/peacekeeper.png', isCarePackage: false },

  // SMG (5丁)
  { id: 'car', name: 'C.A.R.', category: 'SMG', ammoTypes: ['Light', 'Heavy'], imagePath: '/images/weapons/car.png', isCarePackage: false },
  { id: 'alternator', name: 'オルタネーター', category: 'SMG', ammoTypes: ['Light'], imagePath: '/images/weapons/alternator.png', isCarePackage: false },
  { id: 'r-99', name: 'R-99', category: 'SMG', ammoTypes: ['Light'], imagePath: '/images/weapons/r-99.png', isCarePackage: false },
  { id: 'volt', name: 'ボルト', category: 'SMG', ammoTypes: ['Energy'], imagePath: '/images/weapons/volt.png', isCarePackage: false },
  { id: 'prowler', name: 'プラウラー', category: 'SMG', ammoTypes: ['Heavy'], imagePath: '/images/weapons/prowler.png', isCarePackage: false },

  // Pistol (3丁)
  { id: 'p2020', name: 'P2020', category: 'Pistol', ammoTypes: ['Light'], imagePath: '/images/weapons/p2020.png', isCarePackage: false },
  { id: 're-45', name: 'RE-45', category: 'Pistol', ammoTypes: ['Light'], imagePath: '/images/weapons/re-45.png', isCarePackage: false },
  { id: 'wingman', name: 'ウィングマン', category: 'Pistol', ammoTypes: ['Heavy'], imagePath: '/images/weapons/wingman.png', isCarePackage: false },

  // AR (5丁)
  { id: 'r-301', name: 'R-301', category: 'AR', ammoTypes: ['Light'], imagePath: '/images/weapons/r-301.png', isCarePackage: false },
  { id: 'flatline', name: 'フラットライン', category: 'AR', ammoTypes: ['Heavy'], imagePath: '/images/weapons/flatline.png', isCarePackage: false },
  { id: 'havoc', name: 'ハボック', category: 'AR', ammoTypes: ['Energy'], imagePath: '/images/weapons/havoc.png', isCarePackage: false },
  { id: 'hemlok', name: 'ヘムロック', category: 'AR', ammoTypes: ['Heavy'], imagePath: '/images/weapons/hemlok.png', isCarePackage: false },
  { id: 'nemesis', name: 'ネメシス', category: 'AR', ammoTypes: ['Energy'], imagePath: '/images/weapons/nemesis.png', isCarePackage: false },

  // LMG (4丁)
  { id: 'spitfire', name: 'スピットファイア', category: 'LMG', ammoTypes: ['Heavy'], imagePath: '/images/weapons/spitfire.png', isCarePackage: false },
  { id: 'devotion', name: 'ディヴォーション', category: 'LMG', ammoTypes: ['Energy'], imagePath: '/images/weapons/devotion.png', isCarePackage: false },
  { id: 'rampage', name: 'ランページ', category: 'LMG', ammoTypes: ['Heavy'], imagePath: '/images/weapons/rampage.png', isCarePackage: false },
  { id: 'l-star', name: 'L-スター', category: 'LMG', ammoTypes: ['Energy'], imagePath: '/images/weapons/l-star.png', isCarePackage: false },

  // Marksman (4丁)
  { id: 'g7-scout', name: 'G7スカウト', category: 'Marksman', ammoTypes: ['Light'], imagePath: '/images/weapons/g7-scout.png', isCarePackage: false },
  { id: 'triple-take', name: 'トリプルテイク', category: 'Marksman', ammoTypes: ['Energy'], imagePath: '/images/weapons/triple-take.png', isCarePackage: false },
  { id: '30-30-repeater', name: '30-30リピーター', category: 'Marksman', ammoTypes: ['Heavy'], imagePath: '/images/weapons/30-30-repeater.png', isCarePackage: false },
  { id: 'bocek', name: 'ボセック', category: 'Marksman', ammoTypes: ['Arrow'], imagePath: '/images/weapons/bocek.png', isCarePackage: false },

  // Sniper (4丁)
  { id: 'longbow', name: 'ロングボウ', category: 'Sniper', ammoTypes: ['Sniper'], imagePath: '/images/weapons/longbow.png', isCarePackage: false },
  { id: 'charge-rifle', name: 'チャージライフル', category: 'Sniper', ammoTypes: ['Sniper'], imagePath: '/images/weapons/charge-rifle.png', isCarePackage: false },
  { id: 'sentinel', name: 'センチネル', category: 'Sniper', ammoTypes: ['Sniper'], imagePath: '/images/weapons/sentinel.png', isCarePackage: false },
  { id: 'kraber', name: 'クレーバー', category: 'Sniper', ammoTypes: ['Sniper'], imagePath: '/images/weapons/kraber.png', isCarePackage: true },
];
