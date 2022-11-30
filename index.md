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
  teaser: /assets/img/top_banner.jpg
---

![近影](/assets/img/top_banner.jpg)

## :man: About Tatsuya Sato

{% assign about_page = site.pages | where: "title", "自己紹介" | first %}
{{ about_page.excerpt | markdownify }}

[Read More...]({{ about_page.url }})
{: .text-right }

## :pencil: Blogs

{% for post in site.posts limit: 5 %}

- [{{ post.date | date: '%Y/%m/%d' }} - {{ post.title }}]({{ post.url }})

{% endfor %}

[Read More...]({% link _pages/blog.md %})
{: .text-right }

## :briefcase: Business

![job banner](/assets/img/job_banner.png){: .full}

企業に勤める傍らで、個人事業主としてもソフトウェア開発の仕事をしています。
自分自身の挑戦のため、これまでの開発の経験を活かして出来るこことに限らず、これまでやったことが無いことを含めて取り組んでいます。

[Read More...]({% link _pages/business.md %})
{: .text-right }

### :newspaper: News

個人での仕事に関する情報はこちらをご覧ください。

{% for post in site.categories.news limit: 5 %}

- [{{ post.date | date: '%Y/%m/%d' }} - {{ post.title }}]({{ post.url }})
{% endfor %}

## :postbox: お問い合わせ

お問い合わせは下記のフォームからお願いいたします。
{: .text-center}

[お問い合わせフォーム](/contact){: .btn .btn--success .btn--x-large}
{: .text-center}
