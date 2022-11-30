---
title: "Node.js で書いたAzure Functions アプリのテストを書く。"
category: blog
tags: [Azure Functions,Azure,Node.js,Jest,TDD]
---
<p>自分で使うためだけの<a class="keyword" href="http://d.hatena.ne.jp/keyword/Twitter">Twitter</a>クライアントをほそぼそと開発していて、それのテストがそろそろ欲しいと思い、Jest を使って書いてみた。
手始めに、Azure Functions アプリのテストを書いてみたので、それについてまとめてみる。</p>

<p>実際のコードは、こちら。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fsatoryu%2Ftakoyaki-api%2Fpull%2F1" title="Install tests by satoryu · Pull Request #1 · satoryu/takoyaki-api" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/satoryu/takoyaki-api/pull/1">github.com</a></cite></p>

<h2>Jest</h2>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fjestjs.io%2F" title="Jest · 🃏 Delightful JavaScript Testing" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://jestjs.io/">jestjs.io</a></cite></p>

<p>Jestは<a class="keyword" href="http://d.hatena.ne.jp/keyword/Facebook">Facebook</a>が開発する<a class="keyword" href="http://d.hatena.ne.jp/keyword/JavaScript">JavaScript</a>のテストツール。Node.jsで書いたライブラリやフロントのアプリのテストも同じように書ける。
知人に勧められて使ってみることにしたのが発端ではあるが、今開発しているものは<a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a>はAzure Functions（Node.js）で、フロントがVue.jsで開発しているので、ちょうど良いと思った。</p>

<p>あとで気づいたのですが、公式ドキュメントもJestでテストの説明が書いてあります。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fdocs.microsoft.com%2Fja-jp%2Fazure%2Fazure-functions%2Ffunctions-test-a-function%23javascript-in-vs-code" title="Azure Functions のテスト" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://docs.microsoft.com/ja-jp/azure/azure-functions/functions-test-a-function#javascript-in-vs-code">docs.microsoft.com</a></cite></p>

<h2>Azure Functions アプリのテスト</h2>

<p><a href="https://github.com/Azure/azure-functions-core-tools">Azure Functions Core Tools</a>を使えば、Azure上で動いているのと同じようにローカルの開発環境でAzure Functionsアプリを動かすことができる。
しかし、それでも、再現が面倒臭いものがあったり、手作業でテストする事自体が面倒。
例えば、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0">バインディング</a>しているBlobストレージから得られる情報に応じての振る舞いをテストしようとしたり、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0">バインディング</a>でサポートされていない外部の<a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a>へのアクセスなどをモックしたりするのは面倒くさい。
また、今回開発しているアプリではWebApps のEasyAuthという認証認可の仕組みを使っている。
それを再現するためには、認証情報を表した特殊なHTTPヘッダを追加しないといけない、といった面倒くささがある。</p>

<h3>方針</h3>

<p>Functionsアプリそれぞれは、<code>context</code> と入力<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0">バインディング</a>を引数とした関数として記述される。
例えば、HTTPトリガーの関数の場合、</p>

<pre class="code lang-javascript" data-lang="javascript" data-unlink>module.exports = async <span class="synIdentifier">function</span>(context, req) <span class="synIdentifier">{</span>
    <span class="synStatement">const</span> name = req.query.name;
    context.bindings.res = <span class="synIdentifier">{</span> <span class="synStatement">status</span>: 200, body: `Hello, <span class="synIdentifier">{</span>name<span class="synIdentifier">}</span> !` <span class="synIdentifier">}</span>
    done()
<span class="synIdentifier">}</span>
</pre>


<p>のように、引数として<code>context</code> とHTTPリク<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9">エス</a>トを入力<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0">バインディング</a><code>req</code>として受け取る。HTTPレスポンスなどFunctionsアプリの出力は、出力<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0">バインディング</a>を経由して出力する（上の例の場合、<code>context.bindings.res</code>）。
また終了したこと表すため、<code>done</code>メソッドを呼んでいる。異常終了させたい場合は、この引数にエラーメッセーや例外オブジェクトを渡す。</p>

<p>ということで、大まかなテストの方針として、以下のように考える。</p>

<ul>
<li>前提条件として、入力<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0">バインディング</a>に値、オブジェクトを設定し、</li>
<li>それを引数としてテスト対象のFunctionsアプリに与え、実行し、</li>
<li>出力<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0">バインディング</a>が期待した状態になっているかチェックする。</li>
</ul>


<p>それぞれについて書いていく。</p>

<h3>前提条件を作る。</h3>

<p><code>context</code> は、</p>

<ul>
<li><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0">バインディング</a>の情報を持つ<code>bindings</code> プロパティ</li>
<li>ログ出力のための<code>log</code>オブジェクト</li>
<li>終了通知のための<code>done</code>メソッド</li>
</ul>


<p>を持つオブジェクトなので、それぞれを再現させるようにモックなどを使う。
入力<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0">バインディング</a>は、Functionsアプリの引数としても渡すことができるので、状況に応じて使い分ける。
<code>bindings</code>は出力を受け付けるためにも使うので、入力<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0">バインディング</a>が引数だとしても用意する。
<code>log</code>や<code>done</code>は、関数内部で呼ぶことさえできればいいので、モック関数を充てる。</p>

<p>上のHTTPトリガーの関数の場合、引数として入力<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0">バインディング</a>を受け取り、出力は<code>bindings</code>を経由して出力するので、下記のように前提を作る。</p>

<pre class="code lang-javascript" data-lang="javascript" data-unlink>test(<span class="synConstant">'should response 200'</span>, async () =&gt; <span class="synIdentifier">{</span>
  <span class="synStatement">const</span> bindings = <span class="synIdentifier">{}</span>
  <span class="synStatement">const</span> req = <span class="synIdentifier">{</span>
     query: <span class="synIdentifier">{</span> name: <span class="synConstant">'satoryu'</span> <span class="synIdentifier">}</span>
  <span class="synIdentifier">}</span>
  <span class="synStatement">const</span> log = jest.fn() 
  <span class="synStatement">const</span> done = jest.fn()

  <span class="synComment">// </span><span class="synTodo">TODO</span><span class="synComment">: Call Function</span>

  <span class="synComment">// </span><span class="synTodo">TODO</span><span class="synComment">: Check output bindings</span>
<span class="synIdentifier">}</span>)
</pre>


<h3>関数を実行する。</h3>

<p>function core toolsなどテンプレートから作ったFunctionsアプリは、通常、関数をexportした<a class="keyword" href="http://d.hatena.ne.jp/keyword/JavaScript">JavaScript</a>ファイルなので、それをテストコード内で<code>require</code>し、その関数に上で用意した<code>bindings</code>などを引数に渡すことで実行できる。</p>

<pre class="code lang-javascript" data-lang="javascript" data-unlink><span class="synStatement">const</span> httpTriggerFunction = require(<span class="synConstant">'../HttpTrigger'</span>)

test(<span class="synConstant">'should response 200'</span>, async () =&gt; <span class="synIdentifier">{</span>
  <span class="synStatement">const</span> bindings = <span class="synIdentifier">{}</span>
  <span class="synStatement">const</span> req = <span class="synIdentifier">{</span>
     query: <span class="synIdentifier">{</span> name: <span class="synConstant">'satoryu'</span> <span class="synIdentifier">}</span>
  <span class="synIdentifier">}</span>
  <span class="synStatement">const</span> log = jest.fn() 
  <span class="synStatement">const</span> done = jest.fn()

  <span class="synComment">// Call Function</span>
  await httpTriggerFunction(<span class="synIdentifier">{</span> bindings, log, done <span class="synIdentifier">}</span>, req)

  <span class="synComment">// </span><span class="synTodo">TODO</span><span class="synComment">: Check Output Bindings</span>
<span class="synIdentifier">}</span>)
</pre>


<h3>出力をチェックする。</h3>

<p>あとは、関数によって<code>bindings</code>に追加された出力<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0">バインディング</a>への値をチェックするだけ。
例えば、<code>bindings.res</code>の<code>status</code>には、<code>200</code>が入っているはずなので、それを確認する。</p>

<pre class="code lang-javascript" data-lang="javascript" data-unlink><span class="synStatement">const</span> httpTriggerFunction = require(<span class="synConstant">'../HttpTrigger'</span>)

test(<span class="synConstant">'should response 200'</span>, async () =&gt; <span class="synIdentifier">{</span>
  <span class="synStatement">const</span> bindings = <span class="synIdentifier">{}</span>
  <span class="synStatement">const</span> req = <span class="synIdentifier">{</span>
     query: <span class="synIdentifier">{</span> name: <span class="synConstant">'satoryu'</span> <span class="synIdentifier">}</span>
  <span class="synIdentifier">}</span>
  <span class="synStatement">const</span> log = jest.fn() 
  <span class="synStatement">const</span> done = jest.fn()

  <span class="synComment">// Call Function</span>
  await httpTriggerFunction(<span class="synIdentifier">{</span> bindings, log, done <span class="synIdentifier">}</span>, req)

  <span class="synComment">//Check Output Bindings</span>
  expect(bindings.res.<span class="synStatement">status</span>).toBe(200)
<span class="synIdentifier">}</span>)
</pre>


<p>また、ログに期待したものが書き込まれているかや、正しくエラーを検知して異常終了できているか確認したければ、<code>log</code>や<code>done</code>が呼ばれたかどうか、その時の引数についてチェックすると良いだろう。</p>

<pre class="code lang-javascript" data-lang="javascript" data-unlink>expect(log).toHaveBeenCalledWith(<span class="synConstant">'Error found!'</span>)
expect(done).toHaveBeenCalledWith(expectedErrorObject)
</pre>


<h2>おわり</h2>

<p>Azure Functions は、Blobストレージなど連携するサービスを<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0">バインディング</a>を定義することで、<a class="keyword" href="http://d.hatena.ne.jp/keyword/SDK">SDK</a>など準備する必要なく利用できるところが便利で、その<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0">バインディング</a>のおかげで関数の実装だけでなくテストも簡易に書ける。</p>

<p>あとは、function.<a class="keyword" href="http://d.hatena.ne.jp/keyword/json">json</a>で定義されている<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0">バインディング</a>の名前と合致してるかとか確認できれば、デプロイ前のテストとしては良さそう。</p>

