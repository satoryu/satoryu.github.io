---
title: SQL ServerにActiveRecordで複数レコードをINSERTするときのハマりどころ
excerpt: |
  業務で開発しているRailsアプリケーションで、SQL Serverに数万件のデータを取り込む処理を実装した際にハマったところがあったので、それについてまとめました。
category: blog
tags:
  - Rails
  - SQL Server
  - ActiveRecord
---

今、業務で書いているコードで、外部のAPIから取得したデータをSQL Serverに取り込む処理がある。
素直に記述すると、大量のINSERT文を発行することになるので、Rails 6から導入された[`insert_all`](https://api.rubyonrails.org/classes/ActiveRecord/Persistence/ClassMethods.html#method-i-insert_all)を使って取り込むことにした。

その際に、SQL Server特有のハマりどころがあったので書き残しておく。

## `insert_all`は使えない

素直に`insert_all`を利用して、実行すると下記の例外が出る。

```ruby
ArgumentError: ActiveRecord::ConnectionAdapters::SQLServerAdapter does not support skipping duplicates
```

このように`insert_all`は使えないので、`insert_all!`を使う。
これらのメソッドの違いは、INSERTしようとしているデータに重複したレコードが含まれていた場合の振る舞いである。
前者は重複したレコードを飛ばし、後者は例外を発生させる。
`insert_all`が利用できない詳しい状況については下記のQiitaの記事に書いてある。

[Rails6, SQL Serverでinsert\_allが使えない問題 - Qiita](https://qiita.com/Alt70155/items/111b96dd9e4d710d331a)

2022/11/28時点では、SQL Serverのアダプタである`activerecord-sqlserver-adapter`が対応をしていないため、まだ利用できない。

ということで、`insert_all!`を使って実装することになる。

## 一度に登録できるレコード数は1,000件まで

SQL Serverには、INSERT文で一度に登録できるのは1,000件までという制約がある。
T-SQLのドキュメントを見てみたが、そのような記述は見当たらない。
[INSERT (Transact-SQL) - SQL Server | Microsoft Learn](https://learn.microsoft.com/en-us/sql/t-sql/statements/insert-transact-sql?view=sql-server-ver16)

検索してみると、この制約について記述しているページを見つけた。

> また、1回のINSERTステートメントで挿入できるレコードの上限は1000件になります。
> 1000件を超えるレコードをINSERTステートメントで実行しようとすると
> 「INSERT ステートメントの行値式の数が、1000 行値の許容最大数を超えています。」
> というエラーが発生しますので、挿入するレコードが1000件をを超える場合はINSERT文を分けて実行する必要があります。
>
> ***--[1回のINSERT（インサートSQL）で複数行のレコードを一括挿入（追加）する](https://johobase.com/multiple-insert-sql/)***

実際に、1,000件以上のデータを登録しようとすると以下のような例外が出る。

```ruby
ActiveRecord::StatementInvalid: TinyTds::Error: The number of row value expressions in the INSERT statement exceeds the maximum allowed number of 1000 row values.
```

ということで、以下のように記述することで1,000件以上のデータを登録できるようになる。

```ruby
rows = import_from_external_api # <= 何らかのデータを持ってくる処理

rows.each_slice(1000) do |chunk|
  Model.insert_all!(chunk)
end
```

適宜、`transaction`を利用するなどして、例外時のロールバックを追加する必要はあるだろう。

## 実行時間の比較

実際に業務では19万件のデータを取り込むので、ためしにINSERT文を19万回発行する場合と`insert_all!`を利用して1,000件ごと登録する場合とで実行時間を比較してみた。

今は開発の段階なので、開発用のWindows 11マシン上のWSLで構築したUbuntuからDocker上で実行している。
マシンスペックはわからないので[^1]、ここでは省略する。

[^1]: この記事を書いてるときに仕事用マシンに電源つけて調べるのがめんどくさかった。

時間の計測には、`time`コマンドを利用した。

### INSERT文19万回の場合

外部から取り込んだデータを1件ずつ登録するような処理をしている。
下記のように、1件ずつ`create`でレコードを作成している。

```ruby
rows = import_from_external_api

rows.each do |row|
  Model.create(row)
end
```

実行結果は以下のようになった。

```txt
 real    4m25.024s
 user    0m0.060s
 sys     0m0.067s
```

だいたい4分半くらいかかっていた。

### `insert_all!`の場合

```txt
 real    0m20.675s
 user    0m0.036s
 sys     0m0.036s
```

遅い場合でも30秒を超えることは無かったので、9倍以上早くなっている。

