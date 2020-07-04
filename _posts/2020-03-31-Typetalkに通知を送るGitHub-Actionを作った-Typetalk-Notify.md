---
title: "Typetalkに通知を送るGitHub Actionを作った: Typetalk Notify"
header:
  teaser: https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20200331/20200331104506.png
category: blog
tags: [GitHub,GitHub Actions,Node.js,Typetalk,OSS,ヌーラボ]
---
<p>無料プランがあるということでなんとなくTypetalkを使い始めてみた。
Slackなんかと同じように<a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a>やWebhookなどがありカスタマイズが可能で、<a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a>との連携もサポートされている。</p>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a>と連携することで、ブランチのプッシュ、Issueやプルリク<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9">エス</a>トの作成・変更が起きる度に通知がTypetalkのトピック（Slackのチャネルに相当）に届くようになる。</p>

<p>しかし、リリースなどどうやらサポートされていないイベントが一部あり、またメッセージをカスタマイズしたいことがある。
ということで、<a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a> Actionsを作ってみた。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fmarketplace%2Factions%2Ftypetalk-notify" title="Typetalk Notify - GitHub Marketplace" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/marketplace/actions/typetalk-notify">github.com</a></cite></p>

<h2>使い方</h2>

<p>オプションについては<a href="https://github.com/satoryu/typetalk-notify/blob/master/README.md">README</a>を参照してほしい。
同じREADMEに記載されているworkflowファイルの記述例を載せる。</p>

```yaml
name: Release announce

on:
  release:
    types: [published]

jobs:
  steps:
    - uses: satoryu/typetalk-notify@v0.0.1
      with:
        token: $
        topic_id: 165952  # Replace your topic's id
        message: "$ $ has been released :tada: :white_flower:"
```

<p>この設定ファイルを<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA">リポジトリ</a>の<code>.github/workflows/</code> <a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8">ディレクト</a>リ以下に<code>release_announce.yml</code> などのようにして保存する。
その後に、release tagを作ると、以下のような通知がTypetalkのトピックに投稿されるようになる。</p>

<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20200331/20200331104506.png" alt="f:id:satoryu:20200331104506p:plain" title="f:id:satoryu:20200331104506p:plain" class="hatena-fotolife" itemprop="image"></span></p>

<p>上に書いた設定を変更すれば、push時やissue作成時など別の<a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a>上のイベントが発生した時に好みのメッセージを投稿することができる。</p>

<h2>おまけ: <a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a> <a class="keyword" href="http://d.hatena.ne.jp/keyword/Hackathon">Hackathon</a> にエントリー</h2>

<p>ちなみに、3/31まで<a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a> <a class="keyword" href="http://d.hatena.ne.jp/keyword/Hackathon">Hackathon</a>が開催されていて、<a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a> Actionsがテーマになっている。
ちょうど良かったので今回作成したActionでエントリーしてみた。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithubhackathon.com%2F" title="GitHub Hackathon: Build something new with us" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://githubhackathon.com/">githubhackathon.com</a></cite></p>

