# 技術要件定義書: 一人暮らし向け料理提案アプリ（MVP）

- 文書ID: TR-SOLO-RECIPE
- 文書バージョン: 1.0
- 作成日: 2026-02-19
- 関連文書:
  - 要件定義: `doc/requirements.md`
  - 受入試験仕様: `doc/acceptance-test-spec.md`

## 1. 本書の位置付け
本書は `doc/requirements.md` の要件を実装可能な技術仕様へ落とし込む。  
要件変更時は、本書の該当 `TR-*` を必ず更新する。

## 2. 技術スタック
| ID | 区分 | 採用技術 |
|---|---|---|
| TR-STACK-001 | 言語/ビルド | TypeScript + Vite |
| TR-STACK-002 | UI | React |
| TR-STACK-003 | ルーティング | React Router |
| TR-STACK-004 | スタイリング | Tailwind CSS |
| TR-STACK-005 | 状態管理 | Zustand |
| TR-STACK-006 | フォーム | React Hook Form + Zod |
| TR-STACK-007 | ローカルDB | IndexedDB + Dexie |
| TR-STACK-008 | テスト | Vitest + React Testing Library + Playwright |
| TR-STACK-009 | PWA | vite-plugin-pwa（generateSW） |
| TR-STACK-010 | パッケージ管理 | pnpm |
| TR-STACK-011 | CI | GitHub Actions |
| TR-STACK-012 | デプロイ | Cloudflare Pages |

## 3. アーキテクチャ要件
| ID | 要件 |
|---|---|
| TR-ARC-001 | クライアント完結（バックエンドなし）で動作する。 |
| TR-ARC-002 | PWAとしてインストール可能で、オフライン時に保存済みデータを閲覧できる。 |
| TR-ARC-003 | 画面層・状態管理層・永続化層を分離し、永続化層はDexieを単一窓口として扱う。 |

## 3.1 ドメインデータ初期値
| ID | 要件 |
|---|---|
| TR-DATA-001 | 1食予算の初期値を400円とし、設定画面から変更可能にする。 |

## 4. データ保存・障害時挙動
| ID | 要件 |
|---|---|
| TR-DB-001 | 主要データ（在庫、買い物リスト、調理ログ、設定）はIndexedDBへ保存する。 |
| TR-DB-002 | 起動時に永続データを読込、復元後に画面描画する。 |
| TR-DB-003 | DBスキーマ変更は段階的マイグレーションで適用する。 |
| TR-DB-004 | 初回判定は `localStorage.setupCompleted` の有無で判定する。 |
| TR-DB-005 | データ初期化は設定画面からのみ可能とし、確認ダイアログを必須化する。 |
| TR-DB-006 | IndexedDBの初期化/読込/書込失敗時は画面エラー通知を表示し、該当操作を中断する。 |
| TR-DB-007 | エラー記録は端末内表示に限定し、外部エラートラッキング送信は行わない。※NFR-004（個人情報非収集）の実装方針として定義。直接対応するFRなし。 |

## 5. レシピ・提案ロジック要件
| ID | 要件 |
|---|---|
| TR-REC-001 | 提案対象は `dinner` 固定とする。 |
| TR-REC-002 | レシピソースは `src/data/recipes.json` とし、初期件数は50件以上を保証する。 |
| TR-REC-003 | 絞り込み条件は「20分以内」「予算内」。0件時は固定文言を表示する。 |
| TR-REC-004 | ランキングは `score = 0.60*costFit + 0.25*stockUtilization + 0.15*timeFit` を使用する。 |
| TR-REC-005 | レシピ読込時はZodでスキーマ検証し、不正時は読込失敗として扱う。 |

## 6. 在庫・集計ロジック要件
| ID | 要件 |
|---|---|
| TR-LOGIC-001 | 不足食材は「レシピ必要量 - 在庫量」で算出し、正の差分のみ買い物リスト候補とする。 |
| TR-LOGIC-002 | 調理完了時、在庫差し引きと調理ログ記録を同一トランザクションで処理する。 |
| TR-LOGIC-003 | 差し引き結果が負値となる場合は0へクランプし、トースト通知を表示する。 |
| TR-AGG-001 | 月次集計は `Asia/Tokyo` 固定、カレンダー月単位で計算する。 |
| TR-AGG-002 | 月次データは `YYYY-MM` の月キーで保持し、表示月切替に対応する。 |
| TR-AGG-003 | 日別・週別推移表示はShould要件として同一集計元データから算出する。 |

## 7. インターフェース/型仕様
### 7.1 ドメイン型
```ts
type Unit =
  | "g"
  | "ml"
  | "piece"
  | "大さじ"
  | "小さじ"
  | "本"
  | "枚"
  | "袋"
  | "缶";

type StorageErrorCode =
  | "DB_INIT_FAILED"
  | "DB_READ_FAILED"
  | "DB_WRITE_FAILED";

type MonthlyAggregation = {
  monthKey: string; // YYYY-MM (Asia/Tokyo)
  baseline: number;
  actual: number;
  saving: number; // baseline - actual
};

type RecipeSource = {
  path: "src/data/recipes.json";
  minRecipeCount: 50;
  validation: "zod";
};
```

### 7.2 単位換算ポリシー
| ID | 要件 |
|---|---|
| TR-UNIT-001 | 体積換算のみ対応する（`大さじ=15ml`, `小さじ=5ml`）。 |
| TR-UNIT-002 | 非対応単位間の換算は行わず、計算対象外として警告表示する。 |
| TR-UNIT-003 | 在庫差し引き・推定コスト算出ともに同一換算ロジックを利用する。 |

## 8. UI/UX技術要件
| ID | 要件 |
|---|---|
| TR-UI-001 | スマホ縦画面を基準にレイアウトする。 |
| TR-UI-002 | 在庫入力フォームはRHF+Zodで実装し、入力エラーを即時表示する。 |
| TR-UI-003 | 単価未設定や換算不可などの注意状態を視覚的に識別可能にする。 |
| TR-UI-004 | レシピ0件・DB障害・初期化確認などの状態UIを明示的に提供する。 |

## 9. CI/CD要件
| ID | 要件 |
|---|---|
| TR-CICD-001 | CIはGitHub Actionsで実行する。 |
| TR-CICD-002 | CIで `lint + unit + build + 主要E2E` を実行する。 |
| TR-CICD-003 | デプロイ先はCloudflare Pagesを使用する。 |
| TR-CICD-004 | デプロイはCI通過済みコミットのみ対象とする。 |

## 10. 要件トレーサビリティ（抜粋）
| 要件ID | 主な対応TR |
|---|---|
| FR-001 | TR-DB-004 |
| FR-002 | TR-DATA-001 |
| FR-003 | TR-REC-001 |
| FR-020 | TR-REC-002, TR-REC-005 |
| FR-021 | TR-REC-003 |
| FR-041 | TR-LOGIC-002, TR-LOGIC-003 |
| FR-041a | TR-DB-001 |
| FR-042 | TR-AGG-001, TR-AGG-002 |
| FR-052 | TR-DB-005 |
| FR-053 | TR-DB-006 |
| NFR-004 | TR-DB-007 |
| NFR-005 | TR-ARC-002, TR-STACK-009 |
