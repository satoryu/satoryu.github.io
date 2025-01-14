---
title: Tidy First? を読んで、Tidy Firstした。
category: blog
excerpt: |
  Kent Beck が書いたソフトウェア設計の本Tidy First?を読んで、Tidy Firstしてみた。
header:
  og_image: https://m.media-amazon.com/images/I/81HY3rbdOBL._SY425_.jpg
  overlay_filter: rgba(35, 35, 35, 0.2)
tags:
  - 読書
  - Kent Beck
  - ソフトウェア設計
  - プログラミング
---

[![表紙](https://m.media-amazon.com/images/I/81HY3rbdOBL._SY425_.jpg)](https://amzn.to/3BXFnAu)

[Tidy First?](https://amzn.to/3BXFnAu) は、Kent Beck が書いたソフトウェア設計に関する本です。
訳者あとがきを含めても128ページと薄い本で、各章も短く、読みやすい内容でした。
特定の言語やフレームワークに依存しない内容で、本書で扱われているコードもシンプルな疑似言語[^1]で書かれています。
ですので、少しでもプログラミングを経験したことがある人であれば、読みやすい内容だと思います。

[^1]: 初めて見る疑似言語の書き方だったので、名前はわからなかった。

実際に試しにやってみたくなったので、Tidy Firstしてみました。
作ったまま放置していたカスタムGitHub Actionsの[labelling-by-gpt](https://github.com/satoryu/labeling-by-gpt)に、昨年末に[「もう動かない」というIssueが立てられていた](https://github.com/satoryu/labeling-by-gpt/issues/4)ので、それを解決するためにやってみました。

実際にやってみた結果が、こちら[^2]：
[Extracts codes about using completion API · satoryu/labeling-by-gpt@21403cf](https://github.com/satoryu/labeling-by-gpt/commit/21403cf117e50148cdf6d703e37831cdb4b16667)

[^2]: コミットはもっと細かくすればわかりやすくなったかもしれない、という反省。

## どうやったか

およそ2年ぶりくらいに見るコードだったので、まったく初めてのコードを見るようなものでした。
動くように直したくても、まずはどこがどのように動いていたものなのかを理解する必要がありました。
そこで、まずはどういったコードだったのかを理解するために、読むことから始めました。
かなり雑に書いたコードだったので、読んでいくうちに「ここはこういう意味なのか」といった理解していくタイミングがありました。
そのタイミングで、コメントを入れたり、説明変数を加えたり、関数を切り出したりしたりしました。

整理していく途中で、たまたま動かない部分のコードを関数`proposeLabels`にまとめることができました。
GitHub Actionsから呼び出されることを前提にしていたものを切り離すことができたので、動作確認のコードが書きやすくなりました。
[Adds a script to test ai.js · satoryu/labeling-by-gpt@5774004](https://github.com/satoryu/labeling-by-gpt/commit/5774004071e5fc196a2ab1a64d9d4b433d04e220)
[^3]

[^3]: テストコードを書こうと思ったけれども、APIを再現するのが面倒だったので、実際にAPIを叩くスクリプトを書いた。

## やってみて思ったこと

コードを読みながら、この本の目次をパラパラと見ながら、どの章の整理ができそうかを考えていました。
各章はただ短くわかりやすいというだけでなく、その分だけ使いやすいということもあるように感じました。
ただ、同じことをやろうとしても、おそらく人によって異なるものになると思います。
例えば、ひとかたまりにするにしても、どういったかたまりにするのか、そこにどういう名前をつけるのかは人によって異なると思います。
なので、この本を読書会すると面白そうだと思っています。
