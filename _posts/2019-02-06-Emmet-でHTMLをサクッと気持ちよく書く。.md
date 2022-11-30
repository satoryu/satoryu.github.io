---
title: "Emmet でHTMLをサクッと気持ちよく書く。"
category: blog
tags: [HTML,Emmet,CSS]
---
<p>Emmet という、HTMLや<a class="keyword" href="http://d.hatena.ne.jp/keyword/CSS">CSS</a>をサクッと書くための<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3">プラグイン</a>がある。
今日はチーム内で、どこまで一度にHTMLコードを生成できるか小一時間くらい盛り上がってしまった。
それくらい気持ちよく書ける。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Femmet.io%2F" title="Emmet — the essential toolkit for web-developers" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://emmet.io/">emmet.io</a></cite></p>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/vim">vim</a> や<a class="keyword" href="http://d.hatena.ne.jp/keyword/emacs">emacs</a>を始め、多くの<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C6%A5%AD%A5%B9%A5%C8%A5%A8%A5%C7%A5%A3%A5%BF">テキストエディタ</a>の<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3">プラグイン</a>が提供されている。
<a class="keyword" href="http://d.hatena.ne.jp/keyword/Visual%20Studio%20Code">Visual Studio Code</a>には同梱されているので、すぐに試せる。</p>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/CSS">CSS</a><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%BB%A5%EC%A5%AF%A5%BF">セレクタ</a>ーに似た記述でHTMLを生成してくれる。</p>

<p>例えば、</p>

<pre class="code" data-lang="" data-unlink>div.container&gt;div.row&gt;(div.col-md-3{Sidebar}+div.col-md-9{Content})</pre>


<p>と入力して展開すると、</p>

<pre class="code lang-html" data-lang="html" data-unlink><span class="synIdentifier">&lt;</span><span class="synStatement">div</span><span class="synIdentifier"> </span><span class="synType">class</span><span class="synIdentifier">=</span><span class="synConstant">&quot;container&quot;</span><span class="synIdentifier">&gt;</span>
    <span class="synIdentifier">&lt;</span><span class="synStatement">div</span><span class="synIdentifier"> </span><span class="synType">class</span><span class="synIdentifier">=</span><span class="synConstant">&quot;row&quot;</span><span class="synIdentifier">&gt;</span>
        <span class="synIdentifier">&lt;</span><span class="synStatement">div</span><span class="synIdentifier"> </span><span class="synType">class</span><span class="synIdentifier">=</span><span class="synConstant">&quot;col-md-3&quot;</span><span class="synIdentifier">&gt;</span>Sidebar<span class="synIdentifier">&lt;/</span><span class="synStatement">div</span><span class="synIdentifier">&gt;</span>
        <span class="synIdentifier">&lt;</span><span class="synStatement">div</span><span class="synIdentifier"> </span><span class="synType">class</span><span class="synIdentifier">=</span><span class="synConstant">&quot;col-md-9&quot;</span><span class="synIdentifier">&gt;</span>Content<span class="synIdentifier">&lt;/</span><span class="synStatement">div</span><span class="synIdentifier">&gt;</span>
    <span class="synIdentifier">&lt;/</span><span class="synStatement">div</span><span class="synIdentifier">&gt;</span>
<span class="synIdentifier">&lt;/</span><span class="synStatement">div</span><span class="synIdentifier">&gt;</span>
</pre>


<p>他にも、属性を付けたりもできる。</p>

<pre class="code" data-lang="" data-unlink>form.form&gt;(label#name[for=&#34;name&#34;]{Name}+input[type=&#34;name&#34;]+label#email[for=&#34;email&#34;]{Email}+input[type=&#34;email&#34;]</pre>


<p>こんな一行から、</p>

<pre class="code lang-html" data-lang="html" data-unlink><span class="synIdentifier">&lt;</span><span class="synStatement">form</span><span class="synIdentifier"> </span><span class="synType">action</span><span class="synIdentifier">=</span><span class="synConstant">&quot;&quot;</span><span class="synIdentifier"> </span><span class="synType">class</span><span class="synIdentifier">=</span><span class="synConstant">&quot;form&quot;</span><span class="synIdentifier">&gt;</span>
    <span class="synIdentifier">&lt;</span><span class="synStatement">label</span><span class="synIdentifier"> </span><span class="synType">for</span><span class="synIdentifier">=</span><span class="synConstant">&quot;name&quot;</span><span class="synIdentifier"> </span><span class="synType">id</span><span class="synIdentifier">=</span><span class="synConstant">&quot;name&quot;</span><span class="synIdentifier">&gt;</span>Name<span class="synIdentifier">&lt;/</span><span class="synStatement">label</span><span class="synIdentifier">&gt;</span>
    <span class="synIdentifier">&lt;</span><span class="synStatement">input</span><span class="synIdentifier"> </span><span class="synType">type</span><span class="synIdentifier">=</span><span class="synConstant">&quot;name&quot;</span><span class="synIdentifier">&gt;</span>
    <span class="synIdentifier">&lt;</span><span class="synStatement">label</span><span class="synIdentifier"> </span><span class="synType">for</span><span class="synIdentifier">=</span><span class="synConstant">&quot;email&quot;</span><span class="synIdentifier"> </span><span class="synType">id</span><span class="synIdentifier">=</span><span class="synConstant">&quot;email&quot;</span><span class="synIdentifier">&gt;</span>Email<span class="synIdentifier">&lt;/</span><span class="synStatement">label</span><span class="synIdentifier">&gt;</span>
    <span class="synIdentifier">&lt;</span><span class="synStatement">input</span><span class="synIdentifier"> </span><span class="synType">type</span><span class="synIdentifier">=</span><span class="synConstant">&quot;email&quot;</span><span class="synIdentifier">&gt;</span>
<span class="synIdentifier">&lt;/</span><span class="synStatement">form</span><span class="synIdentifier">&gt;</span>
</pre>


<p>フォームがサクッとガッツリできる。
なんか気持ち良い。</p>

<h2>良いところ</h2>

<p>慣れるまで時間がかかるかもしれないし、テンプレートエンジンやVue.jsなどクライアント側で<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EC%A5%F3%A5%C0%A5%EA%A5%F3%A5%B0">レンダリング</a>するような場合、そこまで複雑なHTMLを書くことは無いかもしれない。
けれど、</p>

<ul>
<li>記述量が減るし、</li>
<li>閉じタグを忘れることもなくなるし、</li>
<li>単純作業を減らせる</li>
</ul>


<p>といった利点がある。</p>

<p>頑張って一行で書ききったつもりが、思ったものと違うHTMLを生成してしまうこともあって、その時の残念感もなかなか大きい。
慣れるために、写経で、<a href="https://docs.emmet.io/cheat-sheet/">チートシートを脇に</a>正解がわかった上でそれをEmmetで生成するにはどうするかと考えていくと良さそう。</p>

