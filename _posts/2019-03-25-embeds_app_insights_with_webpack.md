---
title: "WebpackでApplication Insightのコードを埋め込む。"
category: blog
tags: [Azure,Application Insights,Webpack]
---
<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/Microsoft">Microsoft</a> Azureが提供するサービスの1つにApplication Insightsがある。
これはアプリケーションのメトリクスを収集、集計するための機能を提供してくれるサービスで、お手軽に導入できて便利なのでよく使っている。</p>

<p><a href="https://docs.microsoft.com/en-us/azure/azure-monitor/app/javascript#add-the-sdk-script-to-your-app-or-web-pages">公式ドキュメント</a>では、HTMLにコードを埋め込む方法を書いているが、<a class="keyword" href="http://d.hatena.ne.jp/keyword/JavaScript">JavaScript</a>などをWebpackで一元管理したい場合については触れられていない。
ということで、そのやり方を調べてみた。</p>

<p><strong> 目次 </strong></p>

<ul class="table-of-contents">
    <li><a href="#HTMLにタグを埋め込む方法">HTMLにタグを埋め込む方法</a></li>
    <li><a href="#Webpack-で埋め込む方法">Webpack で埋め込む方法</a><ul>
            <li><a href="#パッケージのインストール">パッケージのインストール</a></li>
            <li><a href="#Application-Insightsを埋め込む">Application Insightsを埋め込む</a></li>
            <li><a href="#リリースの時だけ埋め込むようにする">リリースの時だけ埋め込むようにする</a></li>
        </ul>
    </li>
</ul>

<h2 id="HTMLにタグを埋め込む方法">HTMLにタグを埋め込む方法</h2>

<p>公式ドキュメントで紹介されている方法だと、ウェブページの情報を取得するには、下記のコードをHTMLのヘッダー部に埋め込むだけでできる。</p>

<pre class="code lang-html" data-lang="html" data-unlink><span class="synIdentifier">&lt;</span><span class="synStatement">script</span><span class="synIdentifier"> </span><span class="synType">type</span><span class="synIdentifier">=</span><span class="synConstant">&quot;text/javascript&quot;</span><span class="synIdentifier">&gt;</span>
<span class="synIdentifier">var</span><span class="synSpecial"> appInsights=</span><span class="synStatement">window</span><span class="synSpecial">.appInsights||</span><span class="synIdentifier">function</span>(<span class="synSpecial">a</span>)<span class="synIdentifier">{</span>
<span class="synSpecial">  </span><span class="synIdentifier">function</span><span class="synSpecial"> b</span>(<span class="synSpecial">a</span>)<span class="synIdentifier">{</span><span class="synSpecial">c</span><span class="synIdentifier">[</span><span class="synSpecial">a</span><span class="synIdentifier">]</span><span class="synSpecial">=</span><span class="synIdentifier">function</span>()<span class="synIdentifier">{var</span><span class="synSpecial"> b=</span><span class="synIdentifier">arguments</span><span class="synSpecial">;c.queue.push</span>(<span class="synIdentifier">function</span>()<span class="synIdentifier">{</span><span class="synSpecial">c</span><span class="synIdentifier">[</span><span class="synSpecial">a</span><span class="synIdentifier">]</span><span class="synSpecial">.apply</span>(<span class="synSpecial">c,b</span>)<span class="synIdentifier">}</span>)<span class="synIdentifier">}}var</span><span class="synSpecial"> c=</span><span class="synIdentifier">{</span><span class="synSpecial">config:a</span><span class="synIdentifier">}</span><span class="synSpecial">,d=</span><span class="synStatement">document</span><span class="synSpecial">,e=</span><span class="synStatement">window</span><span class="synSpecial">;setTimeout</span>(<span class="synIdentifier">function</span>()<span class="synIdentifier">{var</span><span class="synSpecial"> b=d.createElement</span>(<span class="synConstant">&quot;script&quot;</span>)<span class="synSpecial">;b.src=a.url||</span><span class="synConstant">&quot;https://az416426.vo.msecnd.net/scripts/a/ai.0.js&quot;</span><span class="synSpecial">,d.getElementsByTagName</span>(<span class="synConstant">&quot;script&quot;</span>)<span class="synIdentifier">[</span>0<span class="synIdentifier">]</span><span class="synSpecial">.parentNode.appendChild</span>(<span class="synSpecial">b</span>)<span class="synIdentifier">}</span>)<span class="synSpecial">;</span><span class="synStatement">try</span><span class="synIdentifier">{</span><span class="synSpecial">c.cookie=d.cookie</span><span class="synIdentifier">}</span><span class="synStatement">catch</span>(<span class="synSpecial">a</span>)<span class="synIdentifier">{}</span><span class="synSpecial">c.queue=</span><span class="synIdentifier">[]</span><span class="synSpecial">;</span><span class="synStatement">for</span>(<span class="synIdentifier">var</span><span class="synSpecial"> f=</span><span class="synIdentifier">[</span><span class="synConstant">&quot;Event&quot;</span><span class="synSpecial">,</span><span class="synConstant">&quot;Exception&quot;</span><span class="synSpecial">,</span><span class="synConstant">&quot;Metric&quot;</span><span class="synSpecial">,</span><span class="synConstant">&quot;PageView&quot;</span><span class="synSpecial">,</span><span class="synConstant">&quot;Trace&quot;</span><span class="synSpecial">,</span><span class="synConstant">&quot;Dependency&quot;</span><span class="synIdentifier">]</span><span class="synSpecial">;f.length;</span>)<span class="synSpecial">b</span>(<span class="synConstant">&quot;track&quot;</span><span class="synSpecial">+f.pop</span>())<span class="synSpecial">;</span><span class="synStatement">if</span>(<span class="synSpecial">b</span>(<span class="synConstant">&quot;setAuthenticatedUserContext&quot;</span>)<span class="synSpecial">,b</span>(<span class="synConstant">&quot;clearAuthenticatedUserContext&quot;</span>)<span class="synSpecial">,b</span>(<span class="synConstant">&quot;startTrackEvent&quot;</span>)<span class="synSpecial">,b</span>(<span class="synConstant">&quot;stopTrackEvent&quot;</span>)<span class="synSpecial">,b</span>(<span class="synConstant">&quot;startTrackPage&quot;</span>)<span class="synSpecial">,b</span>(<span class="synConstant">&quot;stopTrackPage&quot;</span>)<span class="synSpecial">,b</span>(<span class="synConstant">&quot;flush&quot;</span>)<span class="synSpecial">,!a.disableExceptionTracking</span>)<span class="synIdentifier">{</span><span class="synSpecial">f=</span><span class="synConstant">&quot;onerror&quot;</span><span class="synSpecial">,b</span>(<span class="synConstant">&quot;_&quot;</span><span class="synSpecial">+f</span>)<span class="synSpecial">;</span><span class="synIdentifier">var</span><span class="synSpecial"> g=e</span><span class="synIdentifier">[</span><span class="synSpecial">f</span><span class="synIdentifier">]</span><span class="synSpecial">;e</span><span class="synIdentifier">[</span><span class="synSpecial">f</span><span class="synIdentifier">]</span><span class="synSpecial">=</span><span class="synIdentifier">function</span>(<span class="synSpecial">a,b,d,e,h</span>)<span class="synIdentifier">{var</span><span class="synSpecial"> i=g&amp;&amp;g</span>(<span class="synSpecial">a,b,d,e,h</span>)<span class="synSpecial">;</span><span class="synStatement">return</span><span class="synSpecial">!</span>0<span class="synSpecial">!==i&amp;&amp;c</span><span class="synIdentifier">[</span><span class="synConstant">&quot;_&quot;</span><span class="synSpecial">+f</span><span class="synIdentifier">]</span>(<span class="synSpecial">a,b,d,e,h</span>)<span class="synSpecial">,i</span><span class="synIdentifier">}}</span><span class="synStatement">return</span><span class="synSpecial"> c</span>
<span class="synSpecial">  </span><span class="synIdentifier">}</span>(<span class="synIdentifier">{</span>
<span class="synSpecial">      instrumentationKey:</span><span class="synConstant">&quot;&lt;your instrumentation key&gt;&quot;</span>
<span class="synSpecial">  </span><span class="synIdentifier">}</span>)<span class="synSpecial">;</span>
<span class="synSpecial">  </span>
<span class="synStatement">window</span><span class="synSpecial">.appInsights=appInsights,appInsights.queue&amp;&amp;</span>0<span class="synSpecial">===appInsights.queue.length&amp;&amp;appInsights.trackPageView</span>()<span class="synSpecial">;</span>
<span class="synIdentifier">&lt;/</span><span class="synStatement">script</span><span class="synIdentifier">&gt;</span>
</pre>


<p><a href="https://docs.microsoft.com/en-us/azure/azure-monitor/app/javascript#add-the-sdk-script-to-your-app-or-web-pages">Azure Application Insights for JavaScript web apps | Microsoft Docs</a></p>

<h2 id="Webpack-で埋め込む方法">Webpack で埋め込む方法</h2>

<p>Application Insights の<a class="keyword" href="http://d.hatena.ne.jp/keyword/JavaScript">JavaScript</a> <a class="keyword" href="http://d.hatena.ne.jp/keyword/SDK">SDK</a>があるので、それを使う。</p>

<p>もちろん、Webpackでなくても出来るのだけれど、とりあえず今自分が使っているのがWebpackなので、それでやってみた。</p>

<h3 id="パッケージのインストール">パッケージのインストール</h3>

<p><code>npm</code>（もしくは<code>yarn</code>）を使って、依存に追加する。</p>

<pre class="code lang-sh" data-lang="sh" data-unlink>npm install <span class="synSpecial">-D</span> applicationinsights-js
</pre>


<h3 id="Application-Insightsを埋め込む">Application Insightsを埋め込む</h3>

<p>Application Insightsは、ブラウザ上で発生した例外も拾って収集してくれる。
そのためには、 <strong>他のJSライブラリが読み込まれるタイミングよりも先にApplication Insightsが有効になる必要がある</strong>。</p>

<p>なので、WebpackのエントリーポイントになっているJSファイルのなるべく先頭に下記のコードを追加する。</p>

<pre class="code lang-javascript" data-lang="javascript" data-unlink><span class="synStatement">import</span> <span class="synIdentifier">{</span> AppInsights <span class="synIdentifier">}</span> from <span class="synConstant">'applicationinsights-js'</span>

AppInsights.downloadAndSetup(<span class="synIdentifier">{</span> instrumentationKey: INSTRUMENTATION_KEY <span class="synIdentifier">}</span>);
AppInsights.trackPageView()
</pre>


<p>上記の<code>INSTRUMENTATION_KEY</code>は、実際に発行したキーの値に置き換える。
ソースを読むとわかるのだけど、実際に<code>downloadAndSetup</code>がやっているのは、上で紹介したHTMLにタグを埋め込む方法と同じことをやっている<a href="#f-e6d7a6c0" name="fn-e6d7a6c0" title="なぜ頑なに動的に埋め込もうとするのかはわかってない。">*1</a>。</p>

<h3 id="リリースの時だけ埋め込むようにする">リリースの時だけ埋め込むようにする</h3>

<p>開発時にはデータを収集しない、またはしたくない場合がある。
そういう時は、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4">環境変数</a>などでビルド時に埋め込むかどうか判断させるなどの対応が必要になる。
例えば、<code>INSTRUMENTATION_KEY</code>が存在している時だけに埋め込むようにしようとした場合にだけ埋め込むようにする。そのために、ここではWebpackの<a href="https://webpack.js.org/plugins/define-plugin/">DefinePlugin</a>を使う。</p>

<p>まず、INSTRUMENTATION_KEYを実際の値と置き換えるために、Webpackの設定にDefinePluginを有効にする。</p>

<pre class="code lang-javascript" data-lang="javascript" data-unlink>plugins: <span class="synIdentifier">[</span>
  <span class="synStatement">new</span> webpack.DefinePlugin(<span class="synIdentifier">{</span>
    INSTRUMENTATION_KEY: JSON.stringify(process.env.INSTRUMENTATION_KEY)
  <span class="synIdentifier">}</span>)
<span class="synIdentifier">]</span>
</pre>


<p>また、先のエントリーポイントのコードも下記のようにして、INSTRUMENTATION_KEYがある時のみに読み込まれるようにする。</p>

<pre class="code lang-javascript" data-lang="javascript" data-unlink><span class="synStatement">import</span> <span class="synIdentifier">{</span> AppInsights <span class="synIdentifier">}</span> from <span class="synConstant">'applicationinsights-js'</span>

<span class="synStatement">if</span> (INSTRUMENTATION_KEY) <span class="synIdentifier">{</span>
  AppInsights.downloadAndSetup(<span class="synIdentifier">{</span> instrumentationKey: INSTRUMENTATION_KEY <span class="synIdentifier">}</span>);
  AppInsights.trackPageView()
<span class="synIdentifier">}</span>
</pre>


<p>こうすることで、Webpackがビルドする<a class="keyword" href="http://d.hatena.ne.jp/keyword/JavaScript">JavaScript</a>内の<code>INSTRUMENTATION_KEY</code>がビルド時に<a class="keyword" href="http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4">環境変数</a><code>INSTRUMENTATION_KEY</code>で渡した値に置き換えられる。つまり、</p>

<pre class="code lang-sh" data-lang="sh" data-unlink><span class="synIdentifier">INSTRUMENTATION_KEY</span>=******* npx webpack
</pre>


<p>としてビルドした時のみにApplication Insightsのコードが埋め込まれるようになる。</p>

<p>実際にVue.jsのアプリケーションに組み込んでみたものが下記のプルリク<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9">エス</a>トなので、参考になれば。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fsatoryu%2FCalCal%2Fpull%2F7%2Ffiles" title="Track pageview with AppInsights by satoryu · Pull Request #7 · satoryu/CalCal" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/satoryu/CalCal/pull/7/files">github.com</a></cite></p>
<div class="footnote">
<p class="footnote"><a href="#fn-e6d7a6c0" name="f-e6d7a6c0" class="footnote-number">*1</a><span class="footnote-delimiter">:</span><span class="footnote-text">なぜ頑なに動的に埋め込もうとするのかはわかってない。</span></p>
</div>
