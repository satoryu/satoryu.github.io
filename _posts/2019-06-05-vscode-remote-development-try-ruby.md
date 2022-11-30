---
title: "Visual Studio Code Remote Development のRuby環境を作ってみた。"
category: blog
tags: [Docker,Ruby,Visual Studio Code]
---
<p><a href="https://code.visualstudio.com/assets/docs/remote/containers/architecture-containers.png" class="http-image" target="_blank"><img src="https://code.visualstudio.com/assets/docs/remote/containers/architecture-containers.png" class="http-image" alt="https://code.visualstudio.com/assets/docs/remote/containers/architecture-containers.png"></a></p>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/VS%20Code">VS Code</a> の次期目玉機能であるRemote Developmentを試してみました。</p>

<h2>TL;DR</h2>

<ul>
<li><a class="keyword" href="http://d.hatena.ne.jp/keyword/Mac">Mac</a>だととりあえずContainer接続がお手軽。</li>
<li>試しに<a class="keyword" href="http://d.hatena.ne.jp/keyword/Ruby">Ruby</a>の開発環境を作ってみました。

<ul>
<li><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA">リポジトリ</a>はこちら。</li>
<li><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fsatoryu%2Fvscode-remote-try-ruby" title="satoryu/vscode-remote-try-ruby" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/satoryu/vscode-remote-try-ruby">github.com</a></cite></li>
</ul>
</li>
</ul>


<h2><a class="keyword" href="http://d.hatena.ne.jp/keyword/Visual%20Studio%20Code">Visual Studio Code</a> Remote Development って？</h2>

<ul>
<li><a href="https://code.visualstudio.com/docs/remote/remote-overview">Visual Studio Code Remote Development</a></li>
</ul>


<p>先日発表された<a class="keyword" href="http://d.hatena.ne.jp/keyword/Visual%20Studio%20Code">Visual Studio Code</a>の一押し<a class="keyword" href="http://d.hatena.ne.jp/keyword/%B3%C8%C4%A5%B5%A1%C7%BD">拡張機能</a>で、リモートにある<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%BD%A1%BC%A5%B9%A5%B3%A1%BC%A5%C9">ソースコード</a>や実行環境を利用した開発を<a class="keyword" href="http://d.hatena.ne.jp/keyword/VS%20Code">VS Code</a>上から実行できるというもの。
接続先には、</p>

<ul>
<li><a class="keyword" href="http://d.hatena.ne.jp/keyword/SSH">SSH</a></li>
<li>Container（Docker）</li>
<li>WSL</li>
</ul>


<p>があります。</p>

<p>CPUやメモリ、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%D3%A5%C7%A5%AA%A5%AB%A1%BC%A5%C9">ビデオカード</a>など特殊な環境を利用した開発環境を<a class="keyword" href="http://d.hatena.ne.jp/keyword/VM">VM</a>で作成し、そこに<a class="keyword" href="http://d.hatena.ne.jp/keyword/SSH">SSH</a>で接続したり、共通した開発環境をコンテナで揃えるなどができるので便利そうです。
チーム開発時の開発環境を共<a class="keyword" href="http://d.hatena.ne.jp/keyword/%C4%CC%B2%BD">通化</a>するのが楽になりそうで期待しています。</p>

<p>Remote Development拡張はまだ正式にはリリースされておらず、開発版の<a href="https://code.visualstudio.com/insiders/">VS Code Insiders</a>でのみ利用できます。</p>

<p>普段<a class="keyword" href="http://d.hatena.ne.jp/keyword/Mac">Mac</a>で開発しているので、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Mac">Mac</a>上でDockerコンテナ上の<a class="keyword" href="http://d.hatena.ne.jp/keyword/Ruby">Ruby</a>開発環境を利用するための設定を書いてみました<a href="#f-5a7b481c" name="fn-5a7b481c" title="SSH接続も試してみたかったのですがVMを作ったりするのが面倒でお金も掛かりそうで断念しました。">*1</a>。</p>

<h2>サンプルアプリ</h2>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/Sinatra">Sinatra</a>で簡単なウェブアプリを作りました。
<a href="http://localhost:4567">http://localhost:4567</a> にアクセスすると、"Hello, World!"が表示されるだけです。
なので、</p>

<ul>
<li>プロジェクトの依存するgemとして<code>sinatra</code>があり、</li>
<li>コンテナにポート4567で接続できる</li>
</ul>


<p>ような環境が必要になります。</p>

<h2>構成</h2>

<p>Remote Developmentで接続するコンテナについて、下記のファイルがポイントになります。</p>

<ul>
<li><code>devcontainer.json</code></li>
<li><code>Dockerfile</code></li>
</ul>


<p><a href="https://code.visualstudio.com/docs/remote/containers#_configuration-edit-loop">Remote Develop拡張のドキュメントの通りにやれば</a>、<a class="keyword" href="http://d.hatena.ne.jp/keyword/VS%20Code">VS Code</a>から<a class="keyword" href="http://d.hatena.ne.jp/keyword/Ruby">Ruby</a>で開発するためのこれらのファイルを生成してくれます。</p>

<p>ですが、</p>

<ul>
<li><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA">リポジトリ</a>内のファイルを利用したコンテナを作れない</li>
<li>bundlerを使うことを想定してない</li>
</ul>


<p>ようなものだったので、書き換えてみました。</p>

<h3><code>.devcontainer.json</code></h3>

<p>このファイルは、接続するコンテナやリモートにインストールする拡張、そしてその設定などを記述するためのファイルです。
<code>.devcontainer/devcontainer.json</code> にも配置することができるのですが、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA">リポジトリ</a>のルートに<code>.devcontainer.json</code>に置くことにしました。どうやら、<code>.devcontainer</code><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8">ディレクト</a>リ内にDockerfileなどまとめておくのも良いのですが、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA">リポジトリ</a>内のファイルなどをDockerfileでCOPYすることが出来ないようです。</p>

<p>今回は下記のような設定ファイルを書きました。</p>

```json
// See https://aka.ms/vscode-remote/devcontainer.json for format details.
{
    "name": "Ruby 2",
    "dockerFile": "Dockerfile",

    // Uncomment the next line if you want to publish any ports.
    "appPort": [
        4567
    ],

    // Uncomment the next line if you want to add in default container specific settings.json values
    "settings":  {
        "solargraph.useBundler": true,
    },

    // Uncomment the next line to run commands after the container is created.
    // "postCreateCommand": "",

    "extensions": [
        "rebornix.Ruby",
        "noku.rails-run-spec-vscode",
        "castwide.solargraph"
    ]
}
```

<ul>
<li><code>appPort</code>: サンプルで書いた<a class="keyword" href="http://d.hatena.ne.jp/keyword/Sinatra">Sinatra</a>で公開するポート</li>
<li><code>settings</code>: リモートにインストールする<a class="keyword" href="http://d.hatena.ne.jp/keyword/VS%20Code">VS Code</a>の拡張の設定。今回はSolargraphを起動する時に<code>bundle exec</code>を利用するための設定を追加しています。</li>
<li><code>extensions</code>: リモートにインストールする拡張。</li>
</ul>


<p>リモートでインストールできる拡張には制限があるようで、UIやThemeなどに関する拡張はインストールできません。</p>

<h2><code>Dockerfile</code></h2>

<p>Remote Development拡張が生成するDockerfileには、bundlerやGemfileに関する扱いが記述されていません。
ここでは、bundlerで依存管理をする開発環境を想定して、Dockerfileに</p>

<ul>
<li>GemfileおよびGemfile.lockをCOPY</li>
<li>bundle install を実行して、依存しているgemをインストール</li>
</ul>


<p>させ、依存するgemをコンテナのレイヤーとして入れています。</p>

<p>先程の<code>.devcontainer.json</code> の<code>postCreateCommand</code>に<code>bundle install</code>を指定することで、コンテナ生成後に<code>bundle install</code>を実行することができます。
ですが、この方法だと依存関係が変わっていなくても、コンテナを再構築やプロジェクトを<a class="keyword" href="http://d.hatena.ne.jp/keyword/VS%20Code">VS Code</a>で開くたびにgemのインストールが実行されてしまいます。</p>

```dockerfile
FROM ruby:2.6.3

# Install ruby-debug-ide and debase
RUN gem install ruby-debug-ide
RUN gem install debase

# To install the latest version of bundler
RUN gem install bundler:2.0.1

COPY Gemfile /root/
COPY Gemfile.lock /root/
RUN cd /root/ && bundle install

# Install git, process tools
RUN apt-get update && apt-get -y install git procps

# Clean up
RUN apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Set the default shell to bash instead of sh
ENV SHELL /bin/bash
```

<h3>gemのコマンドを実行するには</h3>

<p>例えば、<a href="https://marketplace.visualstudio.com/items?itemName=castwide.solargraph">Ruby Solargraph</a>のように、gemが提供するコマンドを実行する拡張を使う場合、以下の2通りある。</p>

<ol>
<li><a class="keyword" href="http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4">環境変数</a>PATHに、<code>/usr/local/bundle/bin</code>を追加</li>
<li><code>Gemfile</code> にgemの依存を記述し、<code>bundle exec</code>でコマンドを実行する</li>
</ol>


<p>今回は1ではなく2の方式で作成してみた。
開発の用途も含めて、プロジェクトで利用するgemはGemfileに記述しておくことで明示的になるし、セットアップの手順も<code>bundle install</code>にまとめられるので、個人的にはこの方式が望ましいと思っています。</p>

<h2>おわりに</h2>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/VS%20Code">VS Code</a> Remote Developmentの<a class="keyword" href="http://d.hatena.ne.jp/keyword/Ruby">Ruby</a>コンテナを使った簡単な開発環境を作ってみました。
これまでもDockerを使って環境を揃えるなどはやったことはありますが、<code>docker exec</code>を使ってコマンドを実行するといった煩わしさがありました。
Remote DevelopmentでTerminalを開くとコンテナ内に入った状態から始まるので、スムーズに作業ができるのが嬉しいですね。
そういった環境をコンテナで整備できるので、Remote Development拡張をインストールした<a class="keyword" href="http://d.hatena.ne.jp/keyword/VS%20Code">VS Code</a>があればすぐに開発が始められそうなので、重宝しそうです。</p>

<p>はやく正式リリースされないかなー</p>

<h2>参考</h2>

<ul>
<li><a href="https://code.visualstudio.com/docs/remote/containers">Developing inside a Container using Visual Studio Code Remote Development</a></li>
<li><a href="https://github.com/microsoft/vscode-remote-try-node">microsoft/vscode-remote-try-node: Node.js sample project for trying out the VS Code Remote - Containers extension</a></li>
</ul>

<div class="footnote">
<p class="footnote"><a href="#fn-5a7b481c" name="f-5a7b481c" class="footnote-number">*1</a><span class="footnote-delimiter">:</span><span class="footnote-text"><a class="keyword" href="http://d.hatena.ne.jp/keyword/SSH">SSH</a>接続も試してみたかったのですが<a class="keyword" href="http://d.hatena.ne.jp/keyword/VM">VM</a>を作ったりするのが面倒でお金も掛かりそうで断念しました。</span></p>
</div>
