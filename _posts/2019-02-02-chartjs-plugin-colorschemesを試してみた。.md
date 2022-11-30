---
title: "chartjs-plugin-colorschemesを試してみた。"
category: blog
tags: [JavaScript,Chart.js]
---
<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20190202/20190202193530.png" alt="f:id:satoryu:20190202193530p:plain" title="f:id:satoryu:20190202193530p:plain" class="hatena-fotolife" itemprop="image"></span></p>

<p>ウェブの画面に棒グラフや折れ線グラフを表示するための<a class="keyword" href="http://d.hatena.ne.jp/keyword/JavaScript">JavaScript</a>ライブラリに<a href="https://www.chartjs.org/docs/latest/">Chart.js</a> というのがあって、とても便利。
しかし、ちょっと悩ましいことがある。
複数のデータをプロットする際に、それぞれの色をどうするか自分で考えなければいけないということだ。</p>

<p>そういった時に使えそうな<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3">プラグイン</a>を見つけたので、ここで紹介。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fnagix.github.io%2Fchartjs-plugin-colorschemes%2F" title="chartjs-plugin-colorschemes" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://nagix.github.io/chartjs-plugin-colorschemes/">nagix.github.io</a></cite></p>

<p>これはChart.jsで書くチャートのカラーパレットを提供してくれる。
個別に色を指定することは必要ないのはとても嬉しい。</p>

<p>自分は最近はwebpackを使うようにしているので、以下のような感じにセットしてみた。</p>

<pre class="code" data-lang="" data-unlink>npm install chartjs
npm install chartjs-plugin-colorschemes</pre>


<p>とした後に、使いたいところで、</p>

<pre class="code lang-javascript" data-lang="javascript" data-unlink><span class="synStatement">import</span> <span class="synConstant">'chartjs-plugin-colorschemes'</span>;
<span class="synStatement">import</span> Chart from <span class="synConstant">'chart.js'</span>;

<span class="synStatement">new</span> Chart(ctx, <span class="synIdentifier">{</span>
   <span class="synComment">// ... some definitions of chart</span>
        options: <span class="synIdentifier">{</span>
            plugins: <span class="synIdentifier">{</span>
                colorschemes: <span class="synIdentifier">{</span>
                    scheme: <span class="synConstant">'brewer.Paired12'</span>
                <span class="synIdentifier">}</span>
            <span class="synIdentifier">}</span>
        <span class="synIdentifier">}</span>
   <span class="synIdentifier">}</span>);
</pre>


<p>のようにする。
このオプションで選ぶ<code>scheme</code>は、かなり豊富で以下のページで確認できる。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fnagix.github.io%2Fchartjs-plugin-colorschemes%2Fcolorchart.html" title="chartjs-plugin-colorschemes Color Chart" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html">nagix.github.io</a></cite></p>

<p>簡単なサンプルを作ってみたので、参考になれば。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fsatoryu%2Fchartjs-sample" title="satoryu/chartjs-sample" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/satoryu/chartjs-sample">github.com</a></cite></p>

