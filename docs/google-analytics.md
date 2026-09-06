# Google Analytics 4 による問い合わせ導線の計測

このサイトは GA4（測定 ID: `_config.yml` の `google_analytics`）で、トップページから問い合わせまでの導線を計測できるように設計している。
タグは `_includes/analytics.html` が本番ビルド（`JEKYLL_ENV=production`）のときだけ出力し、イベント送信は `assets/js/site.js` が行う。
開発時（`bundle exec jekyll serve`）はタグを読み込まず、送信されるはずのイベントをブラウザのコンソールに `[GA debug]` として出力する。

## コンテンツグループ

`gtag('config')` の `content_group` に、ページ種別を渡している（フロントマターの `ga_group`）。
GA4 の「コンテンツグループ」ディメンションでページ種別ごとの閲覧数を比較できる。

| ga_group   | 対象ページ                          |
| ---------- | ----------------------------------- |
| home       | トップページ                        |
| business   | /business/（開発のご相談）          |
| portfolio  | /portfolio/                         |
| contact    | /contact/                           |
| blog       | ブログ記事、/blog/、/tags/ など     |
| about      | /about/、/curriculum_vitae/、/presentations/ |
| page       | その他                              |

## カスタムイベント

| イベント名                    | 発火タイミング                                                       | 主なパラメータ                                |
| ----------------------------- | -------------------------------------------------------------------- | --------------------------------------------- |
| `cta_click`                   | 問い合わせページへ誘導するボタンのクリック                           | `cta_location`, `cta_label`, `link_url`       |
| `nav_click`                   | サービス詳細・ポートフォリオなど、導線上の内部リンクのクリック       | `cta_location`, `cta_label`, `link_url`       |
| `pricing_view`                | /business/ の料金セクションが画面に表示された                       | `page_path`                                   |
| `contact_view`                | /contact/ の表示                                                     | `entry_referrer`, `cta_location`（`?from=`）  |
| `contact_form_loaded`         | 問い合わせフォーム（Microsoft Forms の iframe）の読み込み完了        |                                               |
| `contact_form_engaged`        | 利用者がフォーム内にフォーカスを移した（入力を始めた）               |                                               |
| `contact_form_fallback_click` | iframe が表示されないときの直接リンクをクリック                      | `link_url`                                    |
| `contact_channel_click`       | X の DM、Messenger、メールなどフォーム以外の連絡手段をクリック       | `cta_label`（x / messenger / email）          |
| `external_article_click`      | トップページの「最近の発信」で note の記事・プロフィールをクリック            | `cta_label`（note / note_profile）            |
| `portfolio_link_click`        | ポートフォリオ内の外部リンク・関連記事のクリック                     | `cta_label`（作品名 / リンク名）              |
| `outbound_social`             | フッターの SNS リンクのクリック                                      | `cta_label`                                   |
| `share_click`                 | 記事・ページ末尾のシェアボタン（X / Facebook / LinkedIn）のクリック   | `cta_label`（x / facebook / linkedin）        |

`cta_location` の値は CTA の設置場所を表す（`header`, `hero`, `flow`, `footer`, `home_bottom`, `page_bottom`, `post_bottom`, `blog_bottom`, `portfolio_bottom`, `business_bottom`, `page_header`, `contact_page` など）。
どの場所の CTA が問い合わせに結びついているかを比較できる。

Microsoft Forms の iframe 内で送信が完了したことは、クロスオリジンのため親ページから検知できない。
そのため、フォームへの到達と入力開始（`contact_form_engaged`）を、このサイト側で計測できる最終地点としている。
実際の送信数は Microsoft Forms 側の回答数と照合する。

## GA4 側で行う設定

1. **カスタムディメンションの登録**（管理 > データの表示 > カスタム定義）
   - イベントスコープ: `cta_location`, `cta_label`, `entry_referrer`
2. **キーイベント（コンバージョン）の登録**（管理 > データの表示 > イベント）
   - `contact_form_engaged` をキーイベントにする（主要コンバージョン）
   - `contact_view` と `contact_channel_click` も補助的なキーイベントとして登録するとよい
3. **ファネルの作成**（探索 > 目標到達プロセスデータ探索）
   - ステップ例: `page_view`（トップ） → `page_view`（/business/） → `pricing_view` → `contact_view` → `contact_form_engaged`
   - 「ステップに時間制限を設ける」を有効にし、セッション内での遷移を見ると導線の離脱箇所が分かる
4. **CTA 別の比較**
   - 探索で `cta_click` をイベント名に指定し、`cta_location` ディメンションで内訳を見る

## 新しい CTA を追加するとき

リンクに `data-ga` 属性を付けるだけで計測対象になる。

```html
<a href="/contact/" data-ga="cta_click" data-ga-location="new_section">無料相談を申し込む</a>
```

Markdown 内では kramdown の IAL で属性を付けられる。

```markdown
[お問い合わせフォームへ](/contact/){: .button .button--primary data-ga="cta_click" data-ga-location="business_bottom"}
```
