---
title: 問い合わせをNotion APIを使ってデータベースに保存する
excerpt: |
  問い合わせフォームから投稿された内容をそのままNotionのデータベースに投稿するように、Azure Static Web Appsで実現してみました。
category: blog
header:
  teaser: /assets/img/2021-11-21-inquiries-database-in-notion.png
  overlay_image: /assets/img/2021-11-21-inquiries-database-in-notion.png
  caption: ""
tags:
  - Notion
  - API
  - JavaScript
  - Azure Static Web Apps
  - Azure Function
---

## 動機

今年の夏に、GitHub Pagesで公開していた本サイトをAzure Static Web Appsへ引っ越ししました。
その経緯については、下記のQiitaの記事に記載しています。

{% linkpreview "https://qiita.com/sato_ryu/items/8e449ee04ded1973436b" %}

その際に、Azure Static Web AppsがAzure Functionsの仕組みを使ったAPIの開発ができるということで、問い合わせフォームを作成しました。
この問い合わせフォームに問い合わせが投稿されると、自分がプライベートで使っているSlackのチャンネルに通知が飛ぶようになっています。
ただ通知が飛ぶだけですと問い合わせへの返信をうっかり忘れてしまったり、問い合わせに関する記録を残せなかったりという課題がありました。

そこで、今年から利用し始めているNotionのデータベースに問い合わせ内容を登録し、カンバンとして管理できるようにしてみました。

## Notion API

Notionは近年スタートアップなどで使われているドキュメントサービスです。
今回の記事でも扱っているように、特徴としてデータベースという任意の属性を持った情報を登録する仕組みがあります。
RDBMSのような汎用性はありませんが、登録した情報をある属性の値で分けたり、表示方法をテーブル以外にもカレンダーやボードなど複数の見せ方ができたり、他のデータベースの値と関連付けて値を参照する、といったことができます。

NotionはAPIを持っており、インテグレーション（APIを利用するクライアントのプログラム）を作成、登録することでページまたはデータベースを操作することができるようになります。

{% linkpreview "https://developers.notion.com/" %}

## やったこと

今回は、問い合わせを下記のカンバン（データベース）で管理するために投稿フォームから与えられた内容をカンバンに登録するAPIの部分を実装しました。

[![問い合わせカンバン](/assets/img/2021-11-21-inquiries-database-in-notion.png)](/assets/img/2021-11-21-inquiries-database-in-notion.png)

実際のコードはこちらです。

- [Implement a script to save an inquiry to database in notion by satoryu · Pull Request #7 · satoryu/satoryu.com](https://github.com/satoryu/satoryu.com/pull/7)

JavaScriptで実装するためのSDKが提供されており、それを利用しています。
利用方法については、[公式ドキュメント](https://developers.notion.com/docs#step-3-add-an-item-to-a-database)を参考にしています。

Notionのデータベースへ登録している部分が下記のコードです。

```javascript
const notion = require('@notionhq/client')

const client = new notion.Client({ auth: process.env.NOTION_KEY })

exports.addInquiry = async function(parameters) { // (1)
  // (3) 必須のtitle型のプロパティを追加
  const properties = {
    'Name': {
      title: [
        {
          text: {
            content: `${parameters['会社名']} ${parameters['お名前']}`
          }
        }
      ]
    },
    'メールアドレス': {
      email: parameters['メールアドレス']
    }
  }

  // (2) データベースのプロパティを作成
  const rich_text_parameters = ["お名前", 'お名前（ふりがな）', '会社名', '問い合わせ内容']

  rich_text_parameters.forEach(key => {
      properties[key] = {
        rich_text: [
          {
            text: {
              content: parameters[key]
            }
          }
        ]
      }
    }
  )

  console.log(properties)

  await client.pages.create({
    parent: { database_id: process.env.NOTION_DATABASE_ID },
    properties
  })
}
```

プロパティの情報について、少しクセがあるので解説します。
プロパティ名をキーとして値を表すオブジェクトとのペアを渡していきます。
この値を表すオブジェクトは、プロパティの型に応じて形が変わります。
今回は、テキスト（`rich_text`）とメールアドレス（`email`）という2つの型を用いています。

```json
{
  "properties": {
    "お名前": { // プロパティ名
      "rich_text": [ // 型名
        {            // 型に応じて、値を表すオブジェクトが変わる
          "text": {
            "content": "問合 太郎"
          }
        }
      ]
    }
  }
}
```

問い合わせフォームからこのAPIに対して、jQueryを用いてJSONとして問い合わせ内容が投稿されます。
各問い合わせフォームの`input`タグの`name`属性がキー、その`value`属性（つまり投稿者が入力した内容）がその値として入っています。
それがそのまま上記の関数`addInquiry`の引数`parameters`として渡されます（`(1)`）。

与えられフォームの情報から、登録するデータベースのプロパティの値を作成していきます。
プロパティとは、データベースに登録されるページ[^1]の持つプロパティです。
今回の問い合わせフォームでは、下記の5つのプロパティがあります。

1. お名前
2. お名前（ふりがな）
3. メールアドレス
4. 会社名
5. 問い合わせ内容

メールアドレスを除き、すべてのプロパティはテキストの属性です。
その型に応じて、APIで送る際のJSONの形式が変わります（`(2)`）。

また、`title`型のプロパティが必須なので、それを最初に作成しています（`(3)`）。
この`title`型のプロパティが、登録されたページのページタイトルとして使用されます。

[^1]: Notion内では、データベースに登録される情報はレコードではなくすべてページとして扱われています。

## おわりに

今回は自分の利用しているワークスペース内のみで使うインテグレーション（internal integration）を作成しました。
OAuth認証を利用して、インテグレーションを公開することもできるようです（public integration）。
Notionと何かを連携させたり、より便利に使うことができるようなサービスの開発も可能なのだと思います。
NotionにAPIができたことで、他のツールとの連携などがやりやすくなっていきそうなので、普段使っている人たちは試しに何か作ってみると良いのではないでしょうか。

## 参考

- [Notion API](https://developers.notion.com/)
- [Getting started](https://developers.notion.com/docs)
- [Authorization](https://developers.notion.com/docs/authorization)
- [GitHub PagesからAzure Static Web Appsへ引っ越しました - Qiita](https://qiita.com/sato_ryu/items/8e449ee04ded1973436b)
