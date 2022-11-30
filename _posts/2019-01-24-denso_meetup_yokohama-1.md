---
title: "DENSO Meetup Yokohama #1 に行ってきた。"
category: blog
excerpt: |
  自動車業界の中でも有名なデンソーさんが、新横浜に独立した内製の開発組織を作っていて、その部署とクリエーションラインさんの共催イベントの第一回目に行ってきました。
header:
  teaser: https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20190124/20190124101419.jpg
  overlay_image: https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20190124/20190124101419.jpg
tags: [イベントレポート,Ruby,TDD,デンソー]
---
<p><span itemscope itemtype="http://schema.org/Photograph"><a href="http://f.hatena.ne.jp/satoryu/20190124101419" class="hatena-fotolife" itemprop="url"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20190124/20190124101419.jpg" alt="f:id:satoryu:20190124101419j:image" title="f:id:satoryu:20190124101419j:image" class="hatena-fotolife" itemprop="image"></a></span></p>

<p>自動車業界の中でも有名な<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%F3%A5%BD%A1%BC">デンソー</a>さんが、新横浜に独立した内製の開発組織を作っていて、その部署とクリエーションラインさんの共催イベントの第一回目に行ってきました。
Attractor社の吉羽さんがコーチに入っているという話を以前に伺っていて、昨年の<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%D6%A5%B5%A5%DF">デブサミ</a>でも講演していたり、大企業の中で<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A2%A5%B8%A5%E3%A5%A4%A5%EB">アジャイル</a>開発の導入を取り組んでいることは知っていました。
このイベントでは、1年半前のオフィス立ち上げから携わっているエンジニアの方々の話を聞くことができました。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fconnpass.com%2Fevent%2F115706%2F" title="DENSO Meetup Yokohama #1 (Ruby苦労話 &amp; テスト駆動開発) (2019/01/23 19:00〜)" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://connpass.com/event/115706/">connpass.com</a></cite></p>

<p>オフィスの一室のでっかいテーブルとでっかいディスプレイをわいわい囲んで、ひさびさに「勉強会」っぽさあるミートアップでした<a href="#f-5049b059" name="fn-5049b059" title="勉強会っぽさって何だよ、というツッコミはお控えください。">*1</a>。</p>

<h2><a class="keyword" href="http://d.hatena.ne.jp/keyword/RoR">RoR</a>未経験なのに、3か月でプロトタイプ開発した話 @hiroky_814</h2>

<p>最初はGoで書いていたサービスを<del>酔った勢いで</del>本人も使ったことが無かった<a class="keyword" href="http://d.hatena.ne.jp/keyword/Rails">Rails</a>にしようという提案が採用されて、そこからどういった開発や学びの話でした。
チームで意思決定できる環境で、新しいことにチャレンジしやすい反面、過去に作ったものが負債になってしまうということや、機能ごとに実装した人しかわからなくなってしまうような属人化があるなど、スピード重視で作ったときのあるある感がありました。
しかし、開発の途中から「品質を優先」として、rubocopを入れたり、<a class="keyword" href="http://d.hatena.ne.jp/keyword/OSS">OSS</a>を読んだり、外部から<a class="keyword" href="http://d.hatena.ne.jp/keyword/Rubyist">Rubyist</a>を呼んで<a class="keyword" href="http://d.hatena.ne.jp/keyword/Rails">Rails</a> Wayを学ぶといった取り組みをしたそうです。
新しくチームが立ち上がった時に、レビューには他のチームの人たちを招待するという取り組みはとても面白いと思いました。</p>

<h2><a class="keyword" href="http://d.hatena.ne.jp/keyword/AWS">AWS</a>の機能が増えすぎて、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Ruby">Ruby</a>実装をやり直した話 @じゅんじゅん</h2>

<p><blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr"><a class="keyword" href="http://d.hatena.ne.jp/keyword/SQL">SQL</a>のための<a class="keyword" href="http://d.hatena.ne.jp/keyword/Ruby">Ruby</a>でバッチ書こう！<br>→ <a class="keyword" href="http://d.hatena.ne.jp/keyword/AWS">AWS</a> Lambda がSQS対応 <br>→ じゃ、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Python">Python</a>で書こう！<br>→ <a class="keyword" href="http://d.hatena.ne.jp/keyword/AWS">AWS</a> Lambda <a class="keyword" href="http://d.hatena.ne.jp/keyword/Ruby">Ruby</a>で実装可能に  （イマココ <a href="https://twitter.com/hashtag/densohack?src=hash&amp;ref_src=twsrc%5Etfw">#densohack</a></p>&mdash; さとりゅう 🌸 たつや学院 (@sato_ryu) <a href="https://twitter.com/sato_ryu/status/1088024714386169856?ref_src=twsrc%5Etfw">2019年1月23日</a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D1%A5%D6%A5%EA%A5%C3%A5%AF%A5%AF%A5%E9%A5%A6%A5%C9">パブリッククラウド</a>のアップデートと開発との追いかけっこしてしまった話でした。
作ったり、作ってる最中にほしかったものがリリースされるのありますねーｗ</p>

<h2><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C6%A5%B9%A5%C8%B6%EE%C6%B0%B3%AB%C8%AF">テスト駆動開発</a>(TDD)の紹介 @安井 力(やっとむ)</h2>

<p>昨日は、TDDBCの資料をベースに、TDDの説明と<a class="keyword" href="http://d.hatena.ne.jp/keyword/FizzBuzz">FizzBuzz</a>を例に実演をしてくれました。</p>

<p>TDDBCの資料はこちら。
<iframe id="talk_frame_467044" src="//speakerdeck.com/player/de4a4cc340474f64b9f33ab0eae44cf6" width="710" height="399" style="border:0; padding:0; margin:0; background:transparent;" frameborder="0" allowtransparency="true" allowfullscreen="allowfullscreen" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe><cite class="hatena-citation"><a href="https://speakerdeck.com/yattom/tesutoqu-dong-kai-fa-ru-men">speakerdeck.com</a></cite></p>

<ul>
<li>動かない汚いコードから、きれいで動くコードへ向かう道は二通り。きれいにしてから動くようにする、もしくは動くようにしてからきれいにする。

<ul>
<li>前者はきれいにすることにいくらでも時間を注いでしまいがちで、きれいにしてから動くようにする時にうまくいかないことがわかったりする。</li>
<li>後者はTDDのとる道。動くようにし、動くとは何かをテストで書いて、それを維持したままきれいにしていく。</li>
</ul>
</li>
<li>まずはToDoリストを作るところから始める。</li>
<li>テストの方が負債化しやすい。だから意味のあるテストを残し、それがわかりやすいようにする。

<ul>
<li><a class="keyword" href="http://d.hatena.ne.jp/keyword/RSpec">RSpec</a>では<code>describe</code>のネストができるので、それを使って、ToDoとの関連を記述していたのは学びだった！例えば、 <code>describe "3の倍数"</code>みたいに。</li>
</ul>
</li>
<li>テストを取り除けるのは書いたあとすぐ。時間が経つと除去していいのか不安になる。そして他人が書いたコードとなるとさらに不安。</li>
</ul>


<p>TDDってコードだけではわかりづらくて、どう書いているか流れを見たかったので、こっそり動画に撮ってたんですが、アプリが固まって保存できてなかった…
一昨年に出た新訳の<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C6%A5%B9%A5%C8%B6%EE%C6%B0%B3%AB%C8%AF">テスト駆動開発</a>は、サンプルコードに差分が載っていて、どう変更していったのかが追いやすくなっていると教えてもらいました。</p>

<p><div class="hatena-asin-detail"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4274217884/satoryuhatenablog-22/"><img src="https://images-fe.ssl-images-amazon.com/images/I/51hsd-b1RTL._SL160_.jpg" class="hatena-asin-detail-image" alt="テスト駆動開発" title="テスト駆動開発"></a><div class="hatena-asin-detail-info"><p class="hatena-asin-detail-title"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4274217884/satoryuhatenablog-22/">テスト駆動開発</a></p><ul><li><span class="hatena-asin-detail-label">作者:</span> Kent <a class="keyword" href="http://d.hatena.ne.jp/keyword/Beck">Beck</a>,和田卓人</li><li><span class="hatena-asin-detail-label">出版社/メーカー:</span> <a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%AA%A1%BC%A5%E0%BC%D2">オーム社</a></li><li><span class="hatena-asin-detail-label">発売日:</span> 2017/10/14</li><li><span class="hatena-asin-detail-label">メディア:</span> 単行本（ソフトカバー）</li><li><a href="http://d.hatena.ne.jp/asin/4274217884/satoryuhatenablog-22" target="_blank">この商品を含むブログ (1件) を見る</a></li></ul></div><div class="hatena-asin-detail-foot"></div></div></p>

<h2>懇親会とふりかえり</h2>

<p>クリエーションラインさんからヤッホーブルーイングの<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%D5%A5%C8%A5%D3%A1%BC%A5%EB">クラフトビール</a>の差し入れをいただき、懇親会。
自己紹介したり、今やってることの話しをしたり、TDDの話をしたり、ワイワイしてた。</p>

<p><blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr"><a href="https://twitter.com/hashtag/densohack?src=hash&amp;ref_src=twsrc%5Etfw">#densohack</a> でよなよな！ <a href="https://twitter.com/hashtag/creationline?src=hash&amp;ref_src=twsrc%5Etfw">#creationline</a> さん、ありがとうございます😊 <a href="https://t.co/ffj1RjMP1H">pic.twitter.com/ffj1RjMP1H</a></p>&mdash; さとりゅう 🌸 たつや学院 (@sato_ryu) <a href="https://twitter.com/sato_ryu/status/1088040866906759170?ref_src=twsrc%5Etfw">2019年1月23日</a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>

<p>第1回目のふりかえりは、@yattom さんがいたので、もちろんここはFun-Done-Learn。</p>

<p><span itemscope itemtype="http://schema.org/Photograph"><a href="http://f.hatena.ne.jp/satoryu/20190124101446" class="hatena-fotolife" itemprop="url"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20190124/20190124101446.jpg" alt="f:id:satoryu:20190124101446j:image" title="f:id:satoryu:20190124101446j:image" class="hatena-fotolife" itemprop="image"></a></span></p>

<p>やっとむさんとFDLの話ができて楽しかった。</p>

<p>次回は<a class="keyword" href="http://d.hatena.ne.jp/keyword/%BD%A9%CD%D5%B8%B6">秋葉原</a>のクリエーションラインさんで開催するみたいな話が出てました。</p>

<h2>おまけ</h2>

<p>爪痕を残した(๑•̀ㅂ•́)و✧</p>

<p><blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr"><a href="https://twitter.com/hashtag/densohack?src=hash&amp;ref_src=twsrc%5Etfw">#densohack</a> <a class="keyword" href="http://d.hatena.ne.jp/keyword/DENSO">DENSO</a> meetupに参加頂いた皆さん、ありがとうございました！<br>なぜか、ローマの休出だけが変に頭に残ってます</p>&mdash; avance7 (@Sen_Koizumi) <a href="https://twitter.com/Sen_Koizumi/status/1088191895094710273?ref_src=twsrc%5Etfw">2019年1月23日</a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>
<div class="footnote">
<p class="footnote"><a href="#fn-5049b059" name="f-5049b059" class="footnote-number">*1</a><span class="footnote-delimiter">:</span><span class="footnote-text">勉強会っぽさって何だよ、というツッコミはお控えください。</span></p>
</div>
