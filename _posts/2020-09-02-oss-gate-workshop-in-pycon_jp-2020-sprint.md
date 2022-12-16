---
title: PyCon JP 2020でOSS Gateワークショップを開催しました
slug: oss-gate-workshop-in-pycon_jp-2020-sprint
date: 2020-09-02
toc: true
header:
  teaser: /assets/img/2020-09-02-oss-gate-workshop-in-pycon_jp-2020-sprint.png
  og_image: /assets/img/2020-09-02-oss-gate-workshop-in-pycon_jp-2020-sprint.png
  overlay_image: /assets/img/2020-09-02-oss-gate-workshop-in-pycon_jp-2020-sprint.png
  overlay_filter: rgba(35, 35, 35, 0.5)
category: blog
tags:
  - OSS Gate
  - PyCon JP
  - Python
  - OSS
---

去る8月23日にPyCon JP 2020 Sprintの1つとして、OSS Gateワークショップを開催しました。

OSS Gateの立ち上げに関わったメンバーがRubyコミュニティと繋がりがある人達だったので、他の言語のコミュニティとの接点があまりありませんでした。
これまでワークショップには、様々なバックグラウンドのビギナーの方々に参加していただいていました。
今回はもっと積極的に関わっていこうという試みとして、PyCon JPの関連イベントであるスプリント内で開催しました。

## :snake: スプリントについて

イベント告知ページから抜粋します。

> 多くのオープンソースソフトウェアの開発は、ウェブ上でオンラインのコミュニケーションを通じて行われています。
> ほとんどの場合はオンライン上で事足りますが、時には集まって共同開発を行うことが、開発を大きく前に進めるために有効なことがあります。
>
> 特定のプロジェクトに興味がある開発者同士が集まって、短時間で素早く進捗を出す開発ミートアップを実現するイベントとして、スプリントやハッカソンが生まれました。 開発者が一同に集まるカンファレンスが、こういったスプリントを実現する場として最適な場であるため、カンファレンスの一部としてスプリントが開かれることがあります。
>
> PyCon JP 2020のスプリントでは、コミュニケーションの場（Discord）と発表の場を用意します。
> スプリント参加者の皆さんには、ご自分のPC、スキル、そして開発への情熱を持ってご参加ください！
>
> - [PyCon JP 2020 Sprint - connpass](https://pyconjp.connpass.com/event/183507/)より抜粋

ということで、PyCon JPというお祭りの前にワイワイと集まってPython関連のプロジェクトで楽しもう、というものです。

スプリントに参加する方の中には、

> PythonのOSSに何か貢献してみたい！けど、OSS開発がよくわからない。

といった方がいらっしゃるのではないかと思いました。
その方々をサポートすることで、PythonのOSS開発を盛り上げるきっかけになるのではにかと考え、OSS Gateワークショップ開催に至りました。

## やったこと

今回のスプリントは、8/22〜8/29までの一週間のオンラインでの開催でした。
オンラインで使用したツールは、Discordです。

OSS Gateでは、1週間のうち、以下のような日程で開催しました

- 8/23 13:00 - 19:00 OSS Gateワークショップ
- 8/24 〜 8/28 20:00 - フォローアップ

開催したワークショップ自体は通常定期的に行っているものと同じ内容です。
今回のスプリントでは、ワークショップ開催後の平日夜間にフォローアップのための時間を取りました。
このフォローアップでは、

- ワークショップ中に終えられなかった作業の続きを進める
- ワークショップで学んだ方法で違うOSSへのコントリビューションに挑戦する

といった目的です。

## :microphone: 進行

ワークショップ内でどういうことを行ったのかは、
ワークショップの全体の進行で使ったスライドを御覧ください

- [OSS Gateワークショップ（チュートリアル） - OSS Gate - Rabbit Slide Show](https://slide.rabbit-shocker.org/authors/oss-gate/workshop-tutorial/)

これは通常のワークショップで用いているものと同様です。
今回は、

- 進行役1名（わたし）
- ビギナー 3名
- サポーター 6名

という参加者でしたので、ビギナー1名に対して2名のサポーターが付いてワークを行いました。

## :speaker: 各チャネル

今回はオンライン開催ということで、以下のよううなチャンネル設計で実施しました。

- `#general` 全体の進行
- `#room-1` 〜 `#room-3` 各ビギナーの作業スペース。サポーターとのやりとりの記録。

それぞれテキストとボイスチャネルを作成しました。
Discordのボイスチャネルは、音声のみだけでなく、画面共有ができます。
`#general`チャネルでは、進行役がボイスチャネルで画面共有し、URLの共有などテキストを周知するためにテキストチャネルを利用しました。
`#room-1`などは、各ビギナーのワークを行うための部屋として利用しました。
各テキストチャネルでは、`#general`と同様に、ビギナーとサポーター間でのコミュニケーションのために利用しました。

## 当日のようす

各ビギナー参加者はワーク中の作業ログをGitHub Issuesに残しています。
今回参加してくださったビギナーの方々のログは下記のリンクから見ることができます。

- [OSS Gate Workshop:PyConJp 2020 Sprint: 2020-8-23:masamori0083 : Django: Work log · Issue #1409 · oss-gate/workshop](https://github.com/oss-gate/workshop/issues/1409)
- [OSS Gate Workshop: PyConJP 2020 Sprint: 2020-08-23: norihitoishida: Optuna: Work log · Issue #1408 · oss-gate/workshop](https://github.com/oss-gate/workshop/issues/1408)
- [OSS Gate Workshop: PyConJP 2020 Sprint: 2020-08-23: Miura55:NFCPy : Work log · Issue #1406 · oss-gate/workshop](https://github.com/oss-gate/workshop/issues/1406)

それぞれ取り組んでいただいたOSSについて、以下のことに取り組んでいました。

- Getting Startedの曖昧な表現の修正の発見
- チュートリアルドキュメントまでの導線の不備の発見
- ドキュメンテーションのPull-Requests

## :calendar: 次回ワークショップの案内

次回、OSS Gate WorkshopはOnline（Discord）で開催予定です。
Discordのサーバーの招待は参加者にのみ通知されるので、Doorkeeperのイベントページより事前の申し込みをお願いします。

[OSS Gate東京ワークショップ2020-09-12 - OSS Gate \| Doorkeeper](https://oss-gate.doorkeeper.jp/events/109385)

## おわりに

今年始めのPyCon JPの実行委員の打ち合わせに参加させていただいてから、開催に至るまで、実行委員の方々に前向きに対応していただいたこと、大変感謝しています。
本当にありがとうございました！

そして、当日参加してくださったビギナーとサポーターの皆さん、ありがとうございました。
オンラインの取り組みとしてまだ慣れない中、楽しんでいただけたようで何よりです。

![記念撮影](/assets/img/2020-09-02-oss-gate-workshop-in-pycon_jp-2020-sprint.png)
