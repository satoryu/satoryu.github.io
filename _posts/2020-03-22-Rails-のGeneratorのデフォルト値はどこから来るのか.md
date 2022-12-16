---
title: "Rails のGeneratorのデフォルト値はどこから来るのか"
category: blog
tags: [Rails,Ruby,Code Reading]
toc: true
---


## ことの発端

RailsのController generatorで不要なroutingが書き込まれてしまうので、毎度`--skip-routes` オプションを付けるようにしている。
けれど、オプションを付け忘れることもあって、面倒なことになることがよくあった。
調べてみると、 `config/application.rb` などで`config.generators` を以下のように指定することでデフォルトのオプションとして指定できることがわかった。

```ruby
config.generators do |g|
  g.skip_routes = true
end
```

- [Add a '--skip-routes' flag for the Controller generator. · rails/rails@4b173b8](https://github.com/rails/rails/commit/4b173b8ed90cb409c1cdfb922914b41b5e212cb6)

該当の変更だけを見ても、仕組みが理解できなかったので調べてみた。

## TL;DR

controller generatorにオプションの渡し方は、以下の3通り。

1. `config.generators.controller = { skip_routes: true }`
2. `config.generators.rails = { skip_routes: true }`
3. `config.generators.skip_routes = true`

個別のgeneratorのためのオプションとして最優先されるのは1の設定の仕方。
2と3は同等の扱いで、他のgeneratorとも共有される。

## 探求編

コードを読んでいく方針として次の順で行った。

1. 参照側: `ControllerGenerator` の`options[:skip_routes]` はどこを見ているのか
2. 設定側: `Rails::Application.config.generators` に指定した値はどこに入るのか
3. 上記2つはどこでつながるのか

### 参照側

```ruby
module Rails
  module Generators
    class ControllerGenerator < NamedBase # :nodoc:
      argument :actions, type: :array, default: [], banner: "action action"
      class_option :skip_routes, type: :boolean, desc: "Don't add routes to config/routes.rb."
     #
     # 中略
     #
      def add_routes
        return if options[:skip_routes]
        return if actions.empty?
        routing_code = actions.map { |action| "get '#{file_name}/#{action}'" }.join("\n")
        route routing_code, namespace: regular_class_path
      end
```

`add_routes` メソッド内で、`options[:skip_routes]` を見ているので、`options` がどこから来るのかを探る。
`ControllerGenerator` 自身は持っていないので、継承している`NamedBase`を見てみるがこれも`options`を持っていない。更に上位クラスの`Rails::Generators::Base`を見ると、これが`Thor::Group` を継承していることがわかる。
RailsのgeneratorなどCLIは、CLIを作成するDSLを提供するthorを使用している。
Thorのドキュメントを見ると、`Thor::Group` がincludeしている[モジュール`Thor::Base` に`options`メソッドが存在している](https://rubydoc.info/github/wycats/thor/master/Thor%2FBase:options)ことがわかる。

`ControllerGenerator`のコードを再度見ていくと、`skip_routes`オプションを`class_option` で定義している。
これもまたthorに存在するメソッドである。しかし、デフォルト値を指定するための`default`をキーに持つハッシュが引数に渡されていない。
`Rails::Generators::Base` を見ると、[`class_option` メソッドをオーバーライドしている箇所](https://github.com/rails/rails/blob/157920aead96865e3135f496c09ace607d5620dc/railties/lib/rails/generators/base.rb#L207-L212)がある。

```ruby
      def self.class_option(name, options = {}) #:nodoc:
        options[:desc]    = "Indicates when to generate #{name.to_s.humanize.downcase}" unless options.key?(:desc)
        options[:aliases] = default_aliases_for_option(name, options)
        options[:default] = default_value_for_option(name, options)
        super(name, options)
      end
```

これは、`Thor::Base.class_option`を`super`で呼ぶ前に、デフォルト値を設定している。
[`default_value_for_option`](https://github.com/rails/rails/blob/157920aead96865e3135f496c09ace607d5620dc/railties/lib/rails/generators/base.rb#L344-L346)は以下のようになっている。

```ruby
        def self.default_value_for_option(name, options) # :doc:
          default_for_option(Rails::Generators.options, name, options, options[:default])
        end
```

さらに[`default_for_option`](https://github.com/rails/rails/blob/157920aead96865e3135f496c09ace607d5620dc/railties/lib/rails/generators/base.rb#L354-L365)を呼び出している。

```ruby
        def self.default_for_option(config, name, options, default) # :doc:
          if generator_name && (c = config[generator_name.to_sym]) && c.key?(name)
            c[name]
          elsif base_name && (c = config[base_name.to_sym]) && c.key?(name)
            c[name]
          elsif config[:rails].key?(name)
            config[:rails][name]
          else
            default
          end
        end
```

これは以下のようにデフォルト値を決めている。

1. `config`（ここだと`Rails::Generators.options`）の中にgenerator名（ここだと`controller`）をキーとして持っていて、なおかつその値がハッシュで`name`（ここだと`skip_routes`）をキーとして持っていると、その値をデフォルト値とする
2. `config` の中にbase_name（ここだと`rails`）をキーとして持っていて、なおかつその値がハッシュで`name`をキーとして持っていると、その値をデフォルト値とする
3. `config`の中にシンボル`rails`をキーとして持っていて、なおかつその値がハッシュでありそのハッシュが`name`をキーとして持っている場合、その値をデフォルト値とする
4. 以上のどれにも当てはまらない場合、引数の`default`をデフォルト値とする

つまり、`Rails::Generators.options` がどのようになっているのかで決まる。
この順番で先に見つかった値が使われる。

## 設定編

Rails Guideに、[Generatorの設定についての記述](https://guides.rubyonrails.org/configuring.html#configuring-generators)があり、そこに下記のサンプルコードがある。

```ruby
config.generators do |g|
  g.orm :active_record
  g.test_framework :test_unit
end
```

[`Rails::Engine::Configuration#generators`](https://github.com/rails/rails/blob/157920aead96865e3135f496c09ace607d5620dc/railties/lib/rails/engine/configuration.rb#L32-L36)を見ると、

```ruby
      def generators
        @generators ||= Rails::Configuration::Generators.new
        yield(@generators) if block_given?
        @generators
      end
```

`Rails::Configuration::Generators`をブロックに渡している。
`Rails::Configuration::Generators` は[`method_missing` が定義されて](https://github.com/rails/rails/blob/157920aead96865e3135f496c09ace607d5620dc/railties/lib/rails/configuration.rb#L110-L128)いて、任意の名前で設定値を与えることができる。
下記のように4通りの記述が可能である。

1. `config.generators.controller = { skip_routes: true }`
2. `config.generators.controller skip_routes: true`
3. `config.generators.rails = { skip_routes: true }`
4. `config.generators.skip_routes = true`

1、2は同じ扱いで、controller generator固有のオプションを設定している。
3、4もまた同じ扱いで、controller generatorのオプションのデフォルト値だけでなく他のgeneratorからも参照される可能性がある。
「可能性がある」というのは、先述のようにgenerator固有の設定（つまり上の1、2で指定された値）を優先するためである。

## どこでつながるのか

これで一件落着のように感じるが、[`Rails::Generators.options`](https://github.com/rails/rails/blob/157920aead96865e3135f496c09ace607d5620dc/railties/lib/rails/generators.rb#L94-L96)の中を見ると、以下のように`DEFAULT_OPTIONS`にあるハッシュを返しているだけである。

```ruby
      def options #:nodoc:
        @options ||= DEFAULT_OPTIONS.dup
      end
```

`rails generator`コマンド実行時に`Rails::Configuration::Generators` に設定された内容を`Rails::Generators.options` に入れている。

次に[`Generator`コマンドの実行時の実装](https://github.com/rails/rails/blob/c0d91a4f9da10094ccdb80e34d1be42ce1016c9a/railties/lib/rails/commands/generate/generate_command.rb#L22)を見てみる。
この中の`load_generators` は`Rails.application.load_generators`を呼んでいるだけのメソッドである。
`Rails.application.load_generators` の実体は`Rails::Engine#load_generators` で、この中で下記を実行している。

```ruby
Rails::Generators.configure!(app.config.generators)
```

引数の`app.config.generators` は、設定編で解説した設定で生成した`Rails::Generators`オブジェクトである。
[レシーバーの`configure!`](https://github.com/rails/rails/blob/c0d91a4f9da10094ccdb80e34d1be42ce1016c9a/railties/lib/rails/generators.rb#L73-L82)の中で、`Rails::Generators.options`の値に、`Rails::Configuration::Generators.options`の値を`merge`している。

ということで、このように設定した値がController Generatorから参照されていることがわかった。
Generatorを自分で作成する必要がありそのGenerator固有のオプションを持つ場合、そのオプションのデフォルト値は`config.generators.my_generator = { my_option: 'foobar' }` といったように作成したgenerator名に値を与えることで設定できる。
