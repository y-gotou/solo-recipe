## PRチェックリスト

### 変更内容
<!-- 変更の概要を記載 -->

### テスト
- [ ] `pnpm lint` が通過する
- [ ] `pnpm typecheck` が通過する
- [ ] `pnpm test` が通過する（追加・変更した機能のテストを含む）

### 仕様トレーサビリティ（3.7・仕様変更を伴う場合のみ）
- [ ] FR-* を変更した場合、`doc/technical-requirements.md` の TR-* を更新した
- [ ] FR-* を変更した場合、`doc/acceptance-test-spec.md` の AT-* を更新した
- [ ] NFR-* を変更した場合、`doc/technical-requirements.md` と `doc/acceptance-test-spec.md` を更新した
- [ ] AT-* を追加・削除した場合、FR-AT および NFR-AT 対応表を更新した

### その他
<!-- レビュワーへの補足、関連Issueなど -->
