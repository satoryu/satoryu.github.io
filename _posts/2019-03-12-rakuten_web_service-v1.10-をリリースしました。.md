---
title: "rakuten_web_service v1.10 をリリースしました。"
category: blog
tags: [Ruby,Rakuten Web Service,rubygems]
---
<p>ちまちまと開発を続けている<a href="https://rubygems.org/gems/rakuten_web_service/versions/1.10.0"><code>rakuten_web_service</code> v1.10.0 </a>をリリースしました。</p>

<p>今回のリリースで、やっとこさトラベル<a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a>のうち</p>

<ul>
<li>Simple <a class="keyword" href="http://d.hatena.ne.jp/keyword/Hotel">Hotel</a> Search <a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a></li>
<li>Get Area Class <a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a></li>
</ul>


<p>を使えるようになりました。</p>

<h2>経緯</h2>

<p>プルリク<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9">エス</a>トを振り返ってみると、 <del>この<a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a>だけがレスポンスの形がマジ糞</del> 設計思想が異なるところから、それをどう取り込んだらいいのか悩んだ挙げ句、途中で挫折してから5年も経ってしまっていました。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Frakuten-ws%2Frws-ruby-sdk%2Fpull%2F91" title="Support travel&#39;s SimpleHotel and GetAreaClass APIs by satoryu · Pull Request #91 · rakuten-ws/rws-ruby-sdk" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/rakuten-ws/rws-ruby-sdk/pull/91">github.com</a></cite></p>

<p>この機能を望んでいる方が現れたので、開発を再開した次第です。</p>

<p><blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">改めて勉強がてら<a class="keyword" href="http://d.hatena.ne.jp/keyword/Rails">Rails</a>周り触ってみてる。Rakutenの<a class="keyword" href="http://d.hatena.ne.jp/keyword/SDK">SDK</a>便利なんだけど、TravelAPIだけ未リリース。<a href="https://twitter.com/sato_ryu?ref_src=twsrc%5Etfw">@sato_ryu</a>さんリリースしてくださらないかなぁ・・・<a href="https://t.co/oahToKV0zo">https://t.co/oahToKV0zo</a></p>&mdash; mano🚲 (@<a class="keyword" href="http://d.hatena.ne.jp/keyword/hiroya">hiroya</a>_mano) <a href="https://twitter.com/hiroya_mano/status/1101620967451705344?ref_src=twsrc%5Etfw">2019年3月1日</a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>

<h2>使い方</h2>

<p><code>RakutenWebService::Travel::Hotel</code> の<code>search</code> メソッドを使い、SimpleHotelSearch <a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a>を利用することができます。</p>

<pre class="code lang-ruby" data-lang="ruby" data-unlink>hotels = <span class="synType">RWS</span>::<span class="synType">Travel</span>::<span class="synType">Hotel</span>.search(
  <span class="synConstant">latitude</span>: <span class="synConstant">128440.51</span>,
  <span class="synConstant">longitude</span>: <span class="synConstant">503172.21</span>,
  <span class="synConstant">searchRadius</span>: <span class="synConstant">1</span>
)
</pre>


<p>また、<code>RakutenWebService::Travel::AreaClass</code> を使うことで、エリアコードを扱うことができます。
AreaClass はLargeClassの唯一のクラス <code>japan</code> を根とした<a class="keyword" href="http://d.hatena.ne.jp/keyword/%CC%DA%B9%BD%C2%A4">木構造</a>になっています。あるエリアの中の要素は <code>children</code> メソッドで取得することができ、またあるエリアの親エリアの要素は<code>parent</code> で取得することができます。</p>

<p>以下のコードは、東京の子エリアの中から「<a class="keyword" href="http://d.hatena.ne.jp/keyword/%C6%F3%BB%D2%B6%CC%C0%EE">二子玉川</a>」を含むエリアを取得し、そのエリアに含まれるホテル施設を検索しています。</p>

<pre class="code lang-ruby" data-lang="ruby" data-unlink>
tokyo = <span class="synType">RakutenWebService</span>::<span class="synType">Travel</span>::<span class="synType">AreaCode</span>::<span class="synType">SmallClass</span>[<span class="synSpecial">'</span><span class="synConstant">tokyo</span><span class="synSpecial">'</span>]
nikotama = tokyo.children.find { |<span class="synIdentifier">area</span>| area.class_name =~ <span class="synSpecial">/</span><span class="synConstant">二子玉川</span><span class="synSpecial">/</span> }

nikotama.search.each <span class="synStatement">do</span> |<span class="synIdentifier">hotel</span>|
  puts <span class="synSpecial">&quot;</span><span class="synConstant">Hotel Name: </span><span class="synSpecial">#{</span>hotel.basic_info[<span class="synSpecial">'</span><span class="synConstant">hotelName</span><span class="synSpecial">'</span>]<span class="synSpecial">}&quot;</span>
<span class="synStatement">end</span>
</pre>


<p>ご要望、バグ報告があれば、ぜひIssueを！</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Frakuten-ws%2Frws-ruby-sdk%2Fissues" title="rakuten-ws/rws-ruby-sdk" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/rakuten-ws/rws-ruby-sdk/issues">github.com</a></cite></p>

