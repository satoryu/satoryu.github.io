---
title: "Railsでウィザード形式のフォームを実装する時はテーブルを分けよう"
header:
  teaser: https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20190811/20190811081742.jpg
category: blog
tags: [Rails,アンチパターン,Ruby,設計]
toc: true
---
<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20190811/20190811081742.jpg" alt="f:id:satoryu:20190811081742j:plain" title="f:id:satoryu:20190811081742j:plain" class="hatena-fotolife" itemprop="image"></span>
<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@esteejanssens?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Estée Janssens"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Estée Janssens</span></a></p>

<p>ユーザーへの入力を便利にしようと、ウィザード形式を採用しようと思って、試しに雑に作ってみた時にハマってしまった。</p>

<h2 id="例">例</h2>

<p>実際のコードは晒せないので、サンプルとして以下のような状況を考える。</p>

<p>例えば、プロフィールサービスを作っていて、ユーザー登録後にユーザーのニックネームや<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A2%A5%D0%A5%BF%A1%BC">アバター</a>画像、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Twitter">Twitter</a>や<a class="keyword" href="http://d.hatena.ne.jp/keyword/Facebook">Facebook</a>など<a class="keyword" href="http://d.hatena.ne.jp/keyword/SNS">SNS</a>のアカウント情報を入力させたくて、ウィザード形式を採用しようとしている。とする。</p>

<p>ここで、プロフィール入力を2ステップで構成されるウィザード形式にしたい。</p>

<ol>
<li>ニックネームと誕生日を入力</li>
<li>各<a class="keyword" href="http://d.hatena.ne.jp/keyword/SNS">SNS</a>のプロフィールのURL</li>
</ol>


<p>また、各プロフィールは必須入力としたい。</p>

<p>当初はウィザード形式は考慮していない実装だったので、ユーザー登録後に入力する情報は、いずれもユーザーのプロフィールということで<code>profiles</code>テーブルに登録する。
テーブルの<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%B9%A5%AD%A1%BC%A5%DE">スキーマ</a>は以下のようになる。</p>

```ruby
ActiveRecord::Schema.define(version: 2019_08_11_000716) do
  create_table "profiles", force: :cascade do |t|
    t.string "nickname"
    t.date "birthday"
    t.string "twitter_profile_url"
    t.string "facebook_profile_url"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end
end
```

<h2 id="良くない実装">良くない実装</h2>

<p>必須入力の項目のチェックするために、<code>Profile</code>モデルにバリデーションを設定する。</p>

```ruby
class Profile < ApplicationRecord
  validates :nickname, presence: true
  validates :birthday, presence: true
  validates :twitter_profile_url, presence: true
  validates :facebook_profile_url, presence: true
end
```

<p>これだけだと、ウィザードの最初のステップでニックネームと誕生日を入力し、その時点の情報を<code>profiles</code>に保存する時にその後に入力する<code>twitter_profile_url</code>などのバリデーションによって止められてしまう。
<code>validates</code>メソッドの<code>on</code>オプションで、そのバリデーションを有効にするタイミングを制御することができるので、それを使うことで一応は解決できそうではある。</p>

```ruby
class Profile < ApplicationRecord
  validates :nickname, presence: true, on: [:step1, :step2]
  validates :birthday, presence: true, on: [:step1, :step2]
  validates :twitter_profile_url, presence: true, on: :step2
  validates :facebook_profile_url, presence: true, on: :step2
end
```

<p>このようにしておけば、モデルを保存する時に、<code>save(context: :step1)</code> などとすればステップごとに有効にしたいバリデーションを指定できる。</p>

<h3 id="問題点">問題点</h3>

<p><code>on</code> オプションでバリデーションを追加すると、指定されたコンテキストでしかバリデーションが実行されないので、通常のsaveやupdate時にも有効にさせたい場合との区別が難しい。
このウィザード以外に<code>Profile</code>を保存や更新する場合に、必須入力であるということがチェックされない。チェックするにはコンテキストを指定する必要がある。</p>

<h2 id="良さそうな実装">良さそうな実装</h2>

<p><code>profiles</code>テーブルを分割する。
そもそもウィザード形式で分ける時に、各ステップでの入力項目には意味がある単位にわかれているはず。そうでなければ、何の入力の助けにもならない。</p>

<p>ということで、ニックネームと誕生日、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Twitter">Twitter</a>と<a class="keyword" href="http://d.hatena.ne.jp/keyword/Facebook">Facebook</a>のURLとそれぞれの組でテーブルを分ける。</p>

```ruby
ActiveRecord::Schema.define(version: 2019_08_11_134450) do
  create_table "profiles", force: :cascade do |t|
    t.string "nickname"
    t.date "birthday"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "social_profiles", force: :cascade do |t|
    t.string "twitter_profile_url"
    t.string "facebook_profile_url"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_social_profiles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end
end
```

<p>当然だが、こうするとバリデーションは普通の記述になる。</p>

```ruby
class Profile < ApplicationRecord
  belongs_to :user

  validates :nickname, presence: true
  validates :birthday, presence: true
end

class SocialProfile < ApplicationRecord
  belongs_to :user

  validates :twitter_profile_url, presence: true
  validates :facebook_profile_url, presence: true
end
```

<h2 id="おわりに">おわりに</h2>

<p>ウィザード形式を採用する場合に、テーブルを意味のある単位に分割することでバリデーションが複雑にならずに済む。
データの設計がコードに影響することがわかる例だと思う。</p>

<p>分割することで悪い影響はまったく無いのだろうか。
1つあるとすれば、分割されたテーブルの情報を使ってユーザーを検索する場合にJOINするコストが発生することくらいではないだろうか。
例えば、上の例で、<code>social_profiles</code>テーブルの<code>twitter_profile_url</code>と<code>profiles</code>テーブルの<code>name</code> を<code>users</code>テーブルのSELECT文のWHERE句で使う場合だ。
2つのテーブルくらいなら大丈夫そうだが、増えていった場合はパフォーマンスの影響も考慮した分割の方法を検討すると良いのかもしれない。</p>

<p>また、既に稼働しているサービスの場合、分割に際してデータ移行が必要となる。</p>

<h2 id="参考">参考</h2>

<p>2年前くらいに読んだ「システム設計の原則」の中で似たようなことをやっていたのを思い出したのがきっかけ。
あらためてその部分を読もうと思ったのだけど、失くしてしまったのか、後輩にあげてしまったようなので、また買うかな…</p>

<p><div class="hatena-asin-detail"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/477419087X/satoryuhatenablog-22/"><img src="https://images-fe.ssl-images-amazon.com/images/I/51fm-EVWsnL._SL160_.jpg" class="hatena-asin-detail-image" alt="現場で役立つシステム設計の原則 ~変更を楽で安全にするオブジェクト指向の実践技法" title="現場で役立つシステム設計の原則 ~変更を楽で安全にするオブジェクト指向の実践技法"></a><div class="hatena-asin-detail-info"><p class="hatena-asin-detail-title"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/477419087X/satoryuhatenablog-22/">現場で役立つシステム設計の原則 ~変更を楽で安全にするオブジェクト指向の実践技法</a></p><ul><li><span class="hatena-asin-detail-label">作者:</span> 増田亨</li><li><span class="hatena-asin-detail-label">出版社/メーカー:</span> <a class="keyword" href="http://d.hatena.ne.jp/keyword/%B5%BB%BD%D1%C9%BE%CF%C0%BC%D2">技術評論社</a></li><li><span class="hatena-asin-detail-label">発売日:</span> 2017/07/05</li><li><span class="hatena-asin-detail-label">メディア:</span> 単行本（ソフトカバー）</li><li><a href="http://d.hatena.ne.jp/asin/477419087X/satoryuhatenablog-22" target="_blank">この商品を含むブログ (1件) を見る</a></li></ul></div><div class="hatena-asin-detail-foot"></div></div></p>

