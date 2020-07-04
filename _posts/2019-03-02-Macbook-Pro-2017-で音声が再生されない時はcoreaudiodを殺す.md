---
title: "Macbook Pro 2017 で音声が再生されない時はcoreaudiodを殺す"
category: blog
tags: [macOS]
---
<p>昨年末あたりからたまに起こる現象で、急に音声がイヤホンや内蔵スピーカーから再生できなくなることがあった。</p>

<p>調べてみると、<a class="keyword" href="http://d.hatena.ne.jp/keyword/Macbook">Macbook</a>の型番は違うが同じような現象が報告されていた。しかし、解決方法については書かれていない。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fdiscussions.apple.com%2Fthread%2F8466406" title="MacBook Pro (2018) Audio on videos cuts o… - Apple Community" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://discussions.apple.com/thread/8466406">discussions.apple.com</a></cite></p>

<p>別で音声関連の問題を調べてみたら、 <code>coreaudiod</code> というプロセスがおかしな挙動をする問題があるようだ。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dmac%2Bcoreaudiod%26oq%3Dmac%2Bcore%26aqs%3Dchrome.0.69i59j69i57j69i60.1601j0j4%26sourceid%3Dchrome%26ie%3DUTF-8" title="mac coreaudiod - Google 検索" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://www.google.com/search?q=mac+coreaudiod&oq=mac+core&aqs=chrome.0.69i59j69i57j69i60.1601j0j4&sourceid=chrome&ie=UTF-8">www.google.com</a></cite></p>

<p><code>coreaudiod</code> は音声再生のためのデーモンらしい。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fwww.howtogeek.com%2F321905%2Fwhat-is-coreaudiod-and-why-is-it-running-on-my-mac%2F" title="What Is “coreaudiod,” and Why Is It Running on My Mac?" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://www.howtogeek.com/321905/what-is-coreaudiod-and-why-is-it-running-on-my-mac/">www.howtogeek.com</a></cite></p>

<p>試しに以下のようにプロセスを殺してみたところ、自動でプロセスが再起動し、音声が再生されるようになった。</p>

<pre class="code" data-lang="" data-unlink>ps aux | grep coreaudiod
_coreaudiod      56073   0.0  0.0  4333268   7684   ??  Ss   11:40PM   0:00.05 /System/Library/Frameworks/CoreAudio.framework/Versions/A/XPCServices/com.apple.audio.DriverHelper.xpc/Contents/MacOS/com.apple.audio.DriverHelper
_coreaudiod      56071   0.0  0.1  4297560   8600   ??  Ss   11:40PM   0:00.02 /System/Library/Frameworks/AudioToolbox.framework/XPCServices/com.apple.audio.SandboxHelper.xpc/Contents/MacOS/com.apple.audio.SandboxHelper
_coreaudiod      56070   0.0  0.1  4320200  15264   ??  Ss   11:40PM   0:00.28 /usr/sbin/coreaudiod

sudo kill -9 56070</pre>


<p>根本解決ではないけど、これまで再起動で復旧していたのに比べて簡単。</p>

