---
title: GitHub ActionsからGitHub Pagesへのデプロイが便利
excerpt: |
  GitHub PagesへGitHub Actionsからデプロイできるようになっていて、以前に課題と思っていたことが解決されたので、個人のプロフィールサイトを移行しました。
  この記事では、その課題や実際に作成したGitHub Actionsのワークフローについて書いています。
category: blog
tags:
  - GitHub Pages
  - GitHub Actions
  - Jekyll
---

昨年に個人のプロフィールサイトをAzure Static Web Appsへ移行していた。

{% linkpreview "https://qiita.com/sato_ryu/items/8e449ee04ded1973436b" %}

そのときは、下記の3つの課題を解決するために移行をした。

> 1. Jekyllプラグインのうち一部しか使うことが出来ない
> 2. pull requestを送ってもプレビューが見れない
> 3. サーバーサイドで何か処理をしたくなった場合、別途自前で用意しなければならない

その当時はこれらが課題だと思っていたので、それを解決するために移行していたのだけど、実際に運用してみると違っているとわかったのでGitHub Pagesに戻した。
1つ目の課題は、このあと書くようにGitHub Actionsを利用したデプロイができるようになったので解決した。
2つ目の課題はそもそも想像上のことでしかなかった。プレビューのサイトをわざわざクラウド上に構築するのは、個人のサイトとしてはやり過ぎだった。
特に静的なコンテンツを配信する場合、ローカルで確認していることと、クラウド上にデプロイしたものとの差異が出る要因はほぼ無いので、ローカルで確認すれば良い。
3つ目のは今の所必要が無いと判断した。Static Web Appsで問い合わせフォームを作成していたのだが、利用されることが無かった[^1]。

[^1]: まったく問い合わせが無かった訳ではなく、問い合わせフォームからではなくメールやSNSから連絡が来ることがほとんどだった。念の為フォロー。

GitHub Pagesに戻すことを決断できたのは、GitHub Actionsからデプロイすることができるようになっていたためだ。
クラスメソッドさんの記事によると、どうやら今年の夏ころにBeta版として公開されている機能のようだ。

- [GitHub Pages のデプロイに Custom GitHub Actions Workflows を使用することで、ビルドの成果物の commit が不要になりました \| DevelopersIO](https://dev.classmethod.jp/articles/github-pages-by-actions/)

## GitHub Actionsのワークフローを書く

実際に、このプロフィールサイトをビルドして、デプロイするためのワークフローが下記のYAML。

```yaml
on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'
      - run: bundle install
      - run: bundle exec jekyll build
      - uses: actions/upload-pages-artifact@v1

  deploy:
    if: github.event_name == 'push'
    needs: build

    permissions:
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: https://www.satoryu.com

    runs-on: ubuntu-latest

    steps:
      - uses: actions/deploy-pages@v1
```

GitHub PagesへデプロイするためのActionsが公開されており、それらを利用してすぐに作成できた。
以下、簡単に各ジョブを説明する。

`build`ジョブで`jekyll`コマンドからコンテンツを生成し、`actions/upload-pages-artifact`で生成したコンテンツをartifactとしてアップロードしている。

`deploy`ジョブでは、そのアップロードされたartifactを利用し、GitHub Pagesへデプロイをしている。
`deploy`ジョブの`if`では、デプロイを実行するのは`main`ブランチへpushしたときのみになるようにしている。
`on.push.branches`でこのワークフローが起動するブランチが指定されているので、この条件式ではトリガーになったイベントが`push`であることだけを指定している。
`permissions`では、このジョブ内で利用されるGitHub Tokenに与えられる権限を指定している。
`environment`で、この`deploy`ジョブに対する制約を与えている。別途、`github-pages`という`environment`を作成し、そこで`main`ブランチでのみこのジョブが実行されないようになっている。
なので、うっかりこのワークフローで`main`ブランチ以外で`deploy`ジョブが実行されないようにはなっている。
