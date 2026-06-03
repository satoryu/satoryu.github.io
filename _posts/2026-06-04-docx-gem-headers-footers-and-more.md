---
title: Ruby の docx gem を一日で4回リリースしてヘッダー・フッター対応などを入れた
categories:
- 技術
tags:
- Ruby
- OSS
- gem
- docx
---

# はじめに

ぼくがメンテナの一人として関わっている [ruby-docx/docx](https://github.com/ruby-docx/docx) というgemがあります。これはMicrosoft Wordの `.docx` ファイルをRubyから読み書きするためのライブラリです。

今日（2026/06/01）、このgemを一日で4回リリースしました。`v0.10.1`、`v0.11.0`、`v0.12.0`、`v0.13.0` の4つです。
溜まっていたPull RequestやIssueをまとめて片付けたら、気づいたらこんなにリリースしていました。

この記事では、それぞれのリリースで入った機能や修正を紹介します。

# リリースしたバージョン

| バージョン | 内容のひとこと紹介 |
| --- | --- |
| v0.10.1 | Rubyzip の挙動変更に追従するバグ修正 |
| v0.11.0 | ヘッダー・フッターの読み書きに対応（今日の目玉機能） |
| v0.12.0 | ヘッダー・フッター内のブックマーク対応と README 更新 |
| v0.13.0 | 細かな機能追加とクラッシュ対策のまとめ |

# v0.10.1: Rubyzip の挙動変更への追従

- Fixed #168. Rubyzip changed default behavior. ([#170](https://github.com/ruby-docx/docx/pull/170))
- Scope ZIP64 disabling to save/stream (follow-up to #170) ([#172](https://github.com/ruby-docx/docx/pull/172))

気づけばdocxが依存しているgemであるRubyzipがデフォルトの挙動を変えていて、それによってdocx gemで扱ったdocxファイルが壊れてしまうという問題が起きていました。
このバージョンでは、その問題を修正するためのバグフィックスのリリースをしました。

# v0.11.0: ヘッダー・フッターの読み書き対応（目玉機能）

このリリースの目玉が、このヘッダー・フッターを読み書きできる機能です。

```ruby
require 'docx'

doc = Docx::Document.open('example.docx')

# Headers and footers are returned as hashes keyed by their file name
# (e.g. "header1", "footer1"), with Nokogiri documents as values.
doc.headers.each do |name, header|
  puts name
  puts header.text
end

doc.footers.each do |name, footer|
  puts name
  puts footer.text
end
```

このバージョンには、過去にコントリビュートしてもらっていた作業を取り込んだものも含まれています。
過去にいくつか同様の機能追加のPull Requestが長い間放置されていたものを、このリリースでまとめて取り込んだ形です。
コンフリクトなどもあってそのままマージすることができなかったので、それぞれのPRの内容を参考にしながら、改めてmasterブランチに取り込んでいきました。
ただそのままだと、自動生成されるリリースノートにお名前が載らないので、PRのタイトルにオリジナルのPRのコントリビュータの名前を入れるようにして対応しました。

- Add ability to read document headers ([#173](https://github.com/ruby-docx/docx/pull/173))
- Add ability to read document footers (original work by @Jawad79Ahmad in #153) ([#174](https://github.com/ruby-docx/docx/pull/174))
- Persist header and footer edits on save (original work by @aashish in #42) ([#175](https://github.com/ruby-docx/docx/pull/175))
- Fix compatibility with `--enable-frozen-string-literal` ([#171](https://github.com/ruby-docx/docx/pull/171))

# v0.12.0: ヘッダー・フッター内のブックマーク対応

- Scan bookmarks in headers and footers (original idea by @bramj in #22) ([#176](https://github.com/ruby-docx/docx/pull/176))
- Update README for headers/footers and fix stale examples ([#177](https://github.com/ruby-docx/docx/pull/177))

ヘッダ・フッタが読み込めるようになったので、ブックマークのスキャン対象にも含めるようにしました。
なので、ヘッダ・フッタ内のブックマークの前後にテキストを追加したりもできるようになっています。

# v0.13.0: 細かな機能追加とクラッシュ対策

- Decouple load_rels from load_styles so @rels loads without styles.xml ([#178](https://github.com/ruby-docx/docx/pull/178))
- Accept Pathname when opening a document ([#179](https://github.com/ruby-docx/docx/pull/179))
- Pass document_properties to table cell paragraphs so to_html works with hyperlinks ([#180](https://github.com/ruby-docx/docx/pull/180))
- Add Paragraph#substitute for placeholders split across runs ([#181](https://github.com/ruby-docx/docx/pull/181))
- Guard against nil crashes on malformed documents ([#182](https://github.com/ruby-docx/docx/pull/182))

最後の `v0.13.0` では、細かいながらも実用上ありがたい改善をまとめて入れました。
このバージョンは小さいバグ修正を取り込むつもりが、1つ互換性のある機能が追加されたので、結果的にはマイナーバージョンのリリースとなっています。

そんな追加機能の`Paragraph#substitute` は、プレースホルダの置換を、同じ段落内であっても複数のRunにまたがっていてもできるようにする機能です。
普通にdocxファイルを編集していると、気づくとRunが分割されているということはよくあることだったと思います。
そういった場合でも、プレースホルダを置換できるようになったのです。

# おわりに

コードを修正する以外にも、プルリクエストやIssueのコメントの返信の内容の相談についても、多くをClaude Codeに助けてもらって今回の一連のリリースが実現されました。
それのおかげで、だいぶ待たせてしまっていたリリースをまとめて出すことが出来たと思っています。
まだいくつか残っているIssuesやプルリクエストもあるので、時間を見つけて少しずつ片付けていきたいものです。

docx gemは [RubyGems](https://rubygems.org/gems/docx) で公開しています。WordファイルをRubyで扱いたくなったときは、ぜひ試してみてください。
