---
title: "インスタンス名を取り締まるためのRuboCop拡張をリリースしました。 #rubocop"
category: blog
tags: [Ruby,rubygems,RuboCop]
---
<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9">インスタンス</a>名を取り締まるためのRuboCop拡張 <code>rubocop-instance_variable_name</code> をリリースしました。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fsatoryu%2Frubocop-instance_variable_name" title="satoryu/rubocop-instance_variable_name" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/satoryu/rubocop-instance_variable_name">github.com</a></cite></p>

<h2>何ができるの？</h2>

<p>この拡張がやっているのは、とてもシンプルなことで、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9">インスタンス</a>変数名の長さが一定以下（デフォルトだと2）の<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9">インスタンス</a>変数に警告を出します。</p>

```ruby
@ms = 'foo' # bad code

@message = 'foo' # good code
```

<h2>作った動機</h2>

<p>最近、他人の書いたコードをレビューしたり、他人の書いたコードを修正する機会が増えてきました。
その中で、いつも悩まされるのが変数名がわかりづらい時でした。
特に、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9">インスタンス</a>変数名は重要だと思います。
メソッド名や<code>attr_reader</code>などで定義されるゲッターが分かりづらかったり、複雑なコードだとしても、変数名が何を表しているのかがわかると読み解くことができます。
特にクラス変数名は重要です。</p>

<p>読みづらさの中で最も辛いのは、略語を使ったものです。
普段使わない単語を使っているのも読みづらいのですが、英和辞典やググれば理解することはできます。
ですが、略語になると、それを推測するのが非常に難しくなります。</p>

<p>ということで、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9">インスタンス</a>変数名の長さに注目し、受け入れられない長さの変数名を指摘するRuboCop拡張を作りました。</p>

<p>是非ご活用ください。
また、何か不具合等ございましたら、Issueを作っていただけると助かります。</p>

<ul>
<li><a href="https://github.com/satoryu/rubocop-instance_variable_name/issues">Issues &middot; satoryu/rubocop-instance_variable_name &middot; GitHub</a></li>
</ul>


