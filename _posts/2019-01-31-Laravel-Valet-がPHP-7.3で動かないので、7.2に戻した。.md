---
title: "Laravel Valet がPHP 7.3で動かないので、7.2に戻した。"
category: blog
tags: [Laravel,PHP,Valet]
---
<p>Homebrew で<a class="keyword" href="http://d.hatena.ne.jp/keyword/PHP">PHP</a>をインストールして、そのまま使い続けているので、気づいたら<a class="keyword" href="http://d.hatena.ne.jp/keyword/PHP">PHP</a> 7.3に上がっていた。
たまたまLaravel Valetを使ってみようとインストールしてみたところ、試しに作ったLaravel アプリをブラウザで開こうとしても、<a class="keyword" href="http://d.hatena.ne.jp/keyword/502%20Bad%20Gateway">502 Bad Gateway</a> とNginxのエラーで開けなかった。</p>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/GitHub">GitHub</a>上にIssueが既にあがっていて、ちょうど同じタイミングで同様の現象に直面していた人がいた。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Flaravel%2Fvalet%2Fissues%2F269%23issuecomment-459055301" title="502 Bad Gateway - nginx/1.10.2 · Issue #269 · laravel/valet" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/laravel/valet/issues/269#issuecomment-459055301">github.com</a></cite></p>

<p>ここで挙げている手順を試してみたのだけれど、<a class="keyword" href="http://d.hatena.ne.jp/keyword/PHP">PHP</a> 7.3 では動かせなかった。
ということで、別の方法として提案されている7.2に戻すことで、一応valetを起動できるようになった。</p>

<pre class="code" data-lang="" data-unlink>brew uninstall php --force
brew install php@7.2
brew links php@7.2 -f

valet install</pre>


<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/php">php</a>-fpmのプロセスが起動されていれば、正常に動いていることになる。</p>

<pre class="code" data-lang="" data-unlink>[2019-01-31 23:13:59]&gt; ps aux | grep php
tatsuya.b.sato   91504   0.0  0.0  4267752    652 s002  R+   11:14PM   0:00.00 grep php
tatsuya.b.sato   89386   0.0  0.0  4484248   1160   ??  S    10:55PM   0:00.00 /usr/local/opt/php@7.2/sbin/php-fpm --nodaemonize
tatsuya.b.sato   89384   0.0  0.1  4486568  17988   ??  S    10:55PM   0:00.22 /usr/local/opt/php@7.2/sbin/php-fpm --nodaemonize
root             89342   0.0  0.1  4484248  14464   ??  Ss   10:55PM   0:00.09 /usr/local/opt/php@7.2/sbin/php-fpm --nodaemonize</pre>


<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/PHP">PHP</a> 7.3で実行していた時、エラーログ（<code>~/.config/valet/Log/nginx-error.log</code>）に以下のエラーが出ていたのだけど、これを調べていけば解決方法がわかるのかな。なんで<a class="keyword" href="http://d.hatena.ne.jp/keyword/fastcgi">fastcgi</a>って文字が出ているのだろうか。</p>

<pre class="code" data-lang="" data-unlink>2019/01/31 12:44:05 [error] 58693#0: *1 connect() to unix:/Users/tatsuya.b.sato/.config/valet/valet.sock failed (61: Connection refused) while connecting to upstream, client: 127.0.0.1, server: , request: &#34;GET / HTTP/1.1&#34;, upstream: &#34;fastcgi://unix:/Users/tatsuya.b.sato/.config/valet/valet.sock:&#34;, host: &#34;blog.test&#34;
2019/01/31 12:44:05 [error] 58693#0: *1 connect() to unix:/Users/tatsuya.b.sato/.config/valet/valet.sock failed (61: Connection refused) while connecting to upstream, client: 127.0.0.1, server: , request: &#34;GET /favicon.ico HTTP/1.1&#34;, upstream: &#34;fastcgi://unix:/Users/tatsuya.b.sato/.config/valet/valet.sock:&#34;, host: &#34;blog.test&#34;, referrer: &#34;http://blog.test/&#34;</pre>


