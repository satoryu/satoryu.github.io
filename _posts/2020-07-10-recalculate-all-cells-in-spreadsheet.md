---
title: RubyでGoogle SpreadSheetの式を再計算させる方法
header:
  teaser: /assets/img/20200709/google_spread_sheets.png
category: blog
tags:
  - Google Spreadsheets
  - Ruby
  - API
---

![Google SpreadSheets](/assets/img/20200709/google_spread_sheets.png)

Google Spreadsheet をAPIからコピーしたりした後など、数式の参照や計算が反映されていないことがおこりえる。
こういった時に、該当のセルの数式を再評価する必要がある。
最も手軽でてっとり早いやり方は、手動でセルの計算式を再評価させる方法だ。
ブラウザでスプレッドシートを開き、セルを選択し、Enterキーを押すと式が再評価される。
しかし、再評価させたい式が多数ある場合、作業が大変になってくる。

シート中の式の再評価をAPIから行う方法を見つけた。

- [Google Sheets API and Formula Calculation · James Dobson](https://jamesdobson.name/post/sheets-api-and-formula-calculation/)

この記事に書いてあるように、

1. 数式のセルの値を数式として取り出すように`valueRenderOption`に`FORMULA`を指定
2. その値をシートにそのまま入れ、ユーザーが入力したときと同じように処理するように`valueInputOption`に`USER_ENTERED`を指定

してAPIを呼ぶことで、数式を再計算させることができる。

[`google-apis-client`](https://github.com/googleapis/google-api-ruby-client)を使って、実装すると以下のようになる。

```ruby
require 'google/apis/sheet_v4'
sheets = Google::Apis::SheetsV4::SheetsService.new

sheet_id = 'YOUR_SPREADSHEET_ID'
worksheet_title = 'SOME_TITTLE'

# 1. 数式は数式のままでセルの値を取り出す
values = sheets.get_spreadsheet_values(sheet_id, "#{worksheet_title}!$A$1:$YY", value_render_option: 'FORMULA')
# 2. ユーザーがUIで入力したのと同じようにオプションを追加
sheets. sheets.update_spreadsheet_value(sheet_id, values.range, values, value_input_option: 'USER_ENTERED')
```

ここで`$A$1::$YY`を指定しているのは、シート全体を選択するためです。
もし該当のセルの範囲がわかるようであれば、その範囲を指定すれば良い。

ということで、値を数式として入れ直すというAPIとしてはコストかかりそうなリクエストなのだけれど、これでシートの数式をいっきに更新できます。

## 参考

- [Google Sheets API and Formula Calculation · James Dobson](https://jamesdobson.name/post/sheets-api-and-formula-calculation/)
- [How to specify the entire sheet as range in Google Sheets? - Web Applications Stack Exchange](https://webapps.stackexchange.com/questions/44128/how-to-specify-the-entire-sheet-as-range-in-google-sheets)
