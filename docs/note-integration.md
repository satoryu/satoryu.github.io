# note 記事のトップページ掲載

トップページの「最近の発信」セクションには、このサイトの Blog と note（https://note.com/satoryu）の記事を混ぜてカード表示している。

## 仕組み

1. `scripts/fetch_note_posts.rb` が note の RSS（`https://note.com/<username>/rss`）を取得し、`_data/note_posts.json` に書き出す。
   - タイトル、URL、公開日時、要約（本文の先頭 120 文字）、サムネイル画像（OGP 相当）を保存する
   - 取得に失敗したときは既存の JSON を残して正常終了する（ビルドは止まらない）
2. `_layouts/home.html` が Blog の最新 3 件と note の最新 3 件を取り、日付順に並べる（Liquid のみで実装。github-pages gem は safe モードで `_plugins/` を読み込まないため、独自プラグインは使えない）。
   - 媒体ごとに枠を設けているのは、note の更新頻度が高くても Blog が必ず見えるようにするため
   - `_config.yml` の `note.exclude` に URL を列挙すると、その記事は載らない
3. `_includes/article-card.html` がカードを描画する。note の記事は新しいタブで開き、GA4 に `external_article_click` を送る。

## 更新のタイミング

- GitHub Actions のビルド直前に取得スクリプトを実行する（`.github/workflows/build.yml`）
- 毎日 6 時（JST）に定期ビルドが走るので、note に投稿すれば翌朝までにトップページへ反映される。急ぐときは Actions の「Run workflow」で手動実行できる
- `_data/note_posts.json` はリポジトリにコミットしておく。ローカルビルドや note.com 障害時のフォールバックになる

## ローカルで更新する

```bash
bundle exec ruby scripts/fetch_note_posts.rb
```


## note 側の運用

- Blog は「やったこと・技術の記録」、note は「考え・判断の背景・仕事の進め方」と役割を分ける
- note の記事末尾に `https://www.satoryu.com/business/?utm_source=note&utm_medium=article` へのリンクを定型で入れると、GA4 で note 経由の問い合わせを追える
- サイトに載せたくない記事は `_config.yml` の `note.exclude` に URL を追加する
