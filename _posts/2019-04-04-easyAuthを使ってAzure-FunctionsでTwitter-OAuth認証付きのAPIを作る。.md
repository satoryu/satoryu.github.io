---
title: "easyAuthを使ってAzure FunctionsでTwitter OAuth認証付きのAPIを作る。"
category: blog
tags: [Azure,Azure Functions,Node.js,Twitter]
---
<p>Azure Functionsには認証認可を扱うeasyAuthと呼ばれる機能があり、ここでその使い方について紹介する。</p>

<p>Azure Functions は、Azure Web Appがベースとなっていて、だいたいWeb App で出来ることはFunctionsでもできる。
Web Appには、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Twitter">Twitter</a>や<a class="keyword" href="http://d.hatena.ne.jp/keyword/Facebook">Facebook</a>などの外部での認証と連携させる機能を持っており、それを利用し、アプリケーションの認証機能部分を作ることができる。
また、Token Storeを利用することで、認証したユーザーの<a class="keyword" href="http://d.hatena.ne.jp/keyword/Access">Access</a> Tokenも保存し、特別なライブラリを使用することなくその<a class="keyword" href="http://d.hatena.ne.jp/keyword/Access">Access</a> Tokenを利用することができる。</p>

<p>それらを試すために、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Twitter">Twitter</a> OAuthを利用した認証付きのツィートを投稿する<a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a>をAzure Functionsアプリを作ってみた。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fsatoryu%2Ftakoyaki-api" title="satoryu/takoyaki-api" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/satoryu/takoyaki-api">github.com</a></cite>
<a href="#f-465ac2a6" name="fn-465ac2a6" title="なぜタコ焼きにしたのかはよく覚えてない。「つぶやき」をもじっただけ。">*1</a></p>

<p>ちなみに、Vue.jsで作ったフロントを組み合わせたものが、こちら。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Ftakoyaki.netlify.com%2F" title="My Vue.js App" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://takoyaki.netlify.com/">takoyaki.netlify.com</a></cite></p>

<h2 id="もくじ">もくじ</h2>

<ul class="table-of-contents">
    <li><a href="#もくじ">もくじ</a></li>
    <li><a href="#前提">前提</a></li>
    <li><a href="#Twitter-にアプリケーションを登録">Twitter にアプリケーションを登録</a></li>
    <li><a href="#Azure-Functions-の認証認可の設定">Azure Functions の認証/認可の設定</a></li>
    <li><a href="#easyAuthによる認証">easyAuthによる認証</a><ul>
            <li><a href="#ログイン">ログイン</a></li>
            <li><a href="#ログアウト">ログアウト</a></li>
            <li><a href="#Access-Tokenの利用">Access Tokenの利用</a></li>
            <li><a href="#実際のコード">実際のコード</a></li>
        </ul>
    </li>
    <li><a href="#おわりに">おわりに</a></li>
    <li><a href="#参考">参考</a></li>
</ul>

<h2 id="前提">前提</h2>

<p>予めAzure Functionsのアプリが1つあること。
以降、文中ではsamplefuntionとして参照する。</p>

<h2 id="Twitter-にアプリケーションを登録"><a class="keyword" href="http://d.hatena.ne.jp/keyword/Twitter">Twitter</a> にアプリケーションを登録</h2>

<p><a href="https://developer.twitter.com/en/apps">Twitter Developers</a> を開き、アプリケーションを登録する。
登録するCallback URLは、 <code>https://samplefunction.azurewebsites.net/.auth/login/twitter/callback</code> を入れる。
これは、あとで設定するeasyAuthが追加するCallback用のエンドポイントのURLである。</p>

<p>他の必須項目を入力して登録後、発行されたConsumer <a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a> Keyと<a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a> Secret Keyを控えておく。</p>

<h2 id="Azure-Functions-の認証認可の設定">Azure Functions の認証/認可の設定</h2>

<p>Azure <a class="keyword" href="http://d.hatena.ne.jp/keyword/Portal">Portal</a> から、Azure Functions のブレードを開き、Authentication/Authorization から以下のように設定する。</p>

<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20190404/20190404193101.png" alt="f:id:satoryu:20190404193101p:plain" title="f:id:satoryu:20190404193101p:plain" class="hatena-fotolife" itemprop="image"></span></p>

<h2 id="easyAuthによる認証">easyAuthによる認証</h2>

<h3 id="ログイン">ログイン</h3>

<p><code>https://samplefunction.azurewebsites.net/.auth/login/twitter</code> をブラウザで開くと、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Twitter">Twitter</a>の<a class="keyword" href="http://d.hatena.ne.jp/keyword/OAuth%C7%A7%BE%DA">OAuth認証</a>画面にリダイレクトされる。
ここで先程登録したアプリケーションに<a class="keyword" href="http://d.hatena.ne.jp/keyword/Twitter">Twitter</a>アカウントで認証することができる。</p>

<h3 id="ログアウト">ログアウト</h3>

<p><code>https://samplefunction.azurewebsites.net/.auth/logout</code> にアクセスすることで、ログアウトができる。</p>

<h3 id="Access-Tokenの利用"><a class="keyword" href="http://d.hatena.ne.jp/keyword/Access">Access</a> Tokenの利用</h3>

<p>認証後に特別なライブラリを利用することなく<a class="keyword" href="http://d.hatena.ne.jp/keyword/Access">Access</a> TokenをFunctionアプリは取得することができる。</p>

<p>具体的には、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Twitter">Twitter</a>で認証した後に、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3">ドメイン</a><code>samplefunction.azurewebsites.net</code>に対してAppServiceAuthSessionという<a class="keyword" href="http://d.hatena.ne.jp/keyword/Cookie">Cookie</a>が発行される。この<a class="keyword" href="http://d.hatena.ne.jp/keyword/Cookie">Cookie</a>を付けて、Azure Functionsアプリにリク<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9">エス</a>トを送ることで認証済みとして扱われる。
そして、アプリケーションへのリク<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9">エス</a>トに下記のヘッダが追加される。</p>

<ul>
<li><code>X-MS-TOKEN-TWITTER-ACCESS-TOKEN</code></li>
<li><code>X-MS-TOKEN-TWITTER-ACCESS-TOKEN-SECRET</code></li>
</ul>


<p>これはそれぞれ<a class="keyword" href="http://d.hatena.ne.jp/keyword/Access">Access</a> Tokenと<a class="keyword" href="http://d.hatena.ne.jp/keyword/Access">Access</a> Token Secretなので、Consumer KeyとConsumer Secretと組み合わせることで、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Twitter">Twitter</a> RESTful <a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a>を認証済みのユーザーとして利用することができる。</p>

<h3 id="実際のコード">実際のコード</h3>

<p>実際にこの仕組を利用して、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Twitter">Twitter</a>に投稿するためのFunctionのコードを載せる。</p>

<p><a href="https://github.com/satoryu/takoyaki-api/blob/master/PostTweet/index.js">takoyaki-api/index.js at master &middot; satoryu/takoyaki-api &middot; GitHub</a></p>

<pre class="code lang-javascript" data-lang="javascript" data-unlink><span class="synStatement">const</span> Twitter = require(<span class="synConstant">'twitter'</span>)

module.exports = async <span class="synIdentifier">function</span> (context, req) <span class="synIdentifier">{</span>
    <span class="synStatement">const</span> <span class="synStatement">status</span> = req.body.<span class="synStatement">status</span>
    <span class="synStatement">const</span> twitter = <span class="synStatement">new</span> Twitter(<span class="synIdentifier">{</span>
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: req.headers<span class="synIdentifier">[</span><span class="synConstant">'x-ms-token-twitter-access-token'</span><span class="synIdentifier">]</span>,
        access_token_secret: req.headers<span class="synIdentifier">[</span><span class="synConstant">'x-ms-token-twitter-access-token-secret'</span><span class="synIdentifier">]</span>
    <span class="synIdentifier">}</span>)

    <span class="synStatement">try</span> <span class="synIdentifier">{</span>
        <span class="synStatement">const</span> tweet = await twitter.post(<span class="synConstant">'statuses/update'</span>, <span class="synIdentifier">{</span> <span class="synStatement">status</span> <span class="synIdentifier">}</span>)
        context.bindings.res = <span class="synIdentifier">{</span> body: tweet <span class="synIdentifier">}</span>

        context.done()
    <span class="synIdentifier">}</span> <span class="synStatement">catch</span>(err) <span class="synIdentifier">{</span>
        context.log.error(err)
        context.bindings.res = <span class="synIdentifier">{</span>
            <span class="synStatement">status</span>: 500,
            body: err
        <span class="synIdentifier">}</span>
        context.done(err)
    <span class="synIdentifier">}</span>
<span class="synIdentifier">}</span>;
</pre>


<p>ここでは、<a href="https://www.npmjs.com/package/twitter">twitter</a>というパッケージを利用して、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Twitter">Twitter</a> <a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a>へアクセスしている。
それを利用する際に、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4">環境変数</a>からConsumer Key、リク<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9">エス</a>トに追加された2つのヘッダから<a class="keyword" href="http://d.hatena.ne.jp/keyword/Access">Access</a> Tokenを用いている。
<a class="keyword" href="http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4">環境変数</a><code>TWITTER_CONSUMER_KEY</code>と<code>TWITTER_CONSUMER_SECRET</code> は予めFunctionアプリのApp Settingsから追加しておく必要がある。</p>

<h2 id="おわりに">おわりに</h2>

<p>easyAuthによる認証とToken Storeを使うことで、OAuthの認証の実装や認証後に得られる<a class="keyword" href="http://d.hatena.ne.jp/keyword/Access">Access</a> Tokenの管理をする必要がなく、DBを準備することもなく、アプリケーションの開発に集中することができる。</p>

<p>easyAuthをローカルの開発環境で起動（もしくは再現）させる方法をまだ見つけられていないので、テストする際には実際にデプロイしなければならないところが課題として残っている。
もしご存知の方がおりましたら教えてください。</p>

<h2 id="参考">参考</h2>

<p>開発者の@cgillum のeasyAuthの<a class="keyword" href="http://d.hatena.ne.jp/keyword/Wiki">Wiki</a>に詳しく書いてある。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fcgillum%2Feasyauth%2Fwiki" title="cgillum/easyauth" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/cgillum/easyauth/wiki">github.com</a></cite></p>

<p>また、Web App の公式ドキュメントにも認証と認証後の<a class="keyword" href="http://d.hatena.ne.jp/keyword/Access">Access</a> Tokenの扱い方について書いてある。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fdocs.microsoft.com%2Fja-jp%2Fazure%2Fapp-service%2Fapp-service-authentication-how-to" title="認証と認可の高度な使用方法 - Azure App Service" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://docs.microsoft.com/ja-jp/azure/app-service/app-service-authentication-how-to">docs.microsoft.com</a></cite></p>
<div class="footnote">
<p class="footnote"><a href="#fn-465ac2a6" name="f-465ac2a6" class="footnote-number">*1</a><span class="footnote-delimiter">:</span><span class="footnote-text">なぜタコ焼きにしたのかはよく覚えてない。「つぶやき」をもじっただけ。</span></p>
</div>
