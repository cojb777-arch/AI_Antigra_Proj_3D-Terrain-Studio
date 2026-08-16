# Google Antigravity 開発指示書: 次世代 AI クラウド会計システム MVP

## 1. プロジェクト概要
高精度な複式簿記計算エンジン、Google Cloud / Gemini API による領収書 AI 自動記帳、電帳法・インボイス制度対応、リアルタイム財務分析（B/S・P/L・CVP損益分岐点分析）を備えた Next.js ベースの会計ソフト MVP の構築。

---

## 2. 技術スタック & アーキテクチャ原則
- **フロントエンド:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide React
- **バックエンド:** Next.js Server Actions, Prisma ORM
- **データベース:** PostgreSQL (`Decimal` / `NUMERIC` 型の徹底利用)
- **計算精度:** `decimal.js` による小数点・端数処理（JavaScript の `Number` による浮動小数点演算は禁止）
- **クラウド & AI:** Google Cloud Storage (GCS 署名付き URL), Gemini 1.5 Flash (マルチモーダル AI 解析), 国税庁適格請求書発行事業者公表 Web API

---

## 3. データベース設計 (`prisma/schema.prisma`)
- 勘定科目 (`Account` / `costType`: 変動費 VARIABLE / 固定費 FIXED)
- 仕訳伝票 & 明細 (`JournalEntry`, `JournalLine` / `Decimal` 精密管理)
- 電帳法対応・変更監査ログ (`AuditLog`)
- 銀行明細 & 自動仕訳ルール (`BankStatement`, `AutoJournalRule`)
- 請求書モデル (`Invoice`, `InvoiceItem`)

---

## 4. モジュール構成
1. 爆速キーボード仕訳入力 UI & バリデーション (`/journal-entries`)
2. 電帳法対応（不変修正・赤黒処理）& 監査ログ可視化
3. インボイス制度対応 & 国税庁 API 連携
4. AI 領収書自動記帳パイプライン (スプリットビュー画面 `/receipts/unapproved`)
5. 財務諸表 & 損益分岐点 (CVP) 分析エンジン (`/reports/cvp`, `/reports/financial-statements`)
6. 印刷・PDF 出力最適化
7. 統合ダッシュボードレイアウト (`/dashboard`, `/`)
