---
title: Copy for Scrapbox v1.6.0をリリースしました
excerpt: |
  今回のリリースでは機能追加、バグ修正は含んでおらず、内部の仕組みを大きく変更しました。
  ビルドシステムを導入し、そのおかげで利用している機能のトラッキングを開始しました。
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

今回のバージョン1.6.0は3ヶ月ほどぶりのリリースです。
ですが、機能の追加はありません。
今回のリリースでは、このChrome拡張の内部の変更をしました。
主に2点です。

1. `vite`を使ってビルドできるようにした
2. Google Analytics 4を使って、利用状況を計測できるようにした

## `vite`を使ってビルドできるようにした

これまでこのChrome拡張の開発では、TypeScriptなど使っていませんでした。
リリースの際のパッケージ作成も、GitHub Workflowでzipコマンドで圧縮するのみでありました。
ということもあり、ビルドツールの必要性が無い状況でした。

現在の利用状況を詳しく知るために、Google Analytics 4を導入しようとしたのですが、Content Security Policyの制限があるため導入が非常に難しい状況です。

- [Manifest - Content Security Policy - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/manifest/content_security_policy/)

一方で、Measurement Protocolを利用した計測方法について公開しているものを見つけました。

- [How to use Google Analytics 4 in your Chrome Extension - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/tut_analytics/)

ここで使用するIDやシークレットを開発中と実際に提供しているものとで切り替えるために、ビルドツールが必要になったという次第です。

また、先のContent Security Policyにより、Google Analytics以外にも`script`タグでCDNで配布されているようなライブラリを利用することができません。
ですが、ビルドツールを入れたことでnpmパッケージを利用できるようになりました。

## Google Analytics 4を使って、利用状況を計測できるようにした

このChrome拡張の利用状況を知りたいと思い、理鶯状況を計測できるようにしたいと思いました。
これまでChrome Web Storeのデベロッパーダッシュボードでも、週ごとの利用者数などはわかるのですが、具体的にどの機能が利用されているのかはわかりません。
例えば、

- ポップアップ画面にあるボタンのうち
- どのボタンが押されているのかだったり
- コンテキストメニューで提供している機能はどれだけ使われているのか

といったことは把握できていません。
そこで、このバージョンからイベントトラッキングをできるようにしました。
**当然ですが、コピーしたURL自体の情報は収集していません。**

## おわりに

今回のリリースで、ビルドツールを使えるようになりました。
それによりできることの幅が広がりそうな気がしています。
