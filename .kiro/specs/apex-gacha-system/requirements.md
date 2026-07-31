# Requirements Document

## Introduction

Apex Legends用のガチャシステムWebサイト。レジェンド（キャラクター）ピックガチャ、武器ガチャ、縛りルールルーレットの3つの機能を提供し、パーティ編成やカスタムマッチでのランダム選択を支援する。ルームのホストがラインナップをチェックボックスで制御でき、縛りルーレットの結果が自動的にガチャ設定に反映される。

## Glossary

- **Gacha_System**: Apex Legendsガチャシステムサイト全体
- **Legend_Gacha**: レジェンド（キャラクター）をランダムに選択するガチャ機能
- **Weapon_Gacha**: 武器をランダムに選択するガチャ機能
- **Rule_Roulette**: 縛りルールをランダムに決定するルーレット機能
- **Host**: ルームを作成し、ガチャのラインナップを制御する権限を持つユーザー
- **Party**: 最大3人で構成されるチーム
- **Legend**: Apex Legendsのプレイアブルキャラクター（全28人）
- **Weapon**: Apex Legendsの武器（通常武器29種類）
- **Care_Package_Weapon**: シーズンごとに入れ替わる特別枠の武器
- **Lineup_Checkbox**: ホストがガチャ対象を選択するためのチェックボックスUI
- **Roulette_Result**: ルーレットの実行結果として得られた縛りルール
- **Assault_Class**: アサルトクラスのレジェンド群（バンガロール、レヴナント、ヒューズ、マッドマギー、バリスティック）
- **Skirmisher_Class**: スカーミッシャークラスのレジェンド群（パスファインダー、レイス、オクタン、ホライゾン、アッシュ、オルター、アクセル）
- **Recon_Class**: リコンクラスのレジェンド群（ブラッドハウンド、クリプト、ヴァルキリー、シア、ヴァンテージ、スパロー）
- **Support_Class**: サポートクラスのレジェンド群（ジブラルタル、ライフライン、ミラージュ、ローバ、ニューキャッスル、コンジット）
- **Controller_Class**: コントローラークラスのレジェンド群（コースティック、ワットソン、ランパート、カタリスト）
- **Weapon_Slot_1**: 1丁目の武器スロット
- **Weapon_Slot_2**: 2丁目の武器スロット
- **Weapon_Slot_3**: バリスティック専用の3丁目の武器スロット
- **Ammo_Type**: 弾薬の種類（ショットガンアモ、ライトアモ、ヘビーアモ、エネルギー、スナイパーアモ、アロー）
- **User_Profile**: ユーザーごとの設定情報（所持レジェンド等）を管理するプロフィール

## Requirements

### Requirement 1: レジェンドピックガチャ

**User Story:** As a プレイヤー, I want 28人のレジェンドからランダムに1人を選択できるガチャを回したい, so that カスタムマッチで使用するレジェンドをランダムに決められる。

#### Acceptance Criteria

1. WHEN ガチャ実行ボタンが押された時, THE Legend_Gacha SHALL ラインナップに含まれるレジェンドから均等な確率で1人をランダムに選択して表示する
2. WHEN ガチャ結果が表示された時, THE Legend_Gacha SHALL 選択されたレジェンドの名前、キャラクター画像、およびクラス名を結果として表示する
3. WHEN ガチャ結果が既に表示されている状態でガチャ実行ボタンが再度押された時, THE Legend_Gacha SHALL 前回の結果を破棄し、新たにラインナップから1人を選択して結果を更新する

### Requirement 2: レジェンドラインナップ制御

**User Story:** As a Host, I want ガチャに含めるレジェンドをチェックボックスで選択したい, so that ルームのルールに合わせてガチャ対象を制御できる。

#### Acceptance Criteria

1. THE Lineup_Checkbox SHALL 28人すべてのレジェンドを個別に選択可能なチェックボックスとして表示し、初期状態では全レジェンドを選択済みとする
2. WHEN Host がチェックボックスの状態を変更した時, THE Legend_Gacha SHALL 即座に変更後のラインナップのみをガチャ対象とする
3. THE Lineup_Checkbox SHALL レジェンドをクラスごと（Assault_Class、Skirmisher_Class、Recon_Class、Support_Class、Controller_Class）にグループ化して表示し、各クラスグループに対してクラス単位の全選択・全解除チェックボックスを提供する
4. IF ラインナップに1人もレジェンドが選択されていない状態でガチャ実行が試みられた場合, THEN THE Legend_Gacha SHALL 最低1人のレジェンドを選択する必要がある旨を示すエラーメッセージを表示し、ガチャを実行しない
5. THE Lineup_Checkbox SHALL 全レジェンドを一括で選択・解除できる全選択チェックボックスを提供する

### Requirement 3: パーティ編成ガチャ

**User Story:** As a プレイヤー, I want 最大3人のパーティをランダムに組みたい, so that 被りなくチームメンバーのレジェンドを決められる。

#### Acceptance Criteria

1. WHEN パーティガチャ実行ボタンが押された時, THE Legend_Gacha SHALL パーティ人数選択（1人、2人、3人）で指定された人数分のレジェンドをラインナップから重複なしでランダムに選択する
2. WHEN パーティガチャの結果が表示された時, THE Legend_Gacha SHALL パーティの各メンバーをメンバー1、メンバー2、メンバー3として区別し、それぞれにレジェンド名とキャラクター画像を表示する
3. IF ラインナップのレジェンド数が指定されたパーティ人数未満の場合, THEN THE Legend_Gacha SHALL 選択可能なレジェンドが不足している旨のエラーメッセージを表示しガチャを実行しない
4. THE Legend_Gacha SHALL パーティ人数を1人、2人、3人から選択できるUIを提供し、デフォルトは3人とする

### Requirement 4: 武器ガチャ基本機能

**User Story:** As a プレイヤー, I want 29種類の武器からランダムに2丁を決めたい, so that カスタムマッチで使用する武器をランダムに選べる。

#### Acceptance Criteria

1. WHEN 武器ガチャ実行ボタンが押された時, THE Weapon_Gacha SHALL Weapon_Slot_1 と Weapon_Slot_2 のそれぞれに対して、各スロットのラインナップから独立してランダムに1丁ずつ武器を選択し、両スロットの結果を同時に表示する
2. THE Weapon_Gacha SHALL Weapon_Slot_1 と Weapon_Slot_2 の選択を互いに独立した抽選として実行し、同じ武器が両方のスロットに選ばれることを許容する
3. THE Weapon_Gacha SHALL 各スロットの結果として武器名、武器カテゴリ（ショットガン、サブマシンガン、ピストル、アサルトライフル、ライトマシンガン、マークスマン、スナイパーライフルのいずれか）、および対応する Ammo_Type を表示する
4. IF いずれかのスロットのラインナップに1丁も武器が選択されていない状態で武器ガチャ実行ボタンが押された場合, THEN THE Weapon_Gacha SHALL エラーメッセージを表示しガチャを実行しない

### Requirement 5: 武器スロット別ガチャ

**User Story:** As a プレイヤー, I want 1丁目と2丁目の武器をそれぞれ個別にガチャを回したい, so that 片方だけ引き直すことができる。

#### Acceptance Criteria

1. THE Weapon_Gacha SHALL Weapon_Slot_1 と Weapon_Slot_2 を個別にガチャ実行できるボタンを提供する
2. WHEN Weapon_Slot_1 のガチャ実行ボタンが押された時, THE Weapon_Gacha SHALL Weapon_Slot_1 のラインナップからランダムに1丁を選択し、Weapon_Slot_2 の結果には影響を与えない
3. WHEN Weapon_Slot_2 のガチャ実行ボタンが押された時, THE Weapon_Gacha SHALL Weapon_Slot_2 のラインナップからランダムに1丁を選択し、Weapon_Slot_1 の結果には影響を与えない

### Requirement 6: 武器ラインナップ制御

**User Story:** As a Host, I want 各武器スロットのガチャ対象をチェックボックスで個別に制御したい, so that スロットごとに異なる武器制限を設定できる。

#### Acceptance Criteria

1. THE Lineup_Checkbox SHALL Weapon_Slot_1 と Weapon_Slot_2 に対してそれぞれ独立したチェックボックスリストを表示し、各リストは29種類すべての通常武器を含み、初期状態ではすべてのチェックボックスがオンであること
2. WHEN Host が Weapon_Slot_1 のチェックボックスを変更した時, THE Weapon_Gacha SHALL Weapon_Slot_1 のラインナップのみを即座に更新し、Weapon_Slot_2 のラインナップに影響を与えないこと
3. WHEN Host が Weapon_Slot_2 のチェックボックスを変更した時, THE Weapon_Gacha SHALL Weapon_Slot_2 のラインナップのみを即座に更新し、Weapon_Slot_1 のラインナップに影響を与えないこと
4. THE Lineup_Checkbox SHALL 武器をカテゴリ（ショットガン、サブマシンガン、ピストル、アサルトライフル、ライトマシンガン、マークスマン、スナイパーライフル）ごとにグループ化して表示する
5. IF 対象スロットのラインナップに1丁も武器が選択されていない状態でガチャ実行が試みられた場合, THEN THE Weapon_Gacha SHALL どのスロットで武器が未選択であるかを示すエラーメッセージを表示し、ガチャを実行しない
6. THE Lineup_Checkbox SHALL 各カテゴリに対してカテゴリ内の全武器を一括でオン・オフ切り替えできるカテゴリ選択チェックボックスを提供する

### Requirement 7: バリスティック専用3丁目武器スロット

**User Story:** As a プレイヤー, I want バリスティックが選ばれた場合に3丁目の武器もガチャで決めたい, so that バリスティック固有のパッシブ能力に対応できる。

#### Acceptance Criteria

1. WHEN Legend_Gacha でバリスティックが選択された時, THE Weapon_Gacha SHALL Weapon_Slot_3 のガチャ実行ボタンを表示する
2. WHEN Weapon_Slot_3 のガチャ実行ボタンが押された時, THE Weapon_Gacha SHALL Weapon_Slot_3 のラインナップからランダムに1丁を選択し、武器名、武器カテゴリ、対応する Ammo_Type を結果として表示する
3. THE Lineup_Checkbox SHALL Weapon_Slot_3 に対して独立したチェックボックスリストを提供し、武器をカテゴリごとにグループ化して表示する
4. WHILE バリスティック以外のレジェンドが選択されている状態またはレジェンドが未選択の状態, THE Weapon_Gacha SHALL Weapon_Slot_3 のガチャ実行ボタンおよび Weapon_Slot_3 のガチャ結果を非表示にする
5. IF Weapon_Slot_3 のラインナップに1丁も武器が選択されていない状態でガチャ実行が試みられた場合, THEN THE Weapon_Gacha SHALL エラーメッセージを表示しガチャを実行しない

### Requirement 8: ケアパッケージ武器管理

**User Story:** As a Host, I want シーズンごとに入れ替わるケアパッケージ武器を通常武器ガチャとは別枠で管理したい, so that シーズンの変更に対応できる。

#### Acceptance Criteria

1. THE Gacha_System SHALL Care_Package_Weapon を通常武器のチェックボックスリストとは別のセクションに一覧表示する
2. THE Gacha_System SHALL Host に対して各武器の Care_Package_Weapon フラグを個別に切り替えるトグルUIを提供する
3. IF Care_Package_Weapon フラグが有効である場合, THEN THE Weapon_Gacha SHALL 該当武器を Weapon_Slot_1、Weapon_Slot_2、Weapon_Slot_3 すべての通常武器ラインナップから除外する
4. IF Care_Package_Weapon フラグが無効に切り替えられた場合, THEN THE Weapon_Gacha SHALL 該当武器を Weapon_Slot_1、Weapon_Slot_2、Weapon_Slot_3 の通常武器ラインナップにチェックボックス未選択状態で追加する
5. WHEN Host が Care_Package_Weapon フラグを有効から無効に切り替えた時, THE Gacha_System SHALL 該当武器のチェックボックスを通常武器セクションに未選択状態で表示する

### Requirement 9: 縛りルールルーレット基本機能

**User Story:** As a プレイヤー, I want 縛りルールをランダムに決めるルーレットを回したい, so that ゲームに追加の制約を加えて楽しめる。

#### Acceptance Criteria

1. WHEN ルーレット実行ボタンが押された時, THE Rule_Roulette SHALL 定義済みの縛りルール18種類から均等な確率でランダムに1つを選択して表示する
2. THE Rule_Roulette SHALL 以下の縛りルールを含む: アサルトクラス縛り、スカーミッシャークラス縛り、リコンクラス縛り、サポートクラス縛り、コントローラークラス縛り、武器1つはショットガン縛り、武器1つはサブマシンガン縛り、武器1つはピストル縛り、武器1つはアサルトライフル縛り、武器1つはライトマシンガン縛り、武器1つはマークスマン縛り、武器1つはスナイパーライフル縛り、武器1つはショットガンアモ武器縛り、武器1つはライトアモ武器縛り、武器1つはヘビーアモ武器縛り、武器1つはエネルギー武器縛り、武器1つはスナイパーアモ武器縛り、武器1つはアロー武器縛り
3. WHEN ルーレット結果が表示された時, THE Rule_Roulette SHALL ルーレット結果のカテゴリ（レジェンドクラス縛り、武器カテゴリ縛り、弾薬種類縛り）を明示する
4. WHEN ルーレット結果が既に表示されている状態でルーレット実行ボタンが再度押された時, THE Rule_Roulette SHALL 前回の結果を破棄し、新たに1つの縛りルールを選択して結果を更新する

### Requirement 10: ルーレット結果の自動チェックボックス制御

**User Story:** As a プレイヤー, I want ルーレット結果が自動的にチェックボックス設定に反映されてほしい, so that 手動で設定を変更する手間を省ける。

#### Acceptance Criteria

1. WHEN Rule_Roulette でレジェンドクラス縛りが選択された時, THE Gacha_System SHALL Legend_Gacha のチェックボックスにおいて該当クラスのレジェンドをすべてチェック状態にし、該当クラス以外のレジェンドをすべて未チェック状態に設定する
2. WHEN Rule_Roulette で武器カテゴリ縛りが選択された時, THE Gacha_System SHALL Weapon_Slot_1 のチェックボックスにおいて該当カテゴリの武器をすべてチェック状態にし、該当カテゴリ以外の武器をすべて未チェック状態に設定する
3. WHEN Rule_Roulette で弾薬種類縛りが選択された時, THE Gacha_System SHALL Weapon_Slot_1 のチェックボックスにおいて該当弾薬種類の武器をすべてチェック状態にし、該当弾薬種類以外の武器をすべて未チェック状態に設定する
4. WHEN Rule_Roulette で武器カテゴリ縛りまたは弾薬種類縛りが選択された時, THE Gacha_System SHALL Weapon_Slot_2 のチェックボックス状態を変更せず維持する
5. IF ルーレット結果の自動設定により対象スロットのラインナップが0件となる場合, THEN THE Gacha_System SHALL 自動設定を適用したうえでガチャ実行時にエラーメッセージを表示する

### Requirement 11: ルーレット結果のリセットと適用切り替え

**User Story:** As a プレイヤー, I want ルーレット結果をリセットしたり適用状態を切り替えたりしたい, so that ルーレット結果に縛られずに柔軟に設定を変更できる。

#### Acceptance Criteria

1. WHILE Roulette_Result が存在する状態, THE Rule_Roulette SHALL リセットボタンおよび適用トグルを表示する
2. WHEN ルーレットが実行され結果が確定した時, THE Gacha_System SHALL 確定直前のチェックボックス状態を保存し、適用トグルをオン状態で表示する
3. WHEN リセットボタンが押された時, THE Rule_Roulette SHALL Roulette_Result を破棄し、チェックボックスをルーレット実行直前に保存した状態に復元し、リセットボタンおよび適用トグルを非表示にする
4. WHEN 適用トグルがオフに切り替えられた時, THE Gacha_System SHALL ルーレット結果によるチェックボックス制御を解除し、ルーレット実行直前に保存した状態にチェックボックスを復元する（Roulette_Result 自体は保持する）
5. WHEN 適用トグルがオンに切り替えられた時, THE Gacha_System SHALL 保持している Roulette_Result に基づくチェックボックス制御を再適用する
6. IF Roulette_Result が存在しない状態でリセットボタンまたは適用トグルの操作が試みられた場合, THEN THE Rule_Roulette SHALL 操作を無視する

### Requirement 12: ユーザープロフィールによるレジェンド制御

**User Story:** As a プレイヤー, I want 自分が解放済みのレジェンドをプロフィールで設定したい, so that 未解放のレジェンドがガチャに出ないようにできる。

#### Acceptance Criteria

1. THE Gacha_System SHALL ユーザーごとに所持レジェンドを選択できるプロフィール画面を提供し、初期状態では28人すべてのレジェンドを所持済み（チェックオン）とする
2. THE Gacha_System SHALL プロフィール画面で28人すべてのレジェンドを個別にチェックボックスで選択可能にする
3. IF ユーザーがプロフィールで未所持としたレジェンドがいる場合, THEN THE Legend_Gacha SHALL ホストのラインナップ設定と該当ユーザーのプロフィール設定の両方で有効なレジェンドのみをガチャ対象とする
4. WHEN パーティガチャが実行された時, THE Legend_Gacha SHALL 各メンバーに対してそのメンバーのプロフィールで所持済みかつホストのラインナップに含まれるレジェンドの中から重複なしで選択する
5. THE Gacha_System SHALL プロフィール設定をブラウザのローカルストレージに保存し、再訪問時に復元する
6. IF プロフィール設定とホストのラインナップ設定の適用後にガチャ対象のレジェンドが0人となった場合, THEN THE Legend_Gacha SHALL ガチャを実行せずに対象レジェンドが不足している旨のエラーメッセージを表示する
7. IF パーティガチャにおいていずれかのメンバーのガチャ対象レジェンドが不足し重複なしで選択できない場合, THEN THE Legend_Gacha SHALL ガチャを実行せずに該当メンバーの対象レジェンドが不足している旨のエラーメッセージを表示する

### Requirement 13: 武器データ管理

**User Story:** As a 開発者, I want 武器データを弾薬種類とカテゴリ情報を含めて管理したい, so that ガチャやフィルタリングが正確に動作する。

#### Acceptance Criteria

1. THE Gacha_System SHALL 各武器に対して名前、カテゴリ（Shotgun, SMG, Pistol, AR, LMG, Marksman, Sniper のいずれか）、および1つ以上のAmmo_Type（Shotgun, Light, Heavy, Energy, Sniper, Arrow のいずれか）の情報を保持する
2. THE Gacha_System SHALL C.A.R.に対してAmmo_Typeとして Light および Heavy の2種類を保持し、カテゴリとして SMG を保持する
3. WHEN 弾薬種類「Light」で武器フィルタリングが実行された時、THE Gacha_System SHALL C.A.R.をフィルタリング結果に含める
4. WHEN 弾薬種類「Heavy」で武器フィルタリングが実行された時、THE Gacha_System SHALL C.A.R.をフィルタリング結果に含める
5. WHEN カテゴリで武器フィルタリングが実行された時、THE Gacha_System SHALL 指定されたカテゴリに属する全武器を返す

### Requirement 14: レジェンドデータ管理

**User Story:** As a 開発者, I want レジェンドデータをクラス情報とキャラクター画像を含めて管理したい, so that ガチャ表示やフィルタリングが正確に動作する。

#### Acceptance Criteria

1. THE Gacha_System SHALL 各レジェンドに対して名前（日本語）、クラス（Assault_Class, Skirmisher_Class, Recon_Class, Support_Class, Controller_Class のいずれか）、およびキャラクター画像パスの情報を保持する
2. THE Gacha_System SHALL 5つのクラス（Assault_Class: 5人、Skirmisher_Class: 7人、Recon_Class: 6人、Support_Class: 6人、Controller_Class: 4人）の合計28人を管理する
3. WHEN クラスによるレジェンドフィルタリングが実行された時, THE Gacha_System SHALL 指定されたクラスに属する全レジェンドを返す
4. THE Gacha_System SHALL バリスティックをAssault_Classとして管理し、3丁目武器スロット対応フラグを保持する
