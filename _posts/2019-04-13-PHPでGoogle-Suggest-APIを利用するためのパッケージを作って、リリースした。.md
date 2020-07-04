---
title: "PHPでGoogle Suggest APIを利用するためのパッケージを作って、リリースした。"
category: blog
tags: [PHP,Packagist]
---
<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fpackagist.org%2Fpackages%2Fsatoryu%2Fgoogle_suggest" title="satoryu/google_suggest - Packagist" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://packagist.org/packages/satoryu/google_suggest">packagist.org</a></cite></p>

<p>タイトルの通りなのですが、先日、<code>google_suggest</code> という<a class="keyword" href="http://d.hatena.ne.jp/keyword/PHP">PHP</a>ライブラリをリリースしました。</p>

<blockquote><p><a class="keyword" href="http://d.hatena.ne.jp/keyword/Google">Google</a>みたいなサジェスト機能を作りたい！</p></blockquote>

<p>といった時に是非ご活用ください。</p>

<p>以下は、開発のときの余談です。</p>

<h2>動機</h2>

<p>特別にこれを作りたいといった思いや、業務上必要になったという理由はありません。
本当に作りたいものはあるので、それの準備として、<a class="keyword" href="http://d.hatena.ne.jp/keyword/PHP">PHP</a>ライブラリをパッケージにして配布するまでの開発のやり方を知るために作りました。</p>

<h2>ネタ選び</h2>

<p>上に書いたように、今回は作り方を学ぶことが目的なので、他に挑戦のようなものを入れると余計なことでハマってしまうと思い、予め実装したい機能が明確にわかっているネタを選ぶことにしました。</p>

<p>そこで、以前から自分が開発・メンテしている<a href="https://github.com/satoryu/google_suggest"><code>google_suggest</code></a> というRubygemがあったので、それを書き直すことにしました。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fsatoryu%2Fgoogle_suggest" title="satoryu/google_suggest" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/satoryu/google_suggest">github.com</a></cite></p>

<h2>学んだこと</h2>

<p>当初想定していたことよりも、いろいろと学ぶことはありました。
なるべく新しいことを極力落としても、やはり当初想定していないこととか、後になって気づくことがあるということを実感しました。</p>

<p>学んだことを並べてみると、</p>

<ul>
<li>composerコマンドで初期化</li>
<li>独自のcomposer コマンドの追加方法</li>
<li>依存パッケージのバージョン指定方法（<code>~x.y.z</code> や<code>^x.y.z</code>の違い）</li>
<li>packagist.org でパッケージを公開する方法</li>
<li><a class="keyword" href="http://d.hatena.ne.jp/keyword/PHPUnit">PHPUnit</a>の使い方</li>
<li><a href="https://github.com/bobthecow/psysh">Psysh</a> を使った<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%D0%A5%C3%A5%B0">デバッグ</a></li>
<li>HTTPクライアントライブラリGuzzleの使い方</li>
<li><a class="keyword" href="http://d.hatena.ne.jp/keyword/XML">XML</a>パーサー<code>SimpleXMLElement</code> の使い方</li>
<li>HTTPレスポンスのモックの作り方</li>
<li><a class="keyword" href="http://d.hatena.ne.jp/keyword/PHP">PHP</a>ライブラリのCI（<a class="keyword" href="http://d.hatena.ne.jp/keyword/Travis">Travis</a>-CI）の設定</li>
</ul>


<p>と、こんな感じでした。</p>

