# 開発準備チェックリスト（安定運用向け）

- 文書ID: BOOT-SOLO-RECIPE
- 文書バージョン: 1.1
- 作成日: 2026-02-19
- 更新日: 2026-02-20
- 関連文書:
  - `doc/requirements.md`
  - `doc/technical-requirements.md`
  - `doc/acceptance-test-spec.md`

## 1. 目的
実装着手前に、開発環境・運用・品質ゲートを先に固める。  
仕様どおりに実装しても品質が崩れない状態を最短で作るための手順書。

## 2. 使い方
- 上から順に実施する。
- `確認方法` まで満たしたら完了とする。
- 本書は「準備」のみを対象とし、機能実装は対象外とする。

## 3. チェックリスト

### 3.1 Git運用の固定
- [x] リポジトリ初期化または接続を完了する。
  - `git init` / `git branch -M main` / `git remote add origin`
  - 確認方法: `git status` が実行でき、`main` ブランチが存在する。 ✅
- [x] PR運用ルールを確定する（`main` 直接push禁止、レビュー必須）。
  - GitHub Rulesets で `main` ブランチを対象にルール設定済み。
  - Require pull request + Require status checks (`Lint / Typecheck / Test / Build`) ✅
- [x] PRテンプレートを追加する。
  - 追加先: `.github/pull_request_template.md`
  - 確認方法: PR作成時にテンプレートが自動表示される。 ✅

### 3.2 開発環境バージョン固定
- [x] Node.jsバージョンを固定する（`.nvmrc`）。
  - `24.13.0` を `.nvmrc` に記載 ✅
- [x] pnpmバージョンを固定する（`packageManager`）。
  - `package.json` に `"packageManager": "pnpm@10.28.2"` を設定 ✅
- [x] `engines` で許容バージョン範囲を宣言する。
  - `"node": ">=24.0.0"`, `"pnpm": ">=10.0.0"` を設定 ✅

### 3.3 プロジェクト雛形と責務分離
- [x] `React + Vite + TypeScript` で雛形を作成する。
  - `pnpm create vite . --template react-ts` で作成。`pnpm dev` で起動確認済み ✅
- [x] 主要ディレクトリ責務を先に分ける。
  - `src/ui`, `src/state`, `src/db`, `src/domain`, `src/lib`, `src/data` を作成 ✅

### 3.4 品質ゲート（ローカル）
- [x] lint/typecheck/unit/e2e の実行コマンドを `package.json` scripts に定義する。
  - `pnpm lint` / `pnpm typecheck` / `pnpm test` / `pnpm test:e2e` ✅
- [x] 失敗時に開発者が原因を特定できるログを確保する。
  - 確認方法: 上記コマンドがローカルで再現可能に動作する。 ✅

### 3.5 CI/CD接続
- [x] GitHub Actionsで `lint + unit + build + 主要E2E` を実行する。
  - `.github/workflows/ci.yml` を作成。全ジョブ成功確認済み ✅
- [x] CI成功時のみCloudflare Pagesへデプロイする。
  - `needs: ci` により CI 通過後のみ deploy ジョブが実行される ✅
- [x] CI失敗時はデプロイしない制御を有効化する。
  - 確認方法: lint/test 失敗時にデプロイジョブがスキップされる動作を確認済み ✅

### 3.6 データ安全性の事前固定
- [x] `setupCompleted`、`monthKey(YYYY-MM, Asia/Tokyo)`、`StorageErrorCode` を定数化する。
  - `src/lib/constants.ts` に実装済み ✅
- [x] Dexieのバージョン管理とマイグレーション方針を実装前に確定する。
  - `src/db/index.ts` に Dexie v1 スキーマを定義。バージョンアップ時は`version(n)`を追加する方針 ✅
- [ ] 初期化導線と障害時中断（FR-052/053）を先に設計する。
  - 確認方法: 仕様書上で `FR/TR/AT` が対応付いている。
  - → **機能実装フェーズで対応**（AT-022/023 に対応付け済み）

### 3.7 仕様トレーサビリティ運用
- [x] 仕様変更時に `requirements`/`technical-requirements`/`acceptance-test-spec` を同時更新する。
  - 運用ルールとして確定。PRチェックリストに記載済み ✅
- [x] PRチェック項目に「FR/TR/AT更新確認」を追加する。
  - `.github/pull_request_template.md` に追加済み ✅

## 4. 実装着手の完了条件（Definition of Ready）
- [x] 3.1〜3.7の全項目が完了している（3.6の初期化導線は機能実装フェーズで対応）。
- [x] `doc/requirements.md` と `doc/technical-requirements.md` の技術方針が一致している。
- [x] `doc/acceptance-test-spec.md` に全Must要件の受入ケースが存在する。
- [x] 「この順序で着手する」合意が取れている（recipes.json → 画面A → B → C/D → E → F）。
