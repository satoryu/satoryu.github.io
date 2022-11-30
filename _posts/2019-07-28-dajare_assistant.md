---
title: "Google AssistantのバックエンドをAzure WebAppで作った。"
category: blog
tags: [Google Assistant,Node.js,Express,Azure,Azure WebApps]
---
<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/Google%20Home">Google Home</a>で音声を入力とした何かを今後作るかもしれないので、試しに<a class="keyword" href="http://d.hatena.ne.jp/keyword/Google">Google</a> Assistantを作るための<a class="keyword" href="http://d.hatena.ne.jp/keyword/Actions%20on%20Google">Actions on Google</a>とDialogflowを使った開発をしてみた。</p>

<p>初めて触れる技術のことなので、アプリケーションのネタはとてもシンプルにこれまで作ってきた<a href="https://dajare.herokuapp.com/">駄洒落の自動生成</a>にした。
で、実際にできたものがこちら。</p>

<p><iframe width="459" height="344" src="https://www.youtube.com/embed/OLB7wRAGiIY?feature=oembed" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><cite class="hatena-citation"><a href="https://www.youtube.com/watch?v=OLB7wRAGiIY">www.youtube.com</a></cite></p>

<p>バックエンドを、Firebase Functionsで作ろうと思ったのだが、無料版だと外部へのネットワーク接続ができないため諦めた。バックエンドは、Webhookの呼び出しを受けられれば何でも良いので、今回は普段から慣れているAzure WebAppを使うことにした。本当は、Azure Functionsにしたかったのだが、npmパッケージの<code>actions-on-google</code>がサポートしていなかったので、WebApp上で動くnode.jsアプリケーションとして作った。</p>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%BD%A1%BC%A5%B9%A5%B3%A1%BC%A5%C9">ソースコード</a>は、こちら。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fsatoryu%2Fdajare-assistant" title="satoryu/dajare-assistant" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/satoryu/dajare-assistant">github.com</a></cite></p>

<p>ユーザーの認証や、リソースへのアクセス権限を取得したりできるようなので、できることは色々ありそう。</p>

