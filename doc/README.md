# ドキュメント運用ガイド（solo-recipe）

## 1. 目的
`doc/` 配下の仕様書の読み順・責務・更新ルールを定義する。  
本ガイドにより、要件・技術仕様・受入試験の不整合を防ぐ。

## 2. 読み順
1. `doc/requirements.md`（何を満たすか）
2. `doc/technical-requirements.md`（どう実現するか）
3. `doc/acceptance-test-spec.md`（どう検証するか）
4. `doc/development-bootstrap-checklist.md`（実装前に何を揃えるか）

## 3. 各文書の責務
| 文書 | 主責務 | 含める内容 | 含めない内容 |
|---|---|---|---|
| `requirements.md` | ビジネス/機能要件 | 目的、スコープ、FR/NFR、制約、リスク | 実装ライブラリの詳細手順 |
| `technical-requirements.md` | 技術仕様 | スタック、構成、データ保存、型仕様、CI/CD | ビジネス背景の説明 |
| `acceptance-test-spec.md` | 受入判定 | ATケース、期待結果、トレーサビリティ | 実装手順・コード |
| `development-bootstrap-checklist.md` | 実装前準備 | 環境固定、品質ゲート、CI/CD接続、着手条件 | 個別機能の詳細仕様 |

## 4. ID採番ルール
- `FR-xxx`: 機能要件
- `NFR-xxx`: 非機能要件
- `TR-<category>-xxx`: 技術要件
- `AT-xxx`: 受入試験ケース

カテゴリ例:
- `TR-STACK-*`（技術スタック）
- `TR-DB-*`（永続化）
- `TR-REC-*`（レシピ/提案）
- `TR-AGG-*`（集計）
- `TR-CICD-*`（CI/CD）

## 5. 更新ルール（同期必須）
要件変更時は次を同一変更で同期する。

| 変更起点 | 必須更新先 |
|---|---|
| `FR-*` 変更 | `technical-requirements.md` の該当 `TR-*`、`acceptance-test-spec.md` の `AT-*` |
| `NFR-*` 変更 | `technical-requirements.md`、`acceptance-test-spec.md` |
| `TR-*` 変更 | `requirements.md` の参照整合、`acceptance-test-spec.md` の期待結果 |
| `AT-*` 追加/削除 | 対応表（FR-AT、NFR-AT） |

## 6. 変更時チェックリスト
- 主要4文書のリンクが有効である。
- 実装前準備を運用する場合、`development-bootstrap-checklist.md` の内容が最新である。
- `requirements.md` の全 `FR-*` が `acceptance-test-spec.md` に対応付いている。
- `NFR-*` が `AT-*` に対応付いている。
- 技術方針が1つに統一されている（CIはGitHub Actions、デプロイはCloudflare Pages）。
- `Unit`、`StorageErrorCode`、`MonthlyAggregation`、`RecipeSource` の記述が文書間で一致している。

## 7. 文書更新時の禁止事項
- 実装コード・設定ファイルの変更を同コミットに含めない。
- 要件未合意のまま `TR-*` や `AT-*` を先行確定しない。
- 参照先文書を更新せずにIDだけ追加しない。
