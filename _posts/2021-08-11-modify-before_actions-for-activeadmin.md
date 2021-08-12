---
title: ActiveAdminのコントローラーのbefore_actionを変更する
slug: basic-of-programming
excerpt: |
  ActiveAdminが各リソースのために生成するコントローラーのbefore_actionを追加、無効したい場合について
header:
  teaser: /assets/img/james-harrison-vpOeXr5wmR4-unsplash.jpeg
  overlay_image: /assets/img/james-harrison-vpOeXr5wmR4-unsplash.jpeg
  overlay_filter: 0.7
  caption: Photo by [James Harrison](https://unsplash.com/@jstrippa?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/programming?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
category: blog
tags:
  - Ruby
  - Rails
  - ActiveAdmin
  - Sentry
---


現在携わっているプロダクトでは、ActiveAdminを利用して管理画面を開発しています。
提供されているDSLを記述することで、リソース（モデル）ごとに管理画面に必要なコントローラー、フォームなどのビューを作成することができるので便利です。

自動的にコントローラーが生成されるのですが、それら全体に対して`before_action`などを追加したくなる場合があります。
ここではその方法について説明します。

## 前提

まず前提として、ActiveAdminが生成するコントローラーは、そのRailsアプリケーションの`ApplicationController`を継承します。
ですので、そこで定義されている`before_action`が定義されていれば、それはActiveAdminのコントローラーにも適用されることになります。

以下では、アプリケーションモニタリングサービスのSentryへ送る情報を切り替える場合を例に具体的な実装を見ていきます。

## Sentryにユーザー情報を送る

[`sentry-rails`](https://docs.sentry.io/platforms/ruby/guides/rails/)を使うと、Railsアプリケーションで例外が発生するとその例外やその時のパラメーターなどをSentryに送ることができます。
この情報に、そのときにログインしているユーザーの情報を送りたい場合があります。
以下のように`before_action`を追加すると、ログインしている場合にそのユーザーのIDとユーザー名、メールアドレスを送ることができるようになります。

```ruby
class ApplicationController < ActionController::Base
  before_action :set_sentry_context

  private

  def set_sentry_context
    Sentry.set_user(id: current_user.id, username: current_user.name, email: current_user.email) if current_user
  end
end
```

## ActiveAdminのときは管理者の情報を送る

このままだと、ActiveAdminの画面で例外が発生した場合にも、ユーザーとしてログインしていればその情報がSentryに送られてしまいます。
そこで、Sentryの設定でActiveAdminのリソースのコントローラーのみに`before_action`を追加します。

`config/initializers/active_admin.rb` に下記の1行を追加します。

```ruby
ActiveAdmin.setup do |config|
  config.before_action = :set_sentry_context_for_active_admin # Add this line
end
```

この`set_sentry_context_for_active_admin`自体は、先程と同じ`ApplicationController`に追加します。

```ruby
class ApplicationController < ActionController::Base
  before_action :set_sentry_context

  private

  def set_sentry_context
    Sentry.set_user(id: current_user.id, username: current_user.name, email: current_user.email) if current_user
  end

  def set_sentry_context_for_active_admin
    Sentry.set_user(id: current_admin_user.id, email: current_admin_user.email) if current_admin_user
  end
end
```

このままでも十分に期待した通りの動作をするのですが、`set_sentry_context`と`set_sentry_context_for_active_admin`の両方が実行されてしまいます。
もし`set_sentry_context`に他にもユーザー向けに実行するロジックがあるとすれば、副作用が起きる可能性があります。
そもそも`set_sentry_context`はActiveAdminでは不要なので、`skip_before_action`で不要な処理を実行しないように設定します。

```ruby
ActiveAdmin.setup do |config|
  config.before_action = :set_sentry_context_for_active_admin
  config.skip_before_action = :set_sentry_context
end
```
