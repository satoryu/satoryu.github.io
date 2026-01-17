# CLAUDE.md

このファイルは、このリポジトリで作業する際の Claude Code (claude.ai/code) へのガイダンスを提供する。

## プロジェクト概要

これは佐藤竜也の個人ブログおよびポートフォリオサイトで、Jekyll ベースで構築されている。GitHub Pages で https://www.satoryu.com にホストされており、Minimal Mistakes テーマを使用している。

## 開発コマンド

### ビルドとローカルサーバー起動
```bash
bundle install           # Ruby 依存関係のインストール
bundle exec jekyll serve # ローカル開発サーバーの起動 (http://localhost:4000)
bundle exec jekyll build # 静的サイトを _site/ にビルド
```

### 文章チェック（Lint）
```bash
npm install   # Node.js 依存関係のインストール（初回のみ）
npm run lint  # _posts/ と _pages/ の日本語ブログ記事に textlint を実行
```

**重要: `_posts/` または `_pages/` にドキュメントを作成・更新した場合は、必ず `npm run lint` を実行して文章をチェックすること。**

textlint のルールは日本語の文章規則を適用する:
- さ抜き言葉の禁止
- 読点の連続使用制限
- 二重否定の禁止
- ら抜き言葉の禁止
- である調・ですます調の統一
- 日本語のスペーシングルール

## アーキテクチャ

### コンテンツ構成
- `_posts/`: ブログ記事（Markdown 形式、YYYY-MM-DD-title.md のファイル名形式）
- `_pages/`: 静的ページ（自己紹介、職務経歴、登壇資料、お問い合わせなど）
- `_data/navigation.yml`: サイトナビゲーションの設定
- `_includes/`: カスタム HTML パーシャル（リンクプレビュー、カスタムヘッドなど）
- `_cache/`: jekyll-linkpreview のキャッシュファイル
- `assets/`: 画像（`img/`）とスタイル（`styles/custom.css`）

### テーマと設定
- テーマ: `minimal-mistakes-jekyll`（gem としてインストール、リモートテーマではない）
- スキン: `dirt`
- 主なプラグイン: jekyll-feed, jekyll-sitemap, jekyll-linkpreview, jekyll-tagging, jemoji, jekyll-gfm-admonitions

### CI/CD パイプライン
GitHub Actions ワークフロー（`.github/workflows/build.yml`）:
1. **lint**: 記事とページに textlint を実行
2. **build**: Ruby 3.3 で Jekyll ビルドを実行
3. **deploy**: GitHub Pages にデプロイ（master へのプッシュ時）

## 言語

ブログのコンテンツは日本語で書かれている。
