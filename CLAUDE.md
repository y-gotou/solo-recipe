# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

一人暮らし向け夕食レシピ提案 PWA。バックエンドなし・ローカル完結（IndexedDB）のクライアント SPA。

## コマンド

```bash
pnpm dev           # 開発サーバー起動（http://localhost:5173）
pnpm build         # ビルド（tsc -b && vite build）
pnpm lint          # ESLint（--max-warnings 0）
pnpm typecheck     # TypeScript 型チェック（--noEmit）
pnpm test          # Vitest 単体テスト（1回実行）
pnpm test:watch    # Vitest ウォッチモード
pnpm test:e2e      # Playwright E2E テスト
```

単一テストファイルの実行:
```bash
pnpm vitest run src/lib/constants.test.ts
```

CI パイプラインの順序: `lint → typecheck → test → build → test:e2e`

## アーキテクチャ

```
src/
├── ui/         # React コンポーネント（6 画面: 初期設定・在庫・提案・詳細・買い物・集計）
├── state/      # Zustand ストア
├── db/         # Dexie（IndexedDB）スキーマと操作
├── domain/     # ドメイン型定義（Recipe, Unit, RecipeIngredient など）
├── lib/        # 定数・ユーティリティ（constants.ts が中心）
└── data/       # recipes.json（50件以上・Zod 検証必須）
```

**層の依存方向**: `ui → state → db / domain / lib`。DB 層は直接 UI から触らない。

### データ永続化

- `src/db/index.ts` に Dexie v1 スキーマ定義（4テーブル: `ingredients`, `shoppingItems`, `cookingLogs`, `settings`）
- 初回起動判定: `localStorage.setupCompleted` キー（定数 `SETUP_COMPLETED_KEY`）
- 月次集計キー: `YYYY-MM` 形式、タイムゾーン `Asia/Tokyo`（`getCurrentMonthKey()` を使用）

### レシピ提案ロジック（TR-REC-001 ～ 005）

- 対象: 夕食（`mealType: "dinner"`）固定
- 絞り込み条件: 調理時間 ≤ 20分 かつ 推定コスト ≤ 予算
- スコア計算: `0.60 × costFit + 0.25 × stockUtilization + 0.15 × timeFit`
- `src/data/recipes.json` を Zod スキーマで検証してから使用

### 主要な定数

| 定数 | 値 | 意味 |
|---|---|---|
| `DEFAULT_MEAL_BUDGET` | 400 | 1食予算初期値（円） |
| `SETUP_COMPLETED_KEY` | `"setupCompleted"` | 初回設定完了フラグキー |
| `MEAL_TYPE` | `"dinner"` | 対象食事種別 |
| `MONTH_KEY_TIMEZONE` | `"Asia/Tokyo"` | 月次集計タイムゾーン |

## 仕様トレーサビリティ

`doc/` 以下に4つのドキュメントが連携している:

- `doc/requirements.md`: 機能要件（`FR-*`）・非機能要件（`NFR-*`）
- `doc/technical-requirements.md`: 技術要件（`TR-<category>-*`）
- `doc/acceptance-test-spec.md`: 受入試験（`AT-*`）

**仕様変更時の同期ルール**: `FR-*` 変更 → `TR-*` と `AT-*` を同時更新。コード内コメントにも `TR-XXX-NNN` 形式で参照を記載している（例: `// TR-DB-004`）。

## テスト方針

- 単体テスト: `src/**/*.{test,spec}.{ts,tsx}` を Vitest + Testing Library で実行
- E2E: `e2e/` ディレクトリを Playwright で実行（CI は Chromium のみ、ローカルは Desktop/Mobile Chrome/Safari）
- E2E は `pnpm build` 後に `pnpm preview` でサーブしたものに対して実行される

## デプロイ

main ブランチへの push で GitHub Actions → Cloudflare Pages に自動デプロイ（`dist/` を `solo-recipe` プロジェクトへ）。
