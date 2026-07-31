// === レジェンド関連 ===

export type LegendClass = 'Assault' | 'Skirmisher' | 'Recon' | 'Support' | 'Controller';

export interface Legend {
  /** 一意識別子（英語名ベース） */
  id: string;
  /** 表示名（日本語） */
  name: string;
  /** 所属クラス */
  class: LegendClass;
  /** キャラクター画像パス */
  imagePath: string;
  /** バリスティック用フラグ */
  hasThirdWeaponSlot: boolean;
}

// === 武器関連 ===

export type WeaponCategory = 'Shotgun' | 'SMG' | 'Pistol' | 'AR' | 'LMG' | 'Marksman' | 'Sniper';
export type AmmoType = 'Shotgun' | 'Light' | 'Heavy' | 'Energy' | 'Sniper' | 'Arrow';

export interface Weapon {
  /** 一意識別子（英語名ベース） */
  id: string;
  /** 表示名（日本語） */
  name: string;
  /** 武器カテゴリ */
  category: WeaponCategory;
  /** 弾薬種類（C.A.R.は['Light','Heavy']） */
  ammoTypes: AmmoType[];
  /** 武器画像パス */
  imagePath: string;
  /** ケアパッケージ武器フラグ */
  isCarePackage: boolean;
}

// === 縛りルール関連 ===

export type RuleCategory = 'LegendClass' | 'WeaponCategory' | 'AmmoType';

export interface Rule {
  /** 一意識別子 */
  id: string;
  /** ルール表示名（日本語） */
  name: string;
  /** ルールカテゴリ */
  category: RuleCategory;
  /** フィルタ対象値（クラス名/カテゴリ名/弾薬名） */
  filterValue: string;
}

// === フィルタ結果 ===

export interface FilterResult {
  /** レジェンドクラス縛りの場合のチェック状態 */
  legendChecks?: Map<string, boolean>;
  /** 武器カテゴリ/弾薬縛りの場合のSlot1チェック状態 */
  weaponSlot1Checks?: Map<string, boolean>;
  /** Slot2は変更しない（undefined） */
  weaponSlot2Checks?: undefined;
}

// === バリデーション ===

export interface ValidationResult {
  valid: boolean;
  error?: string;
  memberIndex?: number;
}

// === 状態管理 ===

export interface LegendLineupState {
  /** レジェンドID → チェック状態 */
  checks: Map<string, boolean>;
}

export interface WeaponLineupState {
  /** スロット1: 武器ID → チェック状態 */
  slot1Checks: Map<string, boolean>;
  /** スロット2: 武器ID → チェック状態 */
  slot2Checks: Map<string, boolean>;
  /** スロット3（バリスティック用）: 武器ID → チェック状態 */
  slot3Checks: Map<string, boolean>;
}

export interface RouletteState {
  /** 現在のルーレット結果（null = 未実行） */
  currentResult: Rule | null;
  /** 適用トグル状態 */
  isApplied: boolean;
  /** ルーレット実行直前のチェックボックス状態スナップショット */
  preRouletteSnapshot: {
    legendChecks: Map<string, boolean>;
    weaponSlot1Checks: Map<string, boolean>;
  } | null;
}

export interface UserProfile {
  /** ユーザーID（ローカル生成） */
  id: string;
  /** 所持レジェンド: レジェンドID → 所持状態 */
  ownedLegends: Map<string, boolean>;
}

export interface CarePackageState {
  /** 武器ID → ケアパッケージフラグ */
  carePackageFlags: Map<string, boolean>;
}

// === パーティガチャ ===

export interface PartyMember {
  /** 0-based メンバー番号 */
  index: number;
  /** メンバーのプロフィール */
  profile: UserProfile;
}

export interface PartyGachaResult {
  members: {
    memberIndex: number;
    legend: Legend;
  }[];
}

// === localStorage保存形式 ===

export interface StoredState {
  legendLineup: Record<string, boolean>;
  weaponSlot1: Record<string, boolean>;
  weaponSlot2: Record<string, boolean>;
  weaponSlot3: Record<string, boolean>;
  carePackageFlags: Record<string, boolean>;
  profiles: Record<string, { ownedLegends: Record<string, boolean> }>;
  rouletteState: {
    currentResult: Rule | null;
    isApplied: boolean;
    preRouletteSnapshot: {
      legendChecks: Record<string, boolean>;
      weaponSlot1Checks: Record<string, boolean>;
    } | null;
  };
}
