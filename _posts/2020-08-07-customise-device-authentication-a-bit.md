---
title: Deviceの認証の後処理を実装する方法
date: 2020-08-07
excerpt: Railsに認証機能を提供するDeviceの認証の後処理を実装する方法について
toc: true
category: blog
header:
  og_image: https://raw.github.com/heartcombo/devise/master/devise.png
  overlay_image: https://raw.github.com/heartcombo/devise/master/devise.png
  overlay_filter: rgba(35, 35, 35, 0.5)
tags:
  - Device
  - Ruby
  - Rails
---

Railsに認証機能を提供するライブラリであるDeviceを利用している時に、認証の処理の前後に何か独自の処理を挟み込みたいときがあります。
例えば、

- ログインしたユーザーが初回のログインだった場合にメール通知したり
- ログインしたユーザーがBanされていた場合にはその旨を画面に表示する

といった場合があると思います。
それぞれは

1. 認証後のタイミングを利用した場合
2. 認証後の処理に応じてレスポンスを変えたい場合

です。

Deviseは認証処理を独自の認証にするなど拡張できるように作られています。
それを利用して、上記2つを実装することができます。
最近、これらを実装する機会があったので、ここではそれぞれでやってみた実装方法を書きます。

## 前提

この後に紹介する方法は、Deviseの認証を拡張できるように準備できていることが前提となっています。
拡張する方法については、[README](https://github.com/heartcombo/devise#configuring-controllers)に記載されているので、そちらを参考に進めていきます。

- [heartcombo/devise: Flexible authentication solution for Rails with Warden.](https://github.com/heartcombo/devise#configuring-controllers)

### 認証用コントローラーの作成

`rails`の`generator`コマンドを使って認証用のコントローラーを作成します。

```sh
rails generate devise:controllers users -c=sessions
```

これにより、`app/controllers/users/sessions_controller.rb`が作成されます。
このファイルを見ると、`Devise::SessionsController`を継承した`Users::SessionsController`が
`Devise::SessionsController`は、Deviseがデフォルトで提供している認証処理を実装しています。
それを継承しているので、それらの処理をそのまま利用して、独自の処理を追加することができます。

### ルーティングの設定

続いて、ここで作成したコントローラーを使うように、Deviseのルーティングで設定します。
`config/routes.rb`に以下のように記述します。

```ruby
devise_for :users,
  controllers: {
    sessions: 'users/sessions' # <= 上で作成したコントローラを使うことを指定
  }
```

ここまでで認証をカスタマイズする準備が完了です。

## 認証後のタイミングを取って処理をしたい場合

これはとても容易で、`after_action`を利用することで実現できます。

```ruby
class Users::SessionsController < Devise::SessionsController
  after_action :something_process, only: :create

  private

  def something_process
    # Do something
  end
end
```

注意すべき点は、

1. `after_action`で登録された処理は、指定されたアクションが正常に終了した場合にのみ呼ばれること
2. `render`や`redirect_to`を使用しても変わらない

ということです。

### 単純に親クラスのメソッド（アクション）を実行する

これもシンプルで理解しやすい実装です。

```ruby
class Users::SessionsController < Devise::SessionsController
  def create
    super

    do_something
  end
end
```

ここでうっかり`render`などを使用してしまうと、`DoubleRenderError`が発生します。
これは、`Devise::SessionsController#create`が内部で`render`を実行しているためです。
もしレスポンスを変えたい場合は、この後に紹介する方法を取る必要があります。

## 認証後の処理に応じてレスポンスを変えたい場合

### `after_sign_in_path_for`を利用する

`after_sign_in_path_for`をオーバーライドすることで、認証後に遷移するパスを指定することができる。
引数の`resource`には、認証の対象となるモデル（例えば`User`）のオブジェクトが渡される。

例えば、banされたユーザーの場合に別の画面へ遷移させたい場合、以下のように記述できる。
継承しているので、通常の場合の遷移先は`super`で取得することができる。

```ruby
class Users::SessionsController < Devise::SessionsController
  def after_sign_in_path_for(user)
    user.banned? ? something_for_banned_user_path : super
  end
end
```

この例で、更にbanされたユーザーに対して何か処理をしたい場合、このオーバーライドしたメソッドに記述することも可能です。
ですが、メソッド名からその処理を察するのが難しいため、読みやすいコードでは無くなると思います。

### ブロックを利用する

Deviseのソースコードを見ていくと、`Devise::SessionsController`のアクションそれぞれが[内部で`yield`を使用している](https://github.com/heartcombo/devise/blob/master/app/controllers/devise/sessions_controller.rb)ことがわかります。
そこで、これを利用して認証後の処理を追加します。

例えば、banされたユーザーと認証後にわかった場合、強制的にサインアウトし、エラーページを表示したい場合、いかのように記述することができます。

```ruby
class Users::SessionsController < Devise::SessionsController
  def create
    super do |user|
      if user.banned?
        sign_out user
        render 'banned_error_page'
        break
      end
    end
  end
end
```

ここで重要なのは、`break`を呼ぶことで、呼び出し元の`yield`を中断させることです。
`Devise::SessionsController#create`は、渡されたブロックを実行した後に、`render`（正確には`respond_with`を使用）してレスポンスを生成しています。
それより手前に、リダイレクト先などを指定し、`break`により中断することで`DoubleRenderError`を防いでいます。

## おわりに

最近、Deviseをちょっとしたカスタマイズをしたくなることがあって、用途に合わせて試してみたものをまとめました。

似たようなことでも、実装手段が複数取れるように作られているのが良いですね。
