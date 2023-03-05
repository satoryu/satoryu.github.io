---
title: Copy for Scrapbox v1.3.0をリリースしました
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

現在開いているタブへのリンクをScrapbox記法で生成し、クリップボードにコピーするChrome拡張の新しいバージョンv1.3.0をリリースしました。
ここでは今回のリリース内容を紹介します。

## 現在のタブのリンクをコピーする際、リンク表記でなくした

これまでは、複数タブのリンクをコピーする場合と同様に、現在のタブのリンクをコピーする場合もリンクのリストを生成していました。
このバージョンからは単純なリンク表記としてクリップボードにコピーされます。

具体的には、現在のタブのリンクをコピーした場合、これまでは以下のようなテキストがクリップボードにコピーされるようになっていました。

```text
 [http://ayamimuto.com/ 武藤彩未 AYAMI MUTO ・ OFFICIAL WEB SITE]
```

これがこのバージョンから下記のようになります。

```text
[http://ayamimuto.com/ 武藤彩未 AYAMI MUTO ・ OFFICIAL WEB SITE]
```

先頭の空白文字が失くなっています。これによりリスト表記ではなくなっています。

## テストコードを追加した

これは機能とは関係無いのですが、jestを使ったテストコードをこのバージョンから入れています。
このさきに機能を増やしていく際に、

- 既存の機能がおかしくなってしまわないか
- 手動だとテストが面倒にならないか
- 読みにくいコードになってしまわないか

という懸念があったので導入しました。

1回作ってそのまま放置していいかとも思ったのですが、気づけば20名ほど[^1]に増えていたので継続して手を入れていこうと考え直しました。

## 要望やバグ報告はGitHubまで

この拡張のソースコードはMITライセンスで、GitHubに公開しています。
もし要望やバグなどを見つけた方がおりましたら、Issueから報告をお願いいたします。

- [satoryu/copy-for-scrapbox: This is a Chrome extension which helps you copy tab(s) as Scrapbox notation easily.](https://github.com/satoryu/copy-for-scrapbox)

また、スポンサーも募っております。
もし、私のOS活動を支援したいという方がおりましたらご検討ください。

- [Sponsor @satoryu on GitHub Sponsors](https://github.com/sponsors/satoryu)

[^1]: 2022/12/30 22:45時点での1週間の利用ユーザー数