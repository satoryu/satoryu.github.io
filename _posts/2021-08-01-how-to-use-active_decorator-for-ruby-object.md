---
title: ActiveDecoratorをActiveRecord以外のRubyオブジェクトで使う
slug: how-to-use-active_decorator-for-ruby-object
header:
  teaser: https://cdn-ak.f.st-hatena.com/images/fotolife/s/satoryu/20200429/20200429164857.jpg
category: blog
tags:
  - Ruby
  - Rails
  - Rubygem
  - ActiveDecorator
---

現在開発しているあるプロジェクトで[ActiveDecorator](https://github.com/amatsuda/active_decorator)を利用しています。
普段はActiveRecordを継承しているモデルに対してViewで利用するためのメソッドを拡張するために使っているのですが、それ以外の、例えばActiveModelやStructなど任意のモデルに対して使いたいケースが出てきました。
そこで、そういった場合に使えるのか調査したので、それをまとめておこうと思います。

ここで調査した対象は、[ActiveDecorator v1.4.0](https://github.com/amatsuda/active_decorator/tree/v1.4.0)です。
{: .notice--warning}

基本的な使い方については、[README](https://github.com/amatsuda/active_decorator/blob/v1.4.0/README.md)を御覧ください。

## TL; DR

結果から言うと、**任意のRubyオブジェクトに対して使えます**。

- コントローラー内で定義されたインスタンス変数
- ビュー内でpartial renderで呼び出したときの`locals`
- 既にDecoratorが差し込まれたモデルのリレーション

上記のタイミングでDecoratorが差し込まれるようになっています。

## Decoratorの対象はどう決まるのか

あるモデルに対してどのようにDecoratorが差し込まれるのかは、[`ActiveDecorator::Decorator#decorate`](https://github.com/amatsuda/active_decorator/blob/1faa5c77a578febd0afddb96cd2deef4bb5b4a7e/lib/active_decorator/decorator.rb#L25-L61)で定義されています。
このメソッドに渡される引数`obj`がどのようなものなのかによってDecoratorの差し込み方が変わります。

### ArrayまたはHashの場合

`obj`の値それぞれのオブジェクトに対して、再帰的に`decorate`メソッドを呼び出し、Decoratorを差し込んでいきます。

### ActiveRecordのリレーションの場合

例えば`Post`モデルが`has_many :comments`のようにリレーションを持っている時に`post.comments`が引数`obj`として渡された場合、
その結果の`Comment`オブジェクトにそれぞれに対してDecoratorが差し込まれます。

### ActiveRecord::Baseを継承したオブジェクトの場合

つまり一般的に`rails generator model`で生成されるようなモデルの場合、そのオブジェクトに対してDecoratorが差し込まれます。

### それ以外のオブジェクトの場合

もちろん、この場合にも上記のActiveRecord::Baseを継承している場合と同様にDecoratorが差し込まれます。

## 差し込むDecoratorはどう選ばれるか

[`ActiveDecorator::Decorator#decorator_for](https://github.com/amatsuda/active_decorator/blob/1faa5c77a578febd0afddb96cd2deef4bb5b4a7e/lib/active_decorator/decorator.rb#L72-L92)は、クラス（Classオブジェクト）を引数として渡すと、それに対応するDecoratorを返すプライベートメソッドです。

渡したクラスの名前の末尾に`Decorator`が付与された名前のモジュールがあれば、それが差し込むデコレーターとして返されます。
例えば、`Post`クラスであれば`PostDecorator`、ネームスペースが付いている`Blog::Post`クラスであれば`Blog::PostDecorator`となります。
この末尾についている`Decorator`を別の文字列に置き換えたい場合は、[README](https://github.com/amatsuda/active_decorator#configuring-the-decorator-suffix)に記載があるように、initializerなどで`config.decorator_suffix = 'Presenter'`のように設定することで変更できます。

## Decoratorはどのタイミングで差し込まれるのか

前述のように、`ActiveDecorator::Decorator#decorate`によって配列なりハッシュなりリレーションであろうとそれらの要素それぞれに対して命名規則に従って選ばれたDecoratorが存在すれば差し込まれることがわかりました。

次に、この`decorate`メソッドを呼び出すタイミングを確認していきます。
それが[`ActiveDecorator::Railtie`](https://github.com/amatsuda/active_decorator/blob/v1.4.0/lib/active_decorator/railtie.rb)で定義されています。
この`Railstie`で定義される`initializer`内で、ActionViewやActionController、ActionMailなどに`decorate`メソッドを呼び出すように特定のメソッドを書き換えています[^1]。

### ビュー内（ActionView）での`partial render`

ビューのテンプレート内で実行する`render partial:`で渡した`locals`の変数それぞれに対して`decorate`が実行されます。

### コントローラー（ActionController）で（暗黙的なものも含めて）呼ばれる`render`

コントローラーのアクション内で定義されたインスタンス変数に対して`decorate`が呼び出されます。
明示的に`render`しなくとも、暗黙的に実行される`render`のタイミングで呼ばれるようです。
なので、ビュー内で利用できるインスタンス変数は既にDecoratorが差し込まれていることになります。

### ActionMailerの`render`

これはActionControllerと同様です。

### ActiveRecordのリレーション

上述までのとおりに、リレーション自体がpartial renderの`locals`に渡した場合、それらの要素それぞれにDecoratorが差し込まれます。
先に出た例の場合、コントローラー内で`@post = Post.find(params[:id])`と実行されると、`@post`にはDecoratorが差し込まれます。
そして、ビュー内で`@post.comments` を実行すると、そのそれぞれの`Comment`オブジェクトにもまたDecoratorが差し込まれます。
というようになるように、 `initializer`の中で`ActiveRecord::Associations`などのメソッドが書き換えられています。

[^1]: 直接書き換えているのではなく、対象のモジュールなどに既存のメソッドを上書きするモジュールを`prepend`で追加しています。
