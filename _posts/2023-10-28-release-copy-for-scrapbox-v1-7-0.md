---
title: Copy for Scrapbox v1.7.0をリリースしました
excerpt: |
  現在開いているタブへのリンクをScrapbox記法で生成し、クリップボードにコピーするChrome拡張の新しいバージョンをリリースしました。
  ここでは今回のリリース内容を紹介します。
category: blog
header:
  teaser: /assets/img/Copy-for-Scrapbox-Chrome.png
  overlay_image: /assets/img/Copy-for-Scrapbox-Chrome.png
  overlay_filter: 0.7
  caption: |
    [Chrome Web Store](https://chrome.google.com/webstore/detail/copy-for-scrapbox/kalhokahkhkmbkiliieonfdmdeajlnog)
tags:
  - Scrapbox
  - Chrome拡張
  - リリースノート
  - Copy for Scrapbox
---

今回のリリースでは新しい機能を追加しました。

### :memo: 選択した文章を引用形式でコピーできるようになりました :tada:

![](https://www.satoryu.com/copy-for-scrapbox/copy-as-quote.gif)

閲覧しているページ中の選択した文章を引用文としてクリップボードにコピーするコンテキストメニューを追加しました。
単に引用文としてコピーしたい場合は、この機能を使わずとも、普段のコピー・アンド・ペーストで実現できます。
この拡張では、選択した引用文だけでなく、引用元となったページのURLとタイトルをリンクとして追加しています。

#### 経緯

以前は、Twitter（現X）のツイートのURLをScrapboxに貼り付ける際に、Cmd+Shift+Vでペーストすると、ツイート本文も含めて貼り付けることができました。
ですが、X（旧Twitter）の仕様変更のためなのか、ツイートのURLを先の手段で貼り付けても、本文が取得できなくなってしまいました。
これまでScrapboxに有用なツイートを集めることがあったので、その作業がとても煩わしくなってしまいました。
そこで、今回のこの機能が欲しいと思い、実装しました。

切り取りたいツイート本文を選択し、コンテキストメニューから「Copy as Quote」を選択すると、以下のようなリンクがクリップボードにコピーされます。

```text
> 「この関数の仕様について教えてください」 「引数にtrueを渡すと、文字列としてonを返します」 （1/2）
> [https://twitter.com/sato_ryu/status/1716966656059281867 Xユーザーのさとりゅう 🌸 たつや学院さん: 「「この関数の仕様について教えてください」 「引数にtrueを渡すと、文字列としてonを返します」 （1/2）」 / X]
```

### 要望やバグ報告はGitHubまで

この拡張のソースコードはMITライセンスで、GitHubに公開しています。
もし要望やバグなどを見つけた方がおりましたら、Issueから報告をお願いいたします。

[satoryu/copy-for-scrapbox: This is a Chrome extension which helps you copy tab(s) as Scrapbox notation easily.](https://github.com/satoryu/copy-for-scrapbox)
