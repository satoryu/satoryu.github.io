# CLAUDE.md

このファイルは、このリポジトリで作業する際の Claude Code (claude.ai/code) へのガイダンスを提供する。

## プロジェクト概要

これは佐藤竜也の個人サイトで、Jekyll ベースで構築されている。GitHub Pages で https://www.satoryu.com にホストされている。
個人ブログであると同時に、個人事業主として行うソフトウェア開発の業務委託の問い合わせを呼び込むためのサイトでもある。訪問者が「相談してみたい」と思い、/contact/ に到達することをサイト全体の目的としている。

テーマは外部の gem を使わず、このリポジトリ内で独自に実装している（`_layouts/`、`_includes/`、`_sass/`）。

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

### ブログ記事の文体
`_posts/` に記事を書く・直すときは、textlint に加えて **`docs/writing-style.md` の文体ルールに従うこと**。
過去の Blog 記事と note の記事から読み取った本人の癖（一人称は「自分」、1 文 1 行、TL;DR と「おわりに」の型、リンク文言はページタイトル、脚注の使い方、具体的な状況から書き始めて自分の次の行動か問いで終えるなど）をまとめてある。
note 向けの文章を頼まれたときも同じ文書の第 9 節に従う（である調、段落に複数文、文のような見出し）。
記事を書き終えたら、このルールに照らしてセルフレビューし、外れている箇所を直してから完了とする。

textlint のルールは日本語の文章規則を適用する:
- さ抜き言葉の禁止
- 読点の連続使用制限
- 二重否定の禁止
- ら抜き言葉の禁止
- である調・ですます調の統一
- 日本語のスペーシングルール

## アーキテクチャ

### コンテンツ構成
- `index.md`: トップページ（`layout: home`）。文言は `_data/home.yml`、サービスは `_data/services.yml` から読み込む
- `_posts/`: ブログ記事（Markdown 形式、YYYY-MM-DD-title.md のファイル名形式）。URL は `/:categories/YYYY/MM/DD/title.html`
- `_pages/`: 静的ページ（自己紹介、職務経歴、講演資料、開発のご相談、ポートフォリオ、お問い合わせなど）
- `_data/navigation.yml`: ヘッダー・フッターのメニュー
- `_data/home.yml`: トップページの文言（ヒーロー、お悩み、選ばれる理由、進め方）
- `_data/services.yml`: 提供サービス（id は `/business/` の見出しアンカーと一致させる）
- `_data/portfolio.yml`: ポートフォリオの掲載内容（`featured: true` はトップページにも表示）
- `_data/note_posts.json`: note の記事一覧。`scripts/fetch_note_posts.rb` が RSS から生成する（手で編集しない）
- `_cache/`: jekyll-linkpreview のキャッシュファイル
- `assets/img/`: 画像、`assets/css/main.scss`: スタイルのエントリポイント、`assets/js/site.js`: ナビ・目次・GA イベント
- `docs/`: 開発者向けドキュメント（サイトには公開されない）

### 独自テーマ
- `_layouts/`: `default`（骨格）、`home`、`page`、`post`、`blog`、`portfolio`、`contact`、`tags`、`categories`
- `_includes/`: `head`、`seo`（OGP・JSON-LD）、`analytics`（GA4）、`header`、`footer`、`cta`（問い合わせ誘導バンド）、`post-card`、`linkpreview`、`inquiry_form`、`icons`
- `_sass/`: `_tokens`（色・フォント・余白の変数）、`_base`、`_layout`、`_components`、`_home`、`_prose`（本文）、`_syntax`
- ページのフロントマターで使えるもの: `toc: true`（目次を表示）、`lead`（見出し下の説明）、`eyebrow`、`actions`（見出し下のボタン）、`hide_cta: true`、`ga_group`
- 既存記事との互換のため `.text-center`、`.text-right`、`.full`、`.notice--*` クラスを維持している

### Google Analytics
- 本番ビルド（`JEKYLL_ENV=production`）のみタグを出力する。開発時はイベントをコンソールに `[GA debug]` として出力する
- 問い合わせ導線のリンクには `data-ga="cta_click" data-ga-location="場所"` を付けると自動で計測される
- 詳細は `docs/google-analytics.md` を参照

### note 連携
- トップページの「最近の発信」は Blog と note（https://note.com/satoryu）の記事を混ぜて表示する。詳細は `docs/note-integration.md` を参照

### 主なプラグイン
github-pages gem が `safe: true` を強制するため、`_plugins/` の独自プラグインは読み込まれない（本番の GitHub Pages でも同様）。Gemfile の `:jekyll_plugins` グループにある gem のみ使える。

jekyll-feed, jekyll-sitemap, jekyll-linkpreview, jekyll-tagging-related_posts, jemoji, jekyll-gfm-admonitions

### CI/CD パイプライン
GitHub Actions ワークフロー（`.github/workflows/build.yml`）:
1. **lint**: 記事とページに textlint を実行
2. **build**: Ruby 3.3 で Jekyll ビルドを実行
3. **deploy**: GitHub Pages にデプロイ（master へのプッシュ時）

## 言語

ブログのコンテンツは日本語で書かれている。
