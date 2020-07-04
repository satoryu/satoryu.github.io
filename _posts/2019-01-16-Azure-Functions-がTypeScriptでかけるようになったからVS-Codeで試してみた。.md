---
title: "Azure Functions がTypeScriptでかけるようになったからVS Codeで試してみた。"
category: blog
tags: [Azure]
---
<p>先日、 Azure Functions の公式<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C4%A5%A4%A5%C3%A5%BF%A1%BC">ツイッター</a>アカウントで、TypeScriptで書きたい人向けのパッケージのリリースアナウンスがあった。</p>

<p><blockquote class="twitter-tweet" data-lang="HASH(0x10137678)"><p lang="en" dir="ltr">⚡️⚡️⚡️Check out the new @azure/functions type definitions!!!⚡️⚡️⚡️<a href="https://t.co/plmpXd7U7v">https://t.co/plmpXd7U7v</a></p>&mdash; Azure Functions (@AzureFunctions) <a href="https://twitter.com/AzureFunctions/status/1084939667177332736?ref_src=twsrc%5Etfw">January 14, 2019</a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>

<p>これは面白そうなので試してみようと思って探してみたら、さすがMSの人がQiitaに早速書いていた。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fqiita.com%2Fyuhattor%2Fitems%2Fea1d07b972e5cdc0e02d" title="Azure Functions + TypeScript   公式に型定義が追加されたらしい - Qiita" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://qiita.com/yuhattor/items/ea1d07b972e5cdc0e02d">qiita.com</a></cite></p>

<p>これを参考に、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Visual%20Studio%20Code">Visual Studio Code</a> からローカル環境でAzure Functions を起動し、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%D0%A5%C3%A5%B0">デバッグ</a>するところまで試してみた。
サンプルで作った<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA">リポジトリ</a>は、こちら。</p>

<ul>
<li><a href="https://github.com/satoryu/azure-functions-typescript">satoryu/azure-functions-typescript: Sample Function in TypeScript for Azure Functions</a></li>
</ul>


<h2>前提条件</h2>

<ul>
<li><a class="keyword" href="http://d.hatena.ne.jp/keyword/macOS">macOS</a> 10.13.6</li>
<li>node v10.6.0</li>
<li>npm v6.1.0</li>
<li><a class="keyword" href="http://d.hatena.ne.jp/keyword/Visual%20Studio%20Code">Visual Studio Code</a></li>
<li><a href="https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions">Azure Functions</a></li>
</ul>


<h2>Function の新規作成</h2>

<p><a href="https://qiita.com/yuhattor/items/ea1d07b972e5cdc0e02d">参考のQiitaの記事</a>の通りに、HttpTriggerのFunction を作成しましょう。</p>

<h2><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%D0%A5%C3%A5%B0">デバッグ</a>の準備</h2>

<p>下記のようにHttpTriggerが存在することを前提に進めます。</p>

<pre class="code" data-lang="" data-unlink>./HttpTrigger/
├── function.json
├── index.js
├── index.ts
└── sample.dat</pre>


<h3><a class="keyword" href="http://d.hatena.ne.jp/keyword/VS%20Code">VS Code</a>の拡張 Azure Functionsを使って、必要なファイルを生成</h3>

<p>Ctrl+Shift+P（<a class="keyword" href="http://d.hatena.ne.jp/keyword/Mac">Mac</a>なら⌘+Shift+P）から、「Initialize Project for Use With <a class="keyword" href="http://d.hatena.ne.jp/keyword/VS%20Code">VS Code</a>」コマンドを実行する。</p>

<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20190116/20190116153521.png" alt="f:id:satoryu:20190116153521p:plain" title="f:id:satoryu:20190116153521p:plain" class="hatena-fotolife" itemprop="image"></span></p>

<h3>ソースマップを生成</h3>

<p><code>tsconfig.json</code> に、<code>"sourceMap": true" を追加し、ビルド時にソースマップを生成させるようにする。ソースマップが無いと、ビルド後に生成された</code>index.js`上にしか<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D6%A5%EC%A1%BC%A5%AF%A5%DD%A5%A4%A5%F3%A5%C8">ブレークポイント</a>を置けない。</p>

<pre class="code lang-json" data-lang="json" data-unlink><span class="synSpecial">{</span>
    &quot;<span class="synStatement">compilerOptions</span>&quot;: <span class="synSpecial">{</span>
        &quot;<span class="synStatement">target</span>&quot;: &quot;<span class="synConstant">es2018</span>&quot;,
        &quot;<span class="synStatement">module</span>&quot;: &quot;<span class="synConstant">commonjs</span>&quot;,
        &quot;<span class="synStatement">lib</span>&quot;: <span class="synSpecial">[</span>&quot;<span class="synConstant">es2018</span>&quot;<span class="synSpecial">]</span>,
        &quot;<span class="synStatement">sourceMap</span>&quot;: <span class="synConstant">true</span>
    <span class="synSpecial">}</span>,
    &quot;<span class="synStatement">include</span>&quot;: <span class="synSpecial">[</span>
        &quot;<span class="synConstant">**/*.ts</span>&quot;
    <span class="synSpecial">]</span>
<span class="synSpecial">}</span>
</pre>


<h3>TypeScriptをビルドするためのタスクを追加</h3>

<p><code>package.json</code> に、以下の<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8">スクリプト</a>を定義する。</p>

<pre class="code lang-json" data-lang="json" data-unlink>&quot;<span class="synStatement">script</span>&quot;: <span class="synSpecial">{</span>
  &quot;<span class="synStatement">build</span>&quot;: &quot;<span class="synConstant">tsc</span>&quot;
<span class="synSpecial">}</span>,
</pre>


<p>下記のようにビルドが実行できることを確認。</p>

<pre class="code lang-sh" data-lang="sh" data-unlink>$ npm run-script build
</pre>


<h3>（オプション）デバッガ起動時にビルド</h3>

<p>デバッガ起動時に、<code>func extensions</code>コマンドが実行されるように<code>launch.json</code>が定義されています。
これに、<code>tasks.json</code>に以下の設定を追加することで、同じタイミングで上で定義したTypeScriptのビルドを実行するようにしておきましょう。</p>

<pre class="code lang-json" data-lang="json" data-unlink>    <span class="synSpecial">{</span>
      &quot;<span class="synStatement">label</span>&quot;: &quot;<span class="synConstant">buildTypeScript</span>&quot;,
      &quot;<span class="synStatement">command</span>&quot;: &quot;<span class="synConstant">npm run-script build</span>&quot;,
      &quot;<span class="synStatement">type</span>&quot;: &quot;<span class="synConstant">shell</span>&quot;
    <span class="synSpecial">}</span>
</pre>


<h2>デバッガを実行</h2>

<p>まず、<code>index.ts</code> ファイルを開き、コードの中で<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%D0%A5%C3%A5%B0">デバッグ</a>したいところに<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D6%A5%EC%A1%BC%A5%AF%A5%DD%A5%A4%A5%F3%A5%C8">ブレークポイント</a>を起きます。
その後、Ctrl+Shift+D（<a class="keyword" href="http://d.hatena.ne.jp/keyword/Mac">Mac</a>だと⌘+Shift+D）でデバッガサイドバーを開き、「Attache to <a class="keyword" href="http://d.hatena.ne.jp/keyword/JavaScript">JavaScript</a> Functions」で起動します。</p>

<p><a href="http://localhost:7071/api/HttpTrigger">http://localhost:7071/api/HttpTrigger</a> をブラウザで開くと、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D6%A5%EC%A1%BC%A5%AF%A5%DD%A5%A4%A5%F3%A5%C8">ブレークポイント</a>に達したところで、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Visual%20Studio%20Code">Visual Studio Code</a>に移るはずです。</p>

<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20190116/20190116163046.png" alt="f:id:satoryu:20190116163046p:plain" title="f:id:satoryu:20190116163046p:plain" class="hatena-fotolife" itemprop="image"></span></p>

<p>おー、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%D0%A5%C3%A5%B0">デバッグ</a>できるー！</p>

<h2>おわりに</h2>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/Visual%20Studio%20Code">Visual Studio Code</a>でTypeScriptで書いたAzure Functionsをビルドし、tsファイル上に置いた<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D6%A5%EC%A1%BC%A5%AF%A5%DD%A5%A4%A5%F3%A5%C8">ブレークポイント</a>で止まるようにデバッガを設定、起動する方法を紹介しました。
あとは、デプロイも事前にビルドするようにCIを用意すれば、TypeScriptで開発できそう。</p>

