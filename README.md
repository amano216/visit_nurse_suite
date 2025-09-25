# 訪問看護臨床ツールアプリ

SOLID原則に基づいて設計された、訪問看護の臨床現場で使用する統合ツールアプリケーションです。GitHub Pagesで動作し、統一されたUIとグローバル検索、メニューシステムを提供します。

## 🚀 特徴

- **SOLID原則に基づく設計**: 保守性と拡張性を考慮したモジュラーアーキテクチャ
- **レスポンシブデザイン**: PC、タブレット、スマートフォンに対応
- **統一されたUI**: 一貫性のあるユーザーインターフェース
- **グローバル検索**: すべてのツールを横断的に検索可能
- **GitHub Pages対応**: 静的サイトとして簡単にデプロイ

## 🛠️ 含まれるツール（全26種類）

### 投薬・器具管理
- **CADDポンプ交換時期計算**: リザーバー容量、流量、レスキュー量から交換時期を算出
- **麻薬投与量計算**: モルヒネ、オキシコドン、フェンタニルの投与量と流量計算

### 栄養評価
- **Harris-Benedict式**: 基礎代謝量と総消費カロリーの計算
- **MNA評価**: 高齢者の栄養状態を30項目で総合評価
- **BMI計算**: 体格指数の計算と肥満度判定
## 🛠️ 含まれるツール（最新版・主要カテゴリ）
### 重症度・予後評価
- **qSOFA**: 敗血症の重症度を3項目で迅速評価
### 投薬・器具管理
- **PPI**: がん患者の予後を5項目で予測
- **SIRS**: 全身性炎症反応症候群の4項目診断基準
 - **酸素ボンベ残時間**: 残圧と流量から使用可能時間を推定（在宅酸素支援）

### 意識・認知評価
### 栄養評価
- **MMSE**: 認知機能を6領域30点満点で評価

### 専門評価ツール
- **創傷評価（DESIGN-R）**: 褥瘡の深さ・滲出液・炎症等を7項目で評価
- **疼痛評価（NRS）**: 0-10の数値スケールによる疼痛強度評価
- **Barthel Index**: 日常生活動作10項目による自立度評価
### 重症度・予後評価
 - **心不全評価（NYHA/Framingham/プロファイル）**: 症状・所見から重症度と対応を推奨
 - **呼吸評価（mMRC/CAT/S/F比）**: 呼吸症状と在宅酸素条件から評価
 - **ALS-FRS-R**: 12項目0-4点で機能評価（合計0-48）

### 上級評価・横断ツール
- **Braden褥瘡リスク**: 6項目（6–23点）で圧迫による褥瘡リスクを評価
- **Morse転倒リスク**: 6要素で転倒リスクを層別化
- **ESAS-r 症状評価**: 10症状を0–10で可視化し高負担症状を抽出
### 意識・認知評価
- **Cockcroft-Gault（CrCl）**: 年齢・体重・血清Crから腎機能を推定
- **急性意識障害（4項スクリーニング）**: 覚醒・見当識・注意・急性変化の簡易評価
 - **MoCA**: 軽度認知障害スクリーニング（30点）
 - **Mini-Cog**: 3語記銘と時計描画
 - **CAM**: せん妄診断支援（急性変化/注意/思考/意識）
 - **急性意識障害（4項スクリーニング）**
- **SARC-F（サルコペニア）**: 5項目0–2点でサルコペニアの可能性をスクリーニング
- **MUST 栄養リスク**: BMI・体重減少・急性疾患効果の3要素で栄養リスク判定
### 専門評価ツール
## 📁 プロジェクト構造

 - **PAINAD** / **Abbey Pain Scale**: 認知症患者向け疼痛行動評価
```
visit_nurse_suite/
 - **ABCD‑Stoma**: ストマ周囲皮膚の包括的評価補助
├── index.html              # メインHTMLファイル
├── css/
│   └── styles.css          # 統合スタイルシート
 - **Skin Tear（ISTAP）**: 皮膚裂傷のISTAP分類支援
├── js/
│   ├── app.js               # コアアプリケーション（SOLID原則）
### 上級評価・横断ツール
│   ├── advanced-tools.js    # 高度評価ツール実装
│   ├── specialty-tools.js   # 専門領域ツール実装（ストマ/心不全/呼吸/ALS）
│   └── expert-tools.js      # 上級/横断ツール実装（Braden/Morse/ESAS/PPS/CrCl/Delirium4/SARC-F/MUST）
├── .github/
│   └── copilot-instructions.md # 開発ガイドライン
└── README.md               # プロジェクトドキュメント
```

 - **Charlson CCI（併存疾患）**
 - 参考辞書: **STOPP/START**, **Beers**
 - **STOP‑Bang（睡眠時無呼吸）**
 - **DNAR/ACP支援**
 - **RASS‑PAL（鎮静評価）**
## 🚀 デプロイ方法

### GitHub Pagesでのデプロイ

1. このリポジトリをGitHubにプッシュ
2. GitHubリポジトリの Settings > Pages に移動
3. Source を "Deploy from a branch" に設定
4. Branch を "main" に設定し、フォルダは "/ (root)" を選択
5. Save をクリック

数分後、`https://[username].github.io/visit_nurse_suite` でアクセス可能になります。

### ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/[username]/visit_nurse_suite.git
cd visit_nurse_suite

# ローカルサーバーで実行（Python 3の場合）

# または Node.js の serve を使用
npx serve .
```

このアプリケーションは**SOLID原則**に従って設計されています：

### Single Responsibility Principle (単一責任の原則)
- `NavigationManager`: ナビゲーション機能のみを管理
- `SearchManager`: 検索機能のみを管理
- 各`Calculator`: 特定の計算ロジックのみを担当

### Open/Closed Principle (開放閉鎖の原則)
- `BaseTool`: 拡張に開いて修正に閉じた基底クラス
- 新しいツールは既存コードを変更せずに追加可能

### Liskov Substitution Principle (リスコフの置換原則)
- すべてのツールクラスは`BaseTool`と置き換え可能

### Interface Segregation Principle (インターフェース分離の原則)
- 各管理クラスは必要最小限のインターフェースのみを提供

### Dependency Inversion Principle (依存性逆転の原則)
- `ToolFactory`: 高レベルモジュールが低レベルモジュールに依存しない設計

## 🎨 カスタマイズ

### 新しいツールの追加

1. `js/additional-tools.js` に新しいツールクラスを作成：

```javascript
class NewTool extends BaseTool {
    constructor() {
        super('newtool', '新しいツール', 'ツールの説明');
    }
    
    getIcon() {
        return 'fas fa-new-icon';
    }
    
    renderContent() {
        return `<!-- ツールのHTML -->`;
    }
}
```

2. `ToolFactory.createTool()` メソッドに追加：

```javascript
'newtool': () => new NewTool(),
```

3. `index.html` のナビゲーションメニューに追加

### スタイルのカスタマイズ

`css/styles.css` ファイルでカラーテーマやレイアウトを変更できます：

```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2c3e50;
    --accent-color: #f39c12;
}
```

## 📱 対応ブラウザ

- Chrome (推奨)
- Firefox
- Safari
- Edge
- モバイルブラウザ

## 🤝 貢献

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🙏 謝辞

- Font Awesome: アイコンライブラリ
- 訪問看護の現場で働く医療従事者の皆様

## 📞 サポート

質問や問題がある場合は、GitHubのIssuesページでお知らせください。

---

**注意**: このツールは医療従事者向けの補助ツールです。最終的な診断や治療方針の決定は、必ず医師の判断に従ってください。