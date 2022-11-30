---
title: Scrum Fest Mikawa 2021に参加してきた
excerpt: |
  アジャイル開発やスクラムのカンファレンスであるスクラムフェス三河が今年も10/1、2の二日間オンラインとオフラインのハイブリットで開催されました。
  いくつかのセッションに参加してきたので、その感想を書きます。
header:
  teaser: /assets/img/20211004/scrumfestmikawa2021.png
  overlay_image: /assets/img/20211004/scrumfestmikawa2021.png
  overlay_filter: 0.5
toc: true
tags:
  - スクラム
  - アジャイル開発
  - じゃんだらりん
  - イベントレポート
---

10月1、2日にスクラムフェス三河が開催されました。
今年で2回目となるカンファレンスで、昨年に引き続きオンラインとオフラインのハイブリット開催となりました。

以下、いくつかセッションに参加してきたので、それらについて感想を書いていきたいと思います。

## えっ、まだユニットテスト書いてない現場があるんですか？ - ボトムアップでもっといけてるチームになるために、たった一つの大事なこと

- [プロポーザル](https://confengine.com/conferences/scrum-fest-mikawa-2021/proposal/15885)

<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/51efe3fc9c8f432fbbac50bcc459644a" title="えっ、まだユニットテスト書いてない現場があるんですか？ - ボトムアップでもっといけてるチームになるために、たった一つの大事なこと - / Why don't you write unit tests" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 560px; height: 314px;"></iframe>

タイトルは煽りっぽさがあるけれど、チームの中に地道にTDDを根付かせようとした話。
既にあるチームに後からジョインした人達が良いと思っていること（例えばこの発表であげているTDDのように）を導入することはなかなか難しい。
同じようにTDDを導入したいと考えている人にとってはとても良い参考事例に思えた。

## 狙いはボトルネックだ。小さい課題には目もくれるな！〜タウンワークアプリチームが戦ってきた改善の軌跡〜

- [プロポーザル](https://confengine.com/conferences/scrum-fest-mikawa-2021/proposal/15964)

<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/45c5e7013ec74c13acd63948669bb9a5" title="狙いはボトルネックだ！小さい課題には目もくれるな〜アプリ版〜 / Scrum Fest Mikawa 2021" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 560px; height: 314px;"></iframe>

開発のフローの中で現れるボトルネックを一つずつ潰していったタウンワークモバイルアプリの開発の話。
累積フロー図を使って、開発のフローの中のどこがボトルネックになっているかを可視化、特定していくテクニックは参考になると思った。
TOC、TPSは自分は疎いので、スライド中にあった資料はあとで見てみようと思う[^1][^2]。
ボトルネックは潰していくと別の場所に移っていくというのは実際にあるんだということがこの事例で見える化されていて面白い。

[^1]: [ToC（制約理論）入門 / ToC Introduction - Speaker Deck](https://speakerdeck.com/recruitengineers/toc-introduction)
[^2]: [TPS（トヨタ生産方式）入門 / TPS Introduction - Speaker Deck](https://speakerdeck.com/recruitengineers/tps-introduction)

## 振り返りを積み上げて自分たちのプラクティスとして昇華•体得していくための仕組みと考え方

- [プロポーザル](https://confengine.com/conferences/scrum-fest-mikawa-2021/proposal/15589)

<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/0d1b2321f8054a29bb1ab40fedaed8e3" title="振り返りを積み上げて自分たちのプラクティスとして昇華•体得していくための仕組みと考え方 / ScrumFestMikawa2021" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 560px; height: 314px;"></iframe>

東口さんが課題と感じていた「ふりかえりがフロー情報として流れていってしまう」という課題を解決するためにストックするための仕組みを考え、実践したという話。
パタン・ランゲージの1つであるプロジェクトランゲージを参考に、チーム内で使用しているプラクティスをランゲージとして、チーム内でどのような意味でどのようなことをするものなのかなどを具体的に明文化している。
その明文化を行うために振り返りを起点としている。
これを実践して得られたこととして「チームの学び・成長に対しての確かな実感」というのがあって、確かにそれが得られそうだというのを聞いていて思った。
過去に自分のチームでも自分たちのパターンを書こうというのをやっていた（過去形）けど、また再開させたいと思った。
やっぱりパタン・ランゲージやアレグザンダーはどこにでも出てくるようなので真面目に勉強しないといけないのだろうなぁ。

## 目の前のことを ひたすらやり続けて 起きた変化を見てみかわ

- [プロポーザル](https://confengine.com/conferences/scrum-fest-mikawa-2021/proposal/15956)

<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/2a0a28542cd24ce4abade59bd5b56925" title="目の前のことを ひたすらやり続けて 起きた変化を見てみかわ" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 560px; height: 314px;"></iframe>

このセッションが一番元気をもらえた話だった。
なにかになりたいと思うことはあってもそこに向かって踏み出す人は少ない。かといって何か闇雲にやっての何も当たらない。
けれど、少しずつ積み上げていく中で、たとえ小さくても積み上げたものがそれぞれ何か関連を持ちはじめて、チャンスに繋がっているように思えた。
最近自分も「いったい自分は何者になりたいのだろうか」という漠然とした悩みがあったので、すごく参考になった。
今まさにブログを書いていこうと思えるようになったのは、この発表のおかげ。

## 些細な変化に対する感応度を上げるために

- [プロポーザル](https://confengine.com/conferences/scrum-fest-mikawa-2021/proposal/15975)

<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/94864939471e4a72a2924f0e3b63445a" title="些細な変化に対する感応度を上げるために / Increase sensitivity to minor changes" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 560px; height: 314px;"></iframe>

勉強会の終了とほぼ同時刻に参加レポートをブログに書いて公開するという特殊能力を持つAki.mさんのセッション。
ここ最近で勉強会やカンファレンスで学んだことを取り込んで実践していて、なかなかそういうことが自分はできていないので、すごく刺激的だった。
さらっと「30分ごとにYOWをやっている」とか「本をまるまる写経」とか言ってしまうのパワーがありすぎる。

## 情熱が消えそうなあなたへ - コミュニティでもらった処方箋たち

- [プロポーザル](https://confengine.com/conferences/scrum-fest-mikawa-2021/proposal/15966/)

<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/42f9e81a6d984a5ea3d780164c25ac40" title="Prescription From Community" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 560px; height: 314px;"></iframe>

いつも分散アジャイル[^3]で一緒に参加しているえわさん＆Emiさんのペア登壇。
タイトルの通り、周りに良いことを広めたい伝えたいという想いで活動しているさなかの人が疲れを感じはじめて情熱が消えてしまわないようにするためのノウハウがたくさん紹介されている。
色々なシチュエーション（症状）に応じて、処方箋という形で紹介しているのが面白かった。
このノウハウを集めるのも分散アジャイルのイベントの中でやっていて、コミュニティの中から生まれたセッションにもなっていてなんだか嬉しかった。

[^3]: [分散アジャイルチームについて考える会 - connpass](https://distributed-agile-team.connpass.com/)

## 虚構としてのアジャイル

- [プロポーザル](https://confengine.com/conferences/scrum-fest-mikawa-2021/proposal/15971)

正直、まだどういう内容なのかわかっていない。
映画イノセンスのオマージュが含まれているこというだけでなく、自分がアジャイル開発やスクラムの普及といったものに関わったことがないからかもしれない。
けれど、それが「派閥逃走ではないのか」という問に関しては、普及を進めるところを傍から見ていると思ったことがあるので、考えさせられるものがあった。
動画が公開されたら、何度か観てみる。

## おわりに

スクフェス三河は2回目だけれども、盛り上がっていて楽しめた。
オンラインとオフラインのハイブリット開催で、オフライン会場で拍手が聞こえるのがカンファレンスの実感のようにも思えて、とても良い雰囲気を出していたように思う。
すこしずつ状況は良くなってきているので、会場で拍手を直接聞ける日もそう遠くないのかもしれない。
今回参加したセッションからは、自分はとても元気を貰えた。
モヤモヤっとしたものを最近感じていたのだけれど、そこから抜け出すための糸口が少し見えた気がする。

という糸口のひとつとして、久しぶりにイベントのレポートを書いてみた。
今年はブログを書くことをサボっていたので、だらだらと半日くらいかけて書いてしまった[^4]。
少しずつ何かを書き残していこう。

[^4]: 午前に書きはじめて、昼間だらだらとして、夜になってガガッと書いている
