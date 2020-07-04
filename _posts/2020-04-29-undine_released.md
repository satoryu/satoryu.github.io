---
title: "捕捉できなかった例外を勝手にググってくれるUndine をリリースしました"
header:
  teaser: https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20200429/20200429164857.jpg
category: blog
tags: [Ruby,Rubygem,OSS]
---

コード内で捉えられなかった例外が発生した場合にそのエラーメッセージを検索してくれるgemをリリースしました。

<!-- more -->

<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20200429/20200429164857.jpg" alt="f:id:satoryu:20200429164857j:plain" title="f:id:satoryu:20200429164857j:plain" class="hatena-fotolife" itemprop="image"></span>
<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@grohsfabian?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Fabian Grohs"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Fabian Grohs</span></a></p>

<p>開発中のコードを試しに実行してみたところ、思いがけない例外が出てしまった。
そういう時はどうするだろうか。
出てきたエラーメッセージを読み、何が原因なのかを探るのではないでしょうか。
自分も<a class="keyword" href="http://d.hatena.ne.jp/keyword/google">google</a>などで検索して、例外に関するドキュメントを探したりします。</p>

<p>その手間を助けるために、コード内で捉えられなかった例外が出た場合に自動でブラウザを起動してエラーメッセージをキーワードとして検索してくれるgemを作りました。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fsatoryu%2Fundine" title="satoryu/undine" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/satoryu/undine">github.com</a></cite></p>

<h2>使い方</h2>

<h3>インストール</h3>

<p>下記のように<code>gem</code>コマンドでインストールできます。</p>

```sh
gem install undine
```

<p>bundlerをお使いの方は<code>Gemfile</code>に下記の一行を追加し、<code>bundle install</code> を実行するとインストールできます。</p>

```ruby
gem `undine`, require: 'undine/autoload', group: :development
```

<h3>使い方</h3>

<p>お使いの<a class="keyword" href="http://d.hatena.ne.jp/keyword/Ruby">Ruby</a><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8">スクリプト</a>のはじめの方に以下のコードを追加します。</p>

```ruby
require 'undine'
Undine.load
```

<p>これだけで、どこにも捕捉されなかった例外が出たときに、例外メッセージを検索する<a class="keyword" href="http://d.hatena.ne.jp/keyword/google">google</a> のページがブラウザで開かれます。</p>

<p>既存の<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8">スクリプト</a>に手を入れたくない場合は、<code>undine/autoload</code> を実行時に指定してください。</p>

```sh
ruby -r'undine/autoload' your_script.rb
```

<p>bundlerを利用している場合は、<code>Gemfile</code>中の<code>gem</code>メソッドに<code>require</code>オプションを追加してください。</p>

```ruby
gem `undine`, require: 'undine/autoload', group: :development
```

<h2>バグ報告、ご意見はこちら</h2>

<p>利用してくださった皆様からの感想、ご意見、バグ報告なんでもお待ちしております。
何かございましたら<a href="https://github.com/satoryu/undine/issues/new/choose">GitHub Issue</a>から連絡いただけると助かります。</p>

