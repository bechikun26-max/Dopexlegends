# Requirements Document

## Introduction

DopexLegendsのApex Legendsガチャシステムに「ネッシーイースターエッグ」を追加する機能。レジェンドガチャで「バリスティック」が選出され、かつ武器ラインナップの絞り込みなし（全武器有効）の状態で武器ガチャを実行した結果、武器スロット1・スロット2・スリング（スロット3）の全スロットが同一武器になった場合に、ネッシー画像が画面の左下から右下へ横移動するアニメーションを表示する。

## Glossary

- **Easter_Egg_Controller**: ネッシーイースターエッグの発動条件を判定し、アニメーション表示を制御するシステムコンポーネント
- **Nessie_Animation**: ネッシー画像（nessie.png）を画面の左下から右下へ横移動させるCSSアニメーション
- **Weapon_Gacha**: 武器ガチャシステム。スロット1、スロット2、スリング（スロット3）の結果を管理する
- **Legend_Gacha**: レジェンドガチャシステム。パーティメンバーのレジェンド抽選を管理する
- **Ballistic**: バリスティック。hasThirdWeaponSlotフラグがtrueのレジェンドで、スリング（武器スロット3）を持つ
- **Weapon_Lineup**: 武器ラインナップ。各スロットのチェックボックスMapで有効/無効を管理する
- **All_Weapons_Enabled**: 武器ラインナップの絞り込みなし状態。ケアパッケージ武器を除く全武器がチェック済みの状態
- **Same_Weapon_Condition**: スロット1、スロット2、スリングの全ガチャ結果が同一武器IDである状態

## Requirements

### Requirement 1: イースターエッグ発動条件の判定

**User Story:** As a プレイヤー, I want to 特定の条件が揃ったときにイースターエッグが発動する, so that ガチャを繰り返し遊ぶ楽しみが増える

#### Acceptance Criteria

1. WHEN 全スロットガチャが完了した時点で、レジェンドガチャ結果にBallisticが含まれ、かつWeapon_Lineupのスロット1およびスロット2が共にAll_Weapons_Enabled状態であり、かつSame_Weapon_Conditionを満たす場合、THE Easter_Egg_Controller SHALL Nessie_Animationを発動する
2. IF レジェンドガチャ結果にBallisticが含まれない場合、THEN THE Easter_Egg_Controller SHALL Nessie_Animationを発動しない
3. IF Weapon_Lineupのスロット1またはスロット2のいずれかがAll_Weapons_Enabled状態でない場合、THEN THE Easter_Egg_Controller SHALL Nessie_Animationを発動しない
4. IF スロット1、スロット2、スリングの結果のうち1つでも異なる武器IDが存在する場合、THEN THE Easter_Egg_Controller SHALL Nessie_Animationを発動しない

### Requirement 2: ネッシーアニメーションの表示

**User Story:** As a プレイヤー, I want to ネッシーが画面の左下から右下へ横移動するアニメーションを見る, so that イースターエッグの演出を楽しめる

#### Acceptance Criteria

1. WHEN Nessie_Animationが発動した場合、THE Nessie_Animation SHALL nessie.png画像を画面のビューポート左下端から右下端まで水平方向に移動させる
2. THE Nessie_Animation SHALL 画面の最前面（他のUI要素より上）に表示する
3. THE Nessie_Animation SHALL アニメーション完了後に画像をDOM上から非表示にする
4. WHILE Nessie_Animationが再生中の場合、THE Easter_Egg_Controller SHALL ユーザーのガチャ操作を妨げない

### Requirement 3: アニメーション演出仕様

**User Story:** As a プレイヤー, I want to スムーズで視覚的に楽しいアニメーションを見る, so that イースターエッグが印象に残る体験になる

#### Acceptance Criteria

1. THE Nessie_Animation SHALL CSS keyframesアニメーションを使用して水平移動を実現する
2. THE Nessie_Animation SHALL アニメーション持続時間を3秒とする
3. THE Nessie_Animation SHALL ネッシー画像をビューポートの下端に固定した状態で左から右へ移動させる
4. THE Nessie_Animation SHALL position: fixedを使用してスクロール位置に依存しない表示を実現する

### Requirement 4: 再発動制御

**User Story:** As a プレイヤー, I want to 条件を満たすたびにネッシーアニメーションを見る, so that 何度でもイースターエッグを楽しめる

#### Acceptance Criteria

1. WHEN 条件を満たすガチャが再度実行された場合、THE Easter_Egg_Controller SHALL 前回のアニメーション状態に関わらず新たにNessie_Animationを発動する
2. WHEN Nessie_Animation再生中に条件を満たすガチャが再度実行された場合、THE Easter_Egg_Controller SHALL 再生中のアニメーションを中断し、新たにNessie_Animationを最初から発動する
