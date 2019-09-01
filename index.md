---
title: Home
author_profile: true
share: false
read_time: false
related: false
---

# ようこそ

このサイトは、佐藤竜也のサイトです。
これまでのエンジニアとしての活動について掲載しています。

## サイト構成

{% for nav in site.data.navigation.main %}

[{{ nav.title }}]({{ nav.url }})
: {{ nav.description }}

{% endfor %}