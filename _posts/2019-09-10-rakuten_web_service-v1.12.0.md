---
title: "rakuten_web_service v1.12 をリリースしました。"
category: blog
tags: [OSS,Ruby,Rakuten Web Service,rubygems]
---
<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Frakuten-ws%2Frws-ruby-sdk" title="rakuten-ws/rws-ruby-sdk" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/rakuten-ws/rws-ruby-sdk">github.com</a></cite></p>

<p>昨日に2ヶ月ぶりのリリースをしました。</p>

<p>これまでまったく自分が興味を持てなかったIchiba Tag <a class="keyword" href="http://d.hatena.ne.jp/keyword/API">API</a>に対応させるプルリク<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9">エス</a>トが送られてきたので、それを取り込んだものが今回のリリース内容です。</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Frakuten-ws%2Frws-ruby-sdk%2Fpull%2F110" title="Add Item TagIds attribute &amp; Tag API by keisukeponpoko · Pull Request #110 · rakuten-ws/rws-ruby-sdk" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/rakuten-ws/rws-ruby-sdk/pull/110">github.com</a></cite></p>

<p>利用する場合は、</p>

```sh
gem install rakuten_web_service -v '1.12.0'
```

<p>またbundlerを利用している場合、下記の1行をGemfileに追加してください。</p>

```ruby
gem 'rakuten_web_service', '~> 1.12.0'
```
