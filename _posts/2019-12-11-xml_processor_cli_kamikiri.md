---
title: "XML文書からXPathで要素を抜き出すCLIツールを作った"
category: blog
tags: [rubygems,XML,Nokogiri,OSS,Ruby]
---
<p>この記事は<a class="keyword" href="http://d.hatena.ne.jp/keyword/Ruby">Ruby</a> Advent Calendar 2019 10日目の記事です。</p>

<p>久しぶりに<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A2%A5%C9%A5%D9%A5%F3%A5%C8%A5%AB%A5%EC%A5%F3%A5%C0%A1%BC">アドベントカレンダー</a>にエントリーしたので、最近作ってみたいと思った地味なgemを作りました。</p>

<h2>TL;DR</h2>

<p>作ったものはこちらです。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fsatoryu%2Fkamikiri" title="satoryu/kamikiri" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/satoryu/kamikiri">github.com</a></cite></p>

<blockquote><p>しかしながら<a class="keyword" href="http://d.hatena.ne.jp/keyword/Rubygems">Rubygems</a>.orgのMFAで詰まってしまっていて、まだリリースできていません。
もし使う場合は、上の<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA">リポジトリ</a>をcloneしてgemファイルをビルドし、インストールする必要があります。</p></blockquote>

<h2>動機</h2>

<p>お仕事で<a class="keyword" href="http://d.hatena.ne.jp/keyword/XML">XML</a>ドキュメントを解析しながらそれを処理する必要がありました。
複雑な<a class="keyword" href="http://d.hatena.ne.jp/keyword/XML">XML</a>ドキュメントで、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%B9%A5%AD%A1%BC%A5%DE">スキーマ</a>もいまいちわからないものだったので、いきなりコードを書くよりも、必要な情報を抜き出すための<a class="keyword" href="http://d.hatena.ne.jp/keyword/XPath">XPath</a>はどんなものだろうかというのを試行錯誤するところからはじめました。</p>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/XML">XML</a>パーサーといえば<a href="https://nokogiri.org/">Nokogiri</a>と思い、nokogiriに同梱されている<a class="keyword" href="http://d.hatena.ne.jp/keyword/cli">cli</a>を使ってみました。
これはこれで便利で、指定したドキュメントを<code>@doc</code>に読み込んだ状態で<a class="keyword" href="http://d.hatena.ne.jp/keyword/irb">irb</a>が起動されます。
便利なのですが、<a class="keyword" href="http://d.hatena.ne.jp/keyword/XPath">XPath</a>で抜き出した要素が大量に出てくる時の表示が面倒だったり、結果をファイルに保存する時にいちいち<code>File</code>を操作しないといけないのが煩わしいと思いました。</p>

<p>そこで、解析したい<a class="keyword" href="http://d.hatena.ne.jp/keyword/XML">XML</a>ドキュメントと<a class="keyword" href="http://d.hatena.ne.jp/keyword/XPath">XPath</a>を指定することで、<a class="keyword" href="http://d.hatena.ne.jp/keyword/XPath">XPath</a>にマッチする要素を出力するだけの<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%B3%A5%DE%A5%F3%A5%C9%A5%E9%A5%A4%A5%F3">コマンドライン</a>ツールを作ることにしました。</p>

<h2>使い方</h2>

<p><a href="https://github.com/satoryu/kamikiri#usage">README</a>に記載していますが、シンプルに<a class="keyword" href="http://d.hatena.ne.jp/keyword/XML">XML</a>文書のファイルパスもしくは<a class="keyword" href="http://d.hatena.ne.jp/keyword/URI">URI</a>と<a class="keyword" href="http://d.hatena.ne.jp/keyword/XPath">XPath</a>を指定することで実行できます。</p>

<pre class="code lang-sh" data-lang="sh" data-unlink>kamikiri <span class="synSpecial">--file</span> /path/to/xml/file.xml <span class="synSpecial">--xpath</span> <span class="synStatement">'</span><span class="synConstant">//foo/bar</span><span class="synStatement">'</span>
</pre>

```sh
kamikiri --file /path/to/xml/file.xml --xpath '//foo/bar'
```

<p>例えば、下記のように、CDのカタログから1980年代の10ドルより高いCDを抜き出すことができます。</p>

```sh
$ kamikiri --file https://www.w3schools.com/xml/cd_catalog.xml --xpath '//CD[PRICE > 10.0][YEAR > 1990]'
<CD>
<TITLE>Empire Burlesque</TITLE>
<ARTIST>Bob Dylan</ARTIST>
<COUNTRY>USA</COUNTRY>
<COMPANY>Columbia</COMPANY>
<PRICE>10.90</PRICE>
<YEAR>1985</YEAR>
</CD>
```

<p>パイプやリダイレクトと組み合わせれば、ファイルに保存したり一部の文字列を書き換えたりとか幅広く使えそうです。<a class="keyword" href="http://d.hatena.ne.jp/keyword/CLI">CLI</a>、便利。</p>

<h2>おまけ</h2>

<p>ある程度形になって実行できるようになったので<a class="keyword" href="http://d.hatena.ne.jp/keyword/rubygems">rubygems</a>.orgにgemファイルをpushしようとしたのですが、MFAのOTPコードを入手する手段を失ってしまいました。
以前にMFAの設定した時に登録したデ<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%B9">バイス</a>（<a class="keyword" href="http://d.hatena.ne.jp/keyword/iPhone">iPhone</a>）から今のデ<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%B9">バイス</a>に乗り換えた時に、登録していたAuthenticatorをアンインストールしてしまったためです。
MFA LevelをUIと<a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a>の両方に設定していたので、<a class="keyword" href="http://d.hatena.ne.jp/keyword/rubygems">rubygems</a>.orgのウェブ画面からログインする際にもOTPコードを求められてしまう状態です。</p>

<p>サインイン画面から確認メールを再送することで、ログイン状態にすることはできたのですが、ドキュメントにあるようにプロフィール編集画面に<a class="keyword" href="http://d.hatena.ne.jp/keyword/QR%A5%B3%A1%BC%A5%C9">QRコード</a>が出てこない状態です。</p>

<p><a href="https://guides.rubygems.org/setting-up-multifactor-authentication/">Setting up multi-factor authentication - RubyGems Guides</a></p>

<p>という状態のため、今回作ったgemをまだリリースできないままでいます。
誰か助けて。</p>
