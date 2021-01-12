---
title: 管理しているTravis CIからGitHub Actionsへ移行することにした
slug: migrate-from-travis-ci-to-github-actions
date: 2021-01-12
excerpt: Travis CIのプラットフォーム移行により、価格体系が変わる。OSSのリポジトリに対しては継続して無料ではあるが、使用に制限が入る。ということで、GitHub Actionsに適宜移行していく。
header:
  teaser: /assets/img/20210112/migrate-from-travis-ci-to-github-actions.png
  og_image: /assets/img/20210112/migrate-from-travis-ci-to-github-actions.png
  overlay_image: /assets/img/20210112/migrate-from-travis-ci-to-github-actions.png
  overlay_filter: rgba(35, 35, 35, 0.7)
category: blog
tags:
  - Travis CI
  - GitHub
  - GitHub Actions
  - CI
---

先日、メンテしているOSSのruby-docxにとあるプルリクエストが来た。

- [Replace Travis CI build with GitHub Action by mvz · Pull Request #98 · ruby-docx/docx](https://github.com/ruby-docx/docx/pull/98)

Travis CIでは、OSSのリポジトリであれば無料で無制限に使用できる。
Travis CIがこれまでの環境であるtravis-ci.orgを閉鎖を予定しており、新しい環境のtravis-ci.comへの移行するため、各利用者に移行を呼びかけている。
この移行後の環境ではOSSのリポジトリは無料では使えるのだが、使用上の制限が発生する。
それを回避するため、Travis CIの利用をやめて、GitHub Actionsへ移行しようという提案が、上記のプルリクエストとして送られてきた。

このプルリクエストが送られた時に、Travis CIのこの移行について知ったので、プルリクエストの受け入れを判断するために少し調べてみた。

## TL; DR

結論から言うと、今メンテしているものについてはGitHub Actions へ順次移行していくことに決めた。
理由としては、

- ビルドで使用できる事項時間数の制限があり、使い切ることは無さそうだが、それを気することが面倒くさい。
- GitHub Actionsは2021年1月12日時点で、パブリックリポジトリに対しては無料で使用可能

## Travis CI の移行

遡ると、2018年5月にOSSのリポジトリとプライベートリポジトリのビルドをtravis-ci.comへ統一させるといったアナウンスが出ている。

- [The Travis CI Blog: Announcing support for open source projects on travis-ci.com](https://blog.travis-ci.com/2018-05-02-open-source-projects-on-travis-ci-com-with-github-apps)

GitHub Apps Integrationの仕組みを採用するタイミングに合わせて、これまで似ていてわかりづらかったtravis-ci.orgとtravis-ci.comを1つにまとめようとしているようだ。

## 課金体系

課金体系についてもTravis CIが昨年公表している。

- [The Travis CI Blog: The new pricing model for travis-ci.com](https://blog.travis-ci.com/2020-11-02-travis-ci-new-billing)

既存のtravis-ci.comユーザーのことも考慮され、色々と状況別に今回の移行に関して場合分けして書かれているが、OSSのリポジトリに関する記述は「Building on a public repositories only」に書かれている。
この課金体系の変更の背景として、どうやら仮想通貨のマイニングにリソースを使われてしまったりといったことがあるようだ。
そういったことをふまえて、実行時間に上限を設けるために以下のような処置が取られる。

- travis-ci.comを使用しているパブリックリポジトリに対して、トライアルプランへ自動的に移行し、10,000クレジット（Linux環境で1,000分の使用に相当）が付与
- それが失くなったら、有料プランを検討してね
- OSSのリポジトリで使用できる時間についてはTravis CIの人たちがレビューして、追加でクレジットが欲しい場合はサポートに問い合わせてね

おそらくであるが課金体系が月ごとなので、OSSのビルドのために追加でクレジットを要求するのも月単位になるのではないかと懸念している。

より詳細な課金体系については下記のドキュメントを参照すること。

- [Billing Overview - Travis CI](https://docs.travis-ci.com/user/billing-overview/)

## 結論

というこで、Travis CIはtravis-ci.comへ移行した後もOSSに対しては無料で使えそうではある。
しかし、そのためにクレジットの要求などが面倒そうではある。
自分みたいにあまりアクティブではない開発をしているようなOSSの場合、GitHub Actionsなどへの移行を検討するといいのだと思う。

もし開発者が多くアクティブにコミットしていたり、スポンサーが付いていたりするようであれば、有料プランへ移行することでTravis CIを使い続けるという選択肢もあると思う。

Travis CIは便利なので長年使ってきた。
しかし、Travis CIでなければできないような処理をしているわけではないので、この機に移行することを決めた。
移行先としては、パブリックリポジトリに対しては無料で使用できるGitHub Actionsにしていこうと思っている。
手始めに、先のruby-docx、そして自分がメンテしている[`rakuten_web_service`も移行を始めた](https://github.com/rakuten-ws/rws-ruby-sdk)。
