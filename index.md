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

## About Tatsuya Sato

{% assign about_page = site.pages | find: "title", "自己紹介" | first %}
{{ about_page.excerpt | markdownify }}

[Read More...]({{ about_page.url }})
{: .text-right }

## Blogs

{% for post in site.posts limit: 5 %}

- [{{ post.date | date_to_string: "ordinal", "JP" }} - {{ post.title }}]({{ post.url }})

{% endfor %}

[Read More...]({% link _pages/blog.md %})

## コンテンツ

{% for nav in site.data.navigation.main %}

[{{ nav.title }}]({{ nav.url }})
: {{ nav.description }}

{% endfor %}
