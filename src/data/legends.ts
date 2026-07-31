import type { Legend } from '../types';

/** 全28人のレジェンドマスターデータ */
export const LEGENDS: Legend[] = [
  // Assault Class (5人)
  { id: 'bangalore', name: 'バンガロール', class: 'Assault', imagePath: '/images/legends/bangalore.png', hasThirdWeaponSlot: false },
  { id: 'revenant', name: 'レヴナント', class: 'Assault', imagePath: '/images/legends/revenant.png', hasThirdWeaponSlot: false },
  { id: 'fuse', name: 'ヒューズ', class: 'Assault', imagePath: '/images/legends/fuse.png', hasThirdWeaponSlot: false },
  { id: 'mad-maggie', name: 'マッドマギー', class: 'Assault', imagePath: '/images/legends/mad-maggie.png', hasThirdWeaponSlot: false },
  { id: 'ballistic', name: 'バリスティック', class: 'Assault', imagePath: '/images/legends/ballistic.png', hasThirdWeaponSlot: true },

  // Skirmisher Class (7人)
  { id: 'pathfinder', name: 'パスファインダー', class: 'Skirmisher', imagePath: '/images/legends/pathfinder.png', hasThirdWeaponSlot: false },
  { id: 'wraith', name: 'レイス', class: 'Skirmisher', imagePath: '/images/legends/wraith.png', hasThirdWeaponSlot: false },
  { id: 'octane', name: 'オクタン', class: 'Skirmisher', imagePath: '/images/legends/octane.png', hasThirdWeaponSlot: false },
  { id: 'horizon', name: 'ホライゾン', class: 'Skirmisher', imagePath: '/images/legends/horizon.png', hasThirdWeaponSlot: false },
  { id: 'ash', name: 'アッシュ', class: 'Skirmisher', imagePath: '/images/legends/ash.png', hasThirdWeaponSlot: false },
  { id: 'alter', name: 'オルター', class: 'Skirmisher', imagePath: '/images/legends/alter.png', hasThirdWeaponSlot: false },
  { id: 'axel', name: 'アクセル', class: 'Skirmisher', imagePath: '/images/legends/axel.png', hasThirdWeaponSlot: false },

  // Recon Class (6人)
  { id: 'bloodhound', name: 'ブラッドハウンド', class: 'Recon', imagePath: '/images/legends/bloodhound.png', hasThirdWeaponSlot: false },
  { id: 'crypto', name: 'クリプト', class: 'Recon', imagePath: '/images/legends/crypto.png', hasThirdWeaponSlot: false },
  { id: 'valkyrie', name: 'ヴァルキリー', class: 'Recon', imagePath: '/images/legends/valkyrie.png', hasThirdWeaponSlot: false },
  { id: 'seer', name: 'シア', class: 'Recon', imagePath: '/images/legends/seer.png', hasThirdWeaponSlot: false },
  { id: 'vantage', name: 'ヴァンテージ', class: 'Recon', imagePath: '/images/legends/vantage.png', hasThirdWeaponSlot: false },
  { id: 'sparrow', name: 'スパロー', class: 'Recon', imagePath: '/images/legends/sparrow.png', hasThirdWeaponSlot: false },

  // Support Class (6人)
  { id: 'gibraltar', name: 'ジブラルタル', class: 'Support', imagePath: '/images/legends/gibraltar.png', hasThirdWeaponSlot: false },
  { id: 'lifeline', name: 'ライフライン', class: 'Support', imagePath: '/images/legends/lifeline.png', hasThirdWeaponSlot: false },
  { id: 'mirage', name: 'ミラージュ', class: 'Support', imagePath: '/images/legends/mirage.png', hasThirdWeaponSlot: false },
  { id: 'loba', name: 'ローバ', class: 'Support', imagePath: '/images/legends/loba.png', hasThirdWeaponSlot: false },
  { id: 'newcastle', name: 'ニューキャッスル', class: 'Support', imagePath: '/images/legends/newcastle.png', hasThirdWeaponSlot: false },
  { id: 'conduit', name: 'コンジット', class: 'Support', imagePath: '/images/legends/conduit.png', hasThirdWeaponSlot: false },

  // Controller Class (4人)
  { id: 'caustic', name: 'コースティック', class: 'Controller', imagePath: '/images/legends/caustic.png', hasThirdWeaponSlot: false },
  { id: 'wattson', name: 'ワットソン', class: 'Controller', imagePath: '/images/legends/wattson.png', hasThirdWeaponSlot: false },
  { id: 'rampart', name: 'ランパート', class: 'Controller', imagePath: '/images/legends/rampart.png', hasThirdWeaponSlot: false },
  { id: 'catalyst', name: 'カタリスト', class: 'Controller', imagePath: '/images/legends/catalyst.png', hasThirdWeaponSlot: false },
];
