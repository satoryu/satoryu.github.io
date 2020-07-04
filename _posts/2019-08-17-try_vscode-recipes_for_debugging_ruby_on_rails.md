---
title: "VS Code Recipes  でRailsのデバッギング環境を構築してみた"
category: blog
tags: [Visual Studio Code,Rails,Ruby]
---
<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/Microsoft">Microsoft</a> が<a class="keyword" href="http://d.hatena.ne.jp/keyword/Visual%20Studio%20Code">Visual Studio Code</a>の設定のレシピを<a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a>上に公開している。
その中に、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Ruby%20on%20Rails">Ruby on Rails</a>の<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%D0%A5%C3%A5%B0">デバッグ</a>環境の構築方法があったので、試しにそれに倣って作ってみた。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fmicrosoft%2Fvscode-recipes" title="microsoft/vscode-recipes" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/microsoft/vscode-recipes">github.com</a></cite></p>

<p>やってみた中で、自分なりに置き換えた部分がありました。</p>

<h2><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%D0%A5%C3%A5%B0">デバッグ</a>で使うgemをGemfileに追加</h2>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%D0%A5%C3%A5%B0">デバッグ</a>で使用する<a href="https://rubygems.org/gems/ruby-debug-ide/"><code>ruby-debug-ide</code></a> と<a href="https://rubygems.org/gems/debase"><code>debase</code></a> を<code>Gemfile</code> に追加する。
理由としては2つある。</p>

<ol>
<li>それらのgemが<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%D0%A5%C3%A5%B0">デバッグ</a>に必須であるので、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Rails">Rails</a>アプリケーション開発に必要なものとして必要であることを明示するため。</li>
<li>あとで作成する<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%D0%A5%C3%A5%B0">デバッグ</a>の設定ファイル<code>launch.json</code> 内で、rdebug-<a class="keyword" href="http://d.hatena.ne.jp/keyword/ide">ide</a>コマンドのパスを<a class="keyword" href="http://d.hatena.ne.jp/keyword/%C0%E4%C2%D0%A5%D1%A5%B9">絶対パス</a>として指定する必要がある。そのパスを開発環境に依存させないようにしたいため。</li>
</ol>


<p>2については後に出す<code>launch.json</code> を見てください。</p>

<p>具体的には、以下のように<code>Gemfile</code>に記述する。</p>

```ruby
group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.

  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'ruby-debug-ide', require: false # <= Added
  gem 'debase', require: false # <= Added
end
```


<p><code>gem</code>の<code>require</code>オプションに<code>false</code>を指定している。これは、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Rails">Rails</a>が起動時に<code>Bundle.require</code> で依存しているgemを全て<code>require</code> で読み込むのだが、アプリケーション自体には必要無いので読み込まないようにする。
このオプションを指定しなくても<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%D0%A5%C3%A5%B0">デバッグ</a>はできるのだが、必要ないものはあえて読み込まないでおくほうが健全だと思う。</p>

<h2>launch.<a class="keyword" href="http://d.hatena.ne.jp/keyword/json">json</a></h2>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%D0%A5%C3%A5%B0">デバッグ</a>時に起動するアプリケーションや<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8">スクリプト</a>を記述するための<code>launch.json</code> ファイルも、<a href="https://github.com/microsoft/vscode-recipes/blob/master/debugging-Ruby-on-Rails/README.md#configure-vs-code-debugging-with-a-launchjson-file">vscode-recipesにサンプルが記載</a>されている。</p>

<p>サンプル中に出てくる、<code>rdebug-ide</code>や<code>bundler</code>コマンドのパスを指定するオプション<code>pathToRDebugIDE</code>と<code>pathToBundler</code> は、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%C0%E4%C2%D0%A5%D1%A5%B9">絶対パス</a>で指定する必要がある。
まず、上でGemfileに依存を記述したので、<code>bundle binstubs</code>コマンドを使って、<code>bin</code><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8">ディレクト</a>リ配下にコマンドをインストールする。</p>

<pre class="code lang-sh" data-lang="sh" data-unlink>bundle binstubs ruby-ide-debug bundler
</pre>


<p><code>launch.json</code>内では、予め用意された変数を使ってパスなどを生成することができる。
ここで、<a class="keyword" href="http://d.hatena.ne.jp/keyword/VS%20Code">VS Code</a>が開いている<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EF%A1%BC%A5%AF%A5%B9%A5%DA%A1%BC%A5%B9">ワークスペース</a>の<a class="keyword" href="http://d.hatena.ne.jp/keyword/%C0%E4%C2%D0%A5%D1%A5%B9">絶対パス</a>を表す<code>workspaceRoot</code>を使い、先程の<code>pathToRDebugIDE</code>と<code>pathToBundler</code>の値を指定する。</p>

<p>具体的には、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%D0%A5%C3%A5%B0">デバッグ</a>のために<a class="keyword" href="http://d.hatena.ne.jp/keyword/Rails">Rails</a>サーバーを起動する設定は、以下のようになる。</p>

```json
{
    "name": "Debug Rails server",
    "type": "Ruby",
    "request": "launch",
    "cwd": "${workspaceRoot}",
    "useBundler": true,
    "pathToBundler": "${workspaceRoot}/bin/bundle",
    "pathToRDebugIDE": "${workspaceRoot}/bin/rdebug-ide",
    "program": "${workspaceRoot}/bin/rails",
    "args": [
        "server",
        "-p",
        "3000"
    ]
}
```

<p>同様に他の設定についても、<code>pathToRDebugIDE</code>や<code>pathToBundler</code>の値を置き換えていく。</p>

<p>一通り置き換えてみたものがこちら。</p>

<p><a href="https://github.com/satoryu/ChatterBox/blob/master/.vscode/launch.json">https://github.com/satoryu/ChatterBox/blob/master/.vscode/launch.json</a></p>

<p>他のレシピも良さそうなので、機会があったら試してみたい。</p>

