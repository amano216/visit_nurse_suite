# 訪問看護臨床ツールアプリ

## プロジェクト概要
SOLID原則に従った訪問看護の臨床で使用するツールアプリケーション。GitHub Pagesで動作し、統一されたUIとグローバル検索、メニューシステムを提供。

## 完了済みタスク
- [x] プロジェクト要件の明確化
- [x] プロジェクト構造の作成完了
- [x] 基本HTMLページの実装
- [x] CSSスタイリングの実装
- [x] JavaScript SOLID原則アーキテクチャの実装
- [x] 全ツールクラスの実装完了
- [x] README.mdドキュメンテーション作成
- [x] ローカルサーバーテスト完了

## 実装済みツール（全18種類）
**投薬・器具管理：**
- CADDポンプ交換時期計算ツール
- 麻薬投与量計算ツール（モルヒネ、オキシコドン、フェンタニル）

**栄養評価：**  
- Harris-Benedict式（基礎代謝量・総消費カロリー）
- MNA-SF（高齢者栄養状態・短縮版6項目評価）  
- BMI計算（体格指数・肥満度判定）

**重症度・予後評価：**
- qSOFA（敗血症重症度3項目評価）
- NEWS（早期警告スコア・生理学的パラメータ）
- PPI（がん予後指数5項目評価）
- SIRS（全身性炎症反応症候群4項目診断）

**意識・認知評価：**
- GCS（Glasgow Coma Scale・意識レベル）
- MMSE（認知機能6領域30点評価）

**専門評価ツール：**
- 創傷評価（DESIGN-R・褥瘡7項目分類）
- 疼痛評価（NRS・数値スケール疼痛評価）
- Barthel Index（ADL・日常生活動作10項目）
 - ストマケア（DET・装具選定支援）
 - 心不全評価（NYHA・Framingham・Warm/Cold & Wet/Dry）
 - 呼吸評価（mMRC・CAT・S/F比）
 - ALS-FRS-R（12項目・機能評価0-48点）

## アーキテクチャ特徴
- Single Responsibility: 各クラスが単一の責任を持つ
- Open/Closed: 拡張に開いて修正に閉じた設計
- Liskov Substitution: 基底クラスと置き換え可能
- Interface Segregation: 必要最小限のインターフェース
- Dependency Inversion: 高レベルモジュールが低レベルに依存しない

## GitHub Pagesデプロイ準備完了
プロジェクトはGitHub Pagesで即座にデプロイ可能です。