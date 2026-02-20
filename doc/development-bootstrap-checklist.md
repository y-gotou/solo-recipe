# 開発準備チェックリスト（安定運用向け）

- 文書ID: BOOT-SOLO-RECIPE
- 文書バージョン: 1.0
- 作成日: 2026-02-19
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
- [ ] リポジトリ初期化または接続を完了する。
  - 実行コマンド例:
    ```bash
    git init
    git branch -M main
    git remote add origin <repo-url>
    ```
  - 確認方法: `git status` が実行でき、`main` ブランチが存在する。
- [ ] PR運用ルールを確定する（`main` 直接push禁止、レビュー必須）。
  - 設定項目例: Required pull request reviews, Require status checks。
  - 確認方法: GitHubのBranch protectionに設定が反映されている。
- [ ] PRテンプレートを追加する。
  - 追加先例: `.github/pull_request_template.md`
  - 確認方法: PR作成時にテンプレートが自動表示される。

### 3.2 開発環境バージョン固定
- [ ] Node.jsバージョンを固定する（例: `.nvmrc`）。
- [ ] pnpmバージョンを固定する（`packageManager`）。
- [ ] `engines` で許容バージョン範囲を宣言する。
  - 実行コマンド例:
    ```bash
    node -v
    pnpm -v
    corepack enable
    ```
  - 確認方法: 新規環境で同一バージョンが再現できる。

### 3.3 プロジェクト雛形と責務分離
- [ ] `React + Vite + TypeScript` で雛形を作成する。
  - 実行コマンド例:
    ```bash
    pnpm create vite . --template react-ts
    pnpm install
    ```
  - 確認方法: `pnpm dev` で起動できる。
- [ ] 主要ディレクトリ責務を先に分ける。
  - 例: `src/ui`, `src/state`, `src/db`, `src/domain`, `src/lib`
  - 確認方法: 役割が重複しないディレクトリ構成になっている。

### 3.4 品質ゲート（ローカル）
- [ ] lint/typecheck/unit/e2e の実行コマンドを `package.json` scripts に定義する。
- [ ] 失敗時に開発者が原因を特定できるログを確保する。
  - 実行コマンド例:
    ```bash
    pnpm lint
    pnpm typecheck
    pnpm test
    pnpm test:e2e
    ```
  - 確認方法: 上記コマンドがローカルで再現可能に動作する。

### 3.5 CI/CD接続
- [ ] GitHub Actionsで `lint + unit + build + 主要E2E` を実行する。
- [ ] CI成功時のみCloudflare Pagesへデプロイする。
- [ ] CI失敗時はデプロイしない制御を有効化する。
  - 確認方法: テスト失敗コミットでデプロイが停止する。

### 3.6 データ安全性の事前固定
- [ ] `setupCompleted`、`monthKey(YYYY-MM, Asia/Tokyo)`、`StorageErrorCode` を定数化する。
- [ ] Dexieのバージョン管理とマイグレーション方針を実装前に確定する。
- [ ] 初期化導線と障害時中断（FR-052/053）を先に設計する。
  - 確認方法: 仕様書上で `FR/TR/AT` が対応付いている。

### 3.7 仕様トレーサビリティ運用
- [ ] 仕様変更時に `requirements`/`technical-requirements`/`acceptance-test-spec` を同時更新する。
- [ ] PRチェック項目に「FR/TR/AT更新確認」を追加する。
  - チェック項目例:
    - `FR` 変更時に `TR` と `AT` を更新した
    - `NFR` 変更時に `AT` を更新した
  - 確認方法: 仕様変更PRで更新漏れが発生しない。

## 4. 実装着手の完了条件（Definition of Ready）
- [ ] 3.1〜3.7の全項目が完了している。
- [ ] `doc/requirements.md` と `doc/technical-requirements.md` の技術方針が一致している。
- [ ] `doc/acceptance-test-spec.md` に全Must要件の受入ケースが存在する。
- [ ] チーム内で「この順序で着手する」合意が取れている。
