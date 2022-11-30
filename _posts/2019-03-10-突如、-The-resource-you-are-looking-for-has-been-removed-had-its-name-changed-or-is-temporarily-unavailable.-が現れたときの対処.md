---
title: "突如、\"The resource you are looking for has been removed, had its name changed, or is temporarily unavailable.\" が現れたときの対処"
category: blog
tags: [Azure,Azure WebApps,IIS]
---
<h1>起きたこと</h1>

<p>Azure WebApps上で動いているアプリケーションのうち、大きいテキストファイルをアップロードする機能があって、それを使おうとしたら</p>

<pre class="code" data-lang="" data-unlink>The resource you are looking for has been removed, had its name changed, or is temporarily unavailable.</pre>


<p>というメッセージのみが白い画面に出てきた。
もちろん期待してない動作なので、アプリケーションのログなどを漁ってみたが、どうやらアプリケーションのエラーではないことがわかった。</p>

<h1>調べたこと</h1>

<p>調べてみると、この画面になる原因自体はいくつかあるようで、まずそれが何かを特定するために、WebAppsのDiagnostic Logs（診断ログ）のうちApplication Logを有効にしてみた。するとファイルアップロードをしてみたら、Log Stream上にエラーメッセージが流れてきた。</p>

<p><script src="https://gist.github.com/f36249cc3816fff8439ef6b40d7fa210.js"> </script></p>

<p><a href="https://gist.github.com/f36249cc3816fff8439ef6b40d7fa210">gistf36249cc3816fff8439ef6b40d7fa210</a></p>

<p>肝心なところだけ抜いてみると。54行目に</p>

<blockquote><p>Request filtering is configured on the Web server to deny the request because the content length exceeds the configured <a class="keyword" href="http://d.hatena.ne.jp/keyword/value">value</a>.</p></blockquote>

<p>と出ている。
どうやら、リク<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9">エス</a>トが大きすぎるらしい。
このエラーメッセージの後の59行目に対応のヒントも書いてあった。</p>

<blockquote><p>Verify the configuration/system.webServer/security/requestFiltering/requestLimits@maxAllowedContentLength setting in the applicationhost.config or web.config file.</p></blockquote>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/IIS">IIS</a>の設定で、許容するContent-Lengthのサイズが指定できるということがわかった。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F4022434%2Fhow-to-set-the-maxallowedcontentlength-to-500mb-while-running-on-iis7" title="How to set the maxAllowedContentLength to 500MB while running on IIS7?" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://stackoverflow.com/questions/4022434/how-to-set-the-maxallowedcontentlength-to-500mb-while-running-on-iis7">stackoverflow.com</a></cite></p>

<h1>やったこと</h1>

<p>ということで、Application のVirtual Pathのトップに <code>web.config</code> ファイルを置いていたので、そこに以下の設定を追加した。</p>

<pre class="code lang-xml" data-lang="xml" data-unlink><span class="synIdentifier">&lt;requestFiltering&gt;</span>
    <span class="synIdentifier">&lt;requestLimits </span><span class="synType">maxAllowedContentLength</span>=<span class="synConstant">&quot;104857600&quot;</span><span class="synIdentifier"> /&gt;</span> <span class="synComment">&lt;!-- up to 100 MB --&gt;</span>
<span class="synIdentifier">&lt;/requestFiltering&gt;</span>
</pre>


<p>上では100MBまでのContent-Lengthのリク<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9">エス</a>トを受け入れるように設定している。
100MB なので、</p>

<pre class="code" data-lang="" data-unlink>1024 * 1024 * 100 = 104857600</pre>


<p>としている。たぶん、おおざっぱに <code>100000000</code> としても良かったとは思う。</p>

<p>ということで、これでわりと大きめなリク<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9">エス</a>トも遅れるようになった。</p>

