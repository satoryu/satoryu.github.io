---
title: Home
author_profile: true
share: false
read_time: false
related: false
---

# ようこそ

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
