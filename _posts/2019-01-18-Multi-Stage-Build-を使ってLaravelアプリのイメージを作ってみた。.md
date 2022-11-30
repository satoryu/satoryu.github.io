---
title: "Multi-Stage Build を使ってLaravelアプリのイメージを作ってみた。"
category: blog
tags: [Laravel,Docker]
---
<p>LaravelとVue.jsの勉強がてらにちまちまとアプリを作っていて、そのLaravelアプリケーションを実行する環境をDocker で構築しているのだけど、以下の2つほど問題があった。</p>

<ol>
<li>composer やnpm はアプリを起動させるまでに必要なパッケージのインストールやアセットの<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%D1%A5%A4%A5%EB">コンパイル</a>に必要なのであって、アプリ実行時には必要ない。特に<code>node_modules</code>。</li>
<li>Dockerファイル内でcomposer やnpm のインストールするとなると、その記述やそれぞれのバージョン管理が面倒。</li>
</ol>


<p>ということで、Docker 17.05以降で使えるようになったマルチステージビルドで解決してみた。
検索してみると、Laravel Newsに丁度いい記事を発見した。</p>

<ul>
<li><a href="https://laravel-news.com/multi-stage-docker-builds-for-laravel">Creating Multi-Stage Docker Builds for Laravel - Laravel News</a></li>
</ul>


<p>実際に書いてみたのがこちら。</p>

<ul>
<li><a href="https://github.com/satoryu/starling/pull/1/files">Build Staring app image by multi stage build by satoryu · Pull Request #1 · satoryu/starling</a></li>
</ul>


<h2>マルチステージビルド</h2>

<p>これは、異なるイメージで特定のコマンドを実行し、1つのイメージを作る方法。
例えば、以下のような<code>Dockerfile</code>があったとする。</p>

<pre class="code" data-lang="" data-unlink>FROM composer:1.8.0 as vendor    # （1）

COPY composer.json composer.json
COPY composer.lock composer.lock

RUN composer install

FROM php-cli:7.2.14

RUN mkdir /app
WORKDIR /app

COPY . /app
COPY --from=vendor /app/vendor/ /app/vendor/  # （2）

CMD [&#34;php&#34;, &#34;artisan&#34;, &#34;server&#34;]</pre>


<p>（1） で<a class="keyword" href="http://d.hatena.ne.jp/keyword/PHP">PHP</a>のパッケージをインストールするために、<code>composer:1.8.0</code> イメージを使ってインストールしている。
そこでできた成果物、つまり<code>vendor</code>以下の<a class="keyword" href="http://d.hatena.ne.jp/keyword/PHP">PHP</a>パッケージをLaravelアプリのイメージを作る際にそのまま利用する（2）。
このように、特定のコマンド（composer）の実行時に必要なイメージ（<code>composer:1.8.0</code>）を使い、そこでできたものを実際に欲しいイメージ作成時に利用することができる。</p>

<p>ということで、各ステージ毎に何をしているのかがわかりやすくなったし、最終的に作りたいイメージに必要ないものを含めずにコンパクトにできたので、だいぶスッキリした。</p>

