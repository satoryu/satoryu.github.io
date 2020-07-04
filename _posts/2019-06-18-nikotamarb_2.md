---
title: "nikotama.rb #2 に行ってきた。 #nikotamarb"
category: blog
tags: [Ruby,イベントレポート]
---
<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fnikotamarb.connpass.com%2Fevent%2F134573%2F" title="nikotama.rb #2 (2019/06/18 19:00〜)" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://nikotamarb.connpass.com/event/134573/">nikotamarb.connpass.com</a></cite></p>

<p>第2回目は、残念なことにキャンセルが出てしまい、何の申し合わせもなく弊社<a href="#f-09b080b9" name="fn-09b080b9" title="まだ辞めていないので弊社と言える。">*1</a>社員のみで開催となった。
どうやら裏で開催している<a href="https://k8sjp.connpass.com/event/134064/">k8s tokyo meetup</a>に持っていかれたらしい。</p>

<h2><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%E9%A5%AF%A5%DE">ラクマ</a>のサーキットブレーカー導入の話</h2>

<p>最初に、今絶賛実施しているという<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%E9%A5%AF%A5%DE">ラクマ</a>でのサーキットブレーカーの導入のLT。</p>

<script async class="speakerdeck-embed" data-id="25d903e1a20a46f59d350abd886727bd" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>


<p>社内<a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a>を利用するアプリの開発で、その<a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a>が死んだ場合の影響を減らすためにYammerが開発しているCircuitboxを導入しようとしているそうだ。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fyammer%2Fcircuitbox" title="yammer/circuitbox" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/yammer/circuitbox">github.com</a></cite></p>

<p><a href="https://github.com/lostisland/faraday">Faraday</a>の<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%DF%A5%C9%A5%EB%A5%A6%A5%A7%A5%A2">ミドルウェア</a>としても使えるらしいので、お手軽に導入できて良さそう。</p>

<ul>
<li><code>AcctiveSupport::Notification</code> で<code>circuit_open</code>などをsubscribeできてログとか便利そう</li>
<li><code>circuit_gauge</code> をsubscribeするとメトリクス情報が取れる</li>
<li>それを外のアグリゲーションに送って集めて、Graphiteとかで可視化すると楽しそう</li>
</ul>


<p>という話でもりあがった。</p>

<h2>誕生日のお祝い</h2>

<p>今日の参加者の<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%E9%A5%AF%A5%DE">ラクマ</a>の方で、お誕生日の方が2名いたのでお祝いした 🎉</p>

<p><span itemscope itemtype="http://schema.org/Photograph"><a href="http://f.hatena.ne.jp/satoryu/20190618210655" class="hatena-fotolife" itemprop="url"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20190618/20190618210655.jpg" alt="f:id:satoryu:20190618210655j:image" title="f:id:satoryu:20190618210655j:image" class="hatena-fotolife" itemprop="image"></a></span></p>

<h2>ざっくばらんに雑談</h2>

<ul>
<li>マイクロサービス</li>
<li><a class="keyword" href="http://d.hatena.ne.jp/keyword/MVC">MVC</a>のコントローラー</li>
<li>プロセスとか知っておこうな！

<ul>
<li><a href="https://tatsu-zine.com/books/naruhounix">なるほどUnixプロセス ― Rubyで学ぶUnixの基礎 - 達人出版会</a> が良い本</li>
<li>さらに原著者が別に出してる<a class="keyword" href="http://d.hatena.ne.jp/keyword/TCP">TCP</a>や<a class="keyword" href="http://d.hatena.ne.jp/keyword/Ruby">Ruby</a>スレッドの本も良いらしい。</li>
</ul>
</li>
</ul>


<p>といったことでワイワイして今日は終えた。</p>

<h2>次回は、7/18（水）開催</h2>

<p>ということで、予定を空けておきましょう。</p>
<div class="footnote">
<p class="footnote"><a href="#fn-09b080b9" name="f-09b080b9" class="footnote-number">*1</a><span class="footnote-delimiter">:</span><span class="footnote-text">まだ辞めていないので弊社と言える。</span></p>
</div>
