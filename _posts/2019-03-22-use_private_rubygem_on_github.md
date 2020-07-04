---
title: "プライベートリポジトリで提供しているgemを使ったアプリをHerokuにデプロイする。"
category: blog
tags: [Ruby,Rubygem,Heroku]
---
<p>何らかの理由で外部に公開はできないgemがあって、それを使った<a class="keyword" href="http://d.hatena.ne.jp/keyword/Ruby">Ruby</a>アプリケーションをデプロイする場合にどうしたらいいのか調べてみた。</p>

<p>何らかの理由というのは、まだ開発途中で試験的に使ってみたいとか、ビジネスに特化した機能であって外に公開できないなど、いくつかあると思う。複数の<a class="keyword" href="http://d.hatena.ne.jp/keyword/Ruby">Ruby</a>アプリケーションを扱っている会社なんかだと、共通する機能をgemにしたりするだろうから、ありえるシナリオだと思う。</p>

<h2 id="もくじ">もくじ</h2>

<ul class="table-of-contents">
    <li><a href="#もくじ">もくじ</a></li>
    <li><a href="#TLDR">TL;DR</a></li>
    <li><a href="#Gitリポジトリで公開されているgemを使う">Gitリポジトリで公開されているgemを使う</a></li>
    <li><a href="#プライベートリポジトリで公開されているgemを使おうとするとどうなるか">プライベートリポジトリで公開されているgemを使おうとするとどうなるか</a></li>
    <li><a href="#プライベートリポジトリのgemを使うための設定">プライベートリポジトリのgemを使うための設定</a><ul>
            <li><a href="#GitHubのパーソナルアクセストークンを発行">GitHubのパーソナルアクセストークンを発行</a></li>
            <li><a href="#ローカル環境での設定">ローカル環境での設定</a><ul>
                    <li><a href="#ホスト単位">ホスト単位</a></li>
                    <li><a href="#リポジトリ単位">リポジトリ単位</a></li>
                </ul>
            </li>
            <li><a href="#デプロイ先の実行環境">デプロイ先の実行環境</a></li>
        </ul>
    </li>
    <li><a href="#おまけ">おまけ</a></li>
</ul>

<h2 id="TLDR">TL;DR</h2>

<ul>
<li><a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a>のプライベー<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8">トリポジ</a>トリにアクセスできるパーソナルアクセス<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF">トーク</a>ンを発行</li>
<li>ローカル環境では、<code>bundle config github.com *********:x-oauth-basic</code>（<code>*********</code>はパーソナルアクセス<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF">トーク</a>ン） でクレデンシャルを設定</li>
<li>デプロイ先の実行環境では、<code>export BUNDLE_GITHUB__COM=*********:x-oauth-basic</code> などで<a class="keyword" href="http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4">環境変数</a>でクレデンシャルを設定</li>
</ul>


<h2 id="Gitリポジトリで公開されているgemを使う">Git<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA">リポジトリ</a>で公開されているgemを使う</h2>

<p>bunlderでは、<a class="keyword" href="http://d.hatena.ne.jp/keyword/rubygems">rubygems</a>.org やパッケージ管理サービスで配布しているものだけでなく、gitや<a class="keyword" href="http://d.hatena.ne.jp/keyword/github">github</a>上のgit<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA">リポジトリ</a>で公開されているgemも使用することができる。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fqiita.com%2Fnysalor%2Fitems%2Fbcc07679f207b0e6e7a5" title="privateリポジトリに置いたgemをGemfileに含める - Qiita" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://qiita.com/nysalor/items/bcc07679f207b0e6e7a5">qiita.com</a></cite>
<a href="https://bundler.io/v2.0/guides/git.html">Bundler: How to install gems from git repositories</a></p>

<p><code>Gemfile</code>内で、<code>gem</code>に<code>git</code>オプションを付けることで</p>

<pre class="code lang-ruby" data-lang="ruby" data-unlink>source <span class="synSpecial">&quot;</span><span class="synConstant">https://rubygems.org</span><span class="synSpecial">&quot;</span>

git_source(<span class="synConstant">:github</span>) {|<span class="synIdentifier">repo_name</span>| <span class="synSpecial">&quot;</span><span class="synConstant">https://github.com/</span><span class="synSpecial">#{</span>repo_name<span class="synSpecial">}&quot;</span> }

<span class="synComment"># gem &quot;rails&quot;</span>

gem <span class="synSpecial">'</span><span class="synConstant">sample_private_gem</span><span class="synSpecial">'</span>, <span class="synConstant">git</span>: <span class="synSpecial">'</span><span class="synConstant">https://github.com/satoryu/sample_private_gem.git</span><span class="synSpecial">'</span>
gem <span class="synSpecial">&quot;</span><span class="synConstant">rack</span><span class="synSpecial">&quot;</span>, <span class="synSpecial">&quot;</span><span class="synConstant">~&gt; 2.0</span><span class="synSpecial">&quot;</span>
</pre>


<h2 id="プライベートリポジトリで公開されているgemを使おうとするとどうなるか">プライベー<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8">トリポジ</a>トリで公開されているgemを使おうとするとどうなるか</h2>

<p>ここで登録されている<code>sample_private_gem</code>が<a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a>上のプライベー<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8">トリポジ</a>トリで公開されている場合、デプロイすると何が起こるのか。</p>

<p>試しに、Heroku上にデプロイしてみると、途中で該当のgemを取得できずにデプロイが失敗する。</p>

<pre class="code lang-sh" data-lang="sh" data-unlink>$ git push heroku master
Enumerating objects: <span class="synConstant">7</span>, done.
Counting objects: <span class="synConstant">100</span>% <span class="synPreProc">(</span><span class="synConstant">7</span><span class="synSpecial">/</span><span class="synConstant">7</span><span class="synPreProc">)</span>, done.
Delta compression using up to <span class="synConstant">4</span> threads
Compressing objects: <span class="synConstant">100</span>% <span class="synPreProc">(</span><span class="synConstant">4</span><span class="synSpecial">/</span><span class="synConstant">4</span><span class="synPreProc">)</span>, done.
Writing objects: <span class="synConstant">100</span>% <span class="synPreProc">(</span><span class="synConstant">4</span><span class="synSpecial">/</span><span class="synConstant">4</span><span class="synPreProc">)</span>, <span class="synConstant">699</span> bytes | 699.00 KiB/s, done.
Total <span class="synConstant">4</span> <span class="synPreProc">(</span><span class="synSpecial">delta </span><span class="synConstant">0</span><span class="synPreProc">)</span>, reused <span class="synConstant">0</span> <span class="synPreProc">(</span><span class="synSpecial">delta </span><span class="synConstant">0</span><span class="synPreProc">)</span>
remote: Compressing <span class="synStatement">source</span> files... done.
remote: Building <span class="synStatement">source</span>:
remote:
remote: <span class="synSpecial">-----&gt;</span> Ruby app detected
remote: <span class="synSpecial">-----&gt;</span> Compiling Ruby/Rack
remote: <span class="synSpecial">-----&gt;</span> Using Ruby version: ruby-2.5.3
remote: <span class="synSpecial">-----&gt;</span> Installing dependencies using bundler 2.0.1
remote:        Running: bundle install <span class="synSpecial">--without</span> development:<span class="synStatement">test</span> <span class="synSpecial">--path</span> vendor/bundle <span class="synSpecial">--binstubs</span> vendor/bundle/bin <span class="synSpecial">-j4</span> <span class="synSpecial">--deployment</span>
remote:        Fetching gem metadata from https://rubygems.org/..............
remote:        Fetching https://github.com/satoryu/sample_private_gem.git
remote:        fatal: could not <span class="synStatement">read</span> Username <span class="synStatement">for</span> <span class="synStatement">'</span><span class="synConstant">https://github.com</span><span class="synStatement">'</span>: No such device or address
remote:
remote:        Retrying <span class="synSpecial">`git clone </span><span class="synStatement">'</span><span class="synConstant">https://github.com/satoryu/sample_private_gem.git</span><span class="synStatement">'</span><span class="synSpecial"> </span><span class="synStatement">&quot;</span><span class="synConstant">/tmp/build_0902676fab2649d6da106b713a8423d7/vendor/bundle/ruby/2.5.0/cache/bundler/git/sample_private_gem-b3cd9b512dc81bc540e01f090efba0b37ff88c98</span><span class="synStatement">&quot;</span><span class="synSpecial"> --bare --no-hardlinks --quiet`</span> due to error <span class="synPreProc">(</span><span class="synConstant">2</span>/<span class="synConstant">4</span><span class="synPreProc">)</span>: Bundler::Source::Git::GitCommandError Git error: <span class="synStatement">command</span> <span class="synSpecial">`git clone </span><span class="synStatement">'</span><span class="synConstant">https://github.com/satoryu/sample_private_gem.git</span><span class="synStatement">'</span><span class="synSpecial"> </span><span class="synStatement">&quot;</span><span class="synConstant">/tmp/build_0902676fab2649d6da106b713a8423d7/vendor/bundle/ruby/2.5.0/cache/bundler/git/sample_private_gem-b3cd9b512dc81bc540e01f090efba0b37ff88c98</span><span class="synStatement">&quot;</span><span class="synSpecial"> --bare --no-hardlinks --quiet`</span> <span class="synStatement">in</span> directory /tmp/build_0902676fab2649d6da106b713a8423d7 has failed.
remote:        fatal: could not <span class="synStatement">read</span> Username <span class="synStatement">for</span> <span class="synStatement">'</span><span class="synConstant">https://github.com</span><span class="synStatement">'</span>: No such device or address
</pre>


<h2 id="プライベートリポジトリのgemを使うための設定">プライベー<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8">トリポジ</a>トリのgemを使うための設定</h2>

<p>bundler の設定でプライベー<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8">トリポジ</a>トリにアクセスする際のクレデンシャルを指定することができる。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fbundler.io%2Fv2.0%2Fman%2Fbundle-config.1.html%23CREDENTIALS-FOR-GEM-SOURCES" title="Bundler: bundle config" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://bundler.io/v2.0/man/bundle-config.1.html#CREDENTIALS-FOR-GEM-SOURCES">bundler.io</a></cite></p>

<p>このように、<a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a>のユーザー名とパスワードを登録することでアクセスできる。
ローカルでの開発環境で設定する際は使用している<a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a>ユーザーのアカウントとパスワードで良いが、デプロイ先の環境でそれを使うのはセキュリティ上良くないので、<a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a>のパーソナルアクセス<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF">トーク</a>ンを使う方が良いと思う。</p>

<h3 id="GitHubのパーソナルアクセストークンを発行"><a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a>のパーソナルアクセス<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF">トーク</a>ンを発行</h3>

<p>今回はプライベー<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8">トリポジ</a>トリにアクセスするため、発行するときのスコープをrepo 全体にする。
下記のコマンド中の<code>*********</code>は、ここで発行したパーソナルアクセス<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF">トーク</a>ンに置き換えて使用する。</p>

<h3 id="ローカル環境での設定">ローカル環境での設定</h3>

<p>クレデンシャルの設定の方法は、ホスト単位、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA">リポジトリ</a>単位の2通りある。</p>

<h4 id="ホスト単位">ホスト単位</h4>

<p>今後も同様なgemが増えるのであれば、予めGit<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA">リポジトリ</a>のホスト（今回は<a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a>）に対して設定しておくと良さそう。</p>

<pre class="code lang-sh" data-lang="sh" data-unlink>bundle config github.com *********:x-oauth-basic
</pre>


<h4 id="リポジトリ単位"><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA">リポジトリ</a>単位</h4>

<pre class="code lang-sh" data-lang="sh" data-unlink>bundle config https://github.com/satoryu/sample_private_gem.git *********:x-oauth-basic
</pre>


<h3 id="デプロイ先の実行環境">デプロイ先の実行環境</h3>

<p><code>bundle</code>コマンドが実行できるのであれば、ローカル環境と同じように設定すると良い。
しかし、HerokuなどPaaSでは、ホスト上でのシェルが実行できないため、代わりに<a class="keyword" href="http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4">環境変数</a>を用いて同様の設定をする。</p>

<p>例えば、Herokuの場合、<code>heroku</code>コマンドを使って、アプリの<a class="keyword" href="http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4">環境変数</a>を指定できる。</p>

<pre class="code lang-sh" data-lang="sh" data-unlink>$ heroku config:<span class="synStatement">set</span><span class="synIdentifier"> BUNDLE_GITHUB__COM=*************************:x-oauth-basic</span>
Setting BUNDLE_GITHUB__COM and restarting ⬢ sample-private-app... <span class="synError">done</span>, v5
BUNDLE_GITHUB__COM: *************************:x-oauth-basic
</pre>


<h2 id="おまけ">おまけ</h2>

<p>HerokuみたいにGit<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA">リポジトリ</a>へのプッシュをトリガーにしてデプロイする環境だと、再度デプロイするために無理やり何か変更する必要があると思ってたけど、gitは空のコミットを作ることができるので、それを使うといいらしい。</p>

<pre class="code lang-sh" data-lang="sh" data-unlink>git commit <span class="synSpecial">--allow-empty</span> <span class="synSpecial">-m</span> <span class="synStatement">'</span><span class="synConstant">Redeploy</span><span class="synStatement">'</span>
</pre>


<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fstackoverflow.com%2Fa%2F41347235%2F3992339" title="Redeploy Heroku app without code changes" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://stackoverflow.com/a/41347235/3992339">stackoverflow.com</a></cite></p>

