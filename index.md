---
layout: splash
title: satoryu - Tatsuya Sato (佐藤 竜也)
author_profile: false
share: true
read_time: false
related: false
classes:
  - wide
header:
  image: /assets/img/top_banner.jpg
  teaser: /assets/img/top_banner.jpg
---

## ようこそ

このサイトは、佐藤竜也のサイトです。

## コンテンツ

{% for nav in site.data.navigation.main %}

[{{ nav.title }}]({{ nav.url }})
: {{ nav.description }}

{% endfor %}

## 更新履歴

{% for post in site.posts limit: 5 %}

- [{{ post.title }}]({{ post.url }}) ({{ post.date | date_to_string }})

{% endfor %}
