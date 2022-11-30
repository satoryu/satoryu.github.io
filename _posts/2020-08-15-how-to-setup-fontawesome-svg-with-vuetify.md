---
title: VuetifyでFontAwesome SVGを使う方法
slug: how-to-setup-fontawesome-svg-with-vuetify
date: 2020-08-15
excerpt: VuetifyでFontAwesomeのSVG版を使うさいにハマりどころがいくつかありました。
header:
  teaser: /assets/img/2020-08-15-vuetify-with-fontawesome.png
  og_image: /assets/img/2020-08-15-vuetify-with-fontawesome.png
  overlay_image: /assets/img/2020-08-15-vuetify-with-fontawesome.png
  overlay_filter: rgba(35, 35, 35, 0.5)
category: blog
tags:
  - Vue.js
  - Vuetify
  - JavaScript
  - Fontawesome
---

Vue.jsで何かプロジェクトを作成するとき、コンポーネントフレームワークである[Vuetify](https://vuetifyjs.com/en/)が便利なのでよく使っています。
アイコンにはFontAwesomeを利用することが多いです。

いつもはFontAwesomeのCSS版をCDNやnpmパッケージからインストールして使用しているのですが、今作成しているプロジェクトでSVG版を試してみました。

## 準備

[公式ドキュメントに記載](https://vuetifyjs.com/en/customization/icons/#install-font-awesome-svg-icons)があるとおりに、npmパッケージをインストールし、Vuetifyの設定を追加します。

### パッケージのインストール

FontAwesome本体と

```sh
npm install @fortawesome/fontawesome-svg-core @fortawesome/vue-fontawesome @fortawesome/free-solid-svg-icons
```

公式ドキュメントで指定されているパッケージに加えて、`@fortawesome/free-regular-svg-icons`を追加しています。
これは、Vuetifyが提供するコンポーネント内で使用されるアイコンに指定されているためです。もし、そのアイコンを使用しているコンポーネントを使わないのであればここでインストールする必要はありません。

### Vuetifyの設定

Vuetifyを使用できるように`Vue.use`を使用して登録します。

```javascript
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

// (1)
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(far)

// (2)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// (3)
dom.watch()

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'faSvg'
  },
})
```

公式ドキュメントで書かれている設定に加えて、3つ追加している部分があります。

上記`(1)`では、先に書いたように、使用するアイコンを登録しています。

`(2)`は、Vue上でFontAwesomeを便利に扱うためのコンポーネントを、このプロジェクト内の全Vueテンプレート内で使用できるように登録しています。
ここで重要なのは、登録しているコンポーネント名を`font-awesome-icon`にしなければいけないというところです。
Vuetifyの設定で`icons.iconfont = 'faSvg'`としたとき、Vuetifyは内部で使用するアイコンの読み込みを`font-awesome-icon`コンポーネントが使えることを前提として書かれています。

`(3)`は、`v-icon`コンポーネントを使用してFontAwesomeのアイコンを埋め込む場合に必要です。
`icons.confont = 'faSvg'`と設定したとき、`v-icon`はSVGを直接埋め込まず、`i`タグにクラスを指定するのみです。
そこで、`fontawesome-svg-core`が提供する`dom.watch`を使用し、JSで`i`を`svg`に置き換えるようにします。

## FontAwesomeのアイコンの埋め込み方

アイコンの埋め込み方は、2通りあります。

1. `v-icon`を使用する
2. `font-awesome-icon`を使用する

どちらも、アイコンを埋め込むのですが動作が異なります。

### `v-icon` を使用する

`v-icon`はVuetifyが提供するコンポーネントです。

```html
<v-icon>fas fa-calendar-day</v-icon>
```

このとき、テキスト部分（タグで挟まれた部分）にFontAwesomeのアイコンのクラスを指定します。
上の例は、[`calendar-day`アイコン](https://fontawesome.com/icons/calendar-day?style=solid)を埋め込む場合のタグの記述です。
これは`i`タグを埋め込み、Vuetifyとしてのクラスを付け加えます。
ですので、Vuetifyの他のコンポーネントとの見た目を合わせることができます。

1つ欠点があるとすれば、上で説明したとおり、プロジェクトのJSの起動するときに、`dom.watch`を予め呼んでおかないと正しく表示されません。

### `font-awesome-icon`を使用する

`vue-fontawesome`が提供する`FontAwesomeIcon`コンポーネントを使用すると、その部分にSVGをそのまま埋め込むことができます。
こちらの方法だと、上の`v-icon`の場合に必要だった`dom.watch`は必要ありません。

```html
<font-awesome-icon :icon="['fas', 'calendar-day']"></font-awesome-icon>
```

ここで気をつけなければいけないのは、`icon`プロパティを使ったアイコンの指定のしかたです。
文字列の配列を渡さなければならないことと、**アイコンのクラス名とは一致しない**ということに気をつけなければなりません。

`calendar-day`アイコンを指定する場合、`v-icon`では`fas fa-calendar-day`であるのに対し、`['fas', 'calendar-day']`とアイコン名から`fa-`を除く必要があります。

## 参考

- [Icons — Vuetify.js](https://vuetifyjs.com/en/customization/icons/#install-font-awesome-svg-icons)
- [dom.watch - Font Awesome](https://fontawesome.com/how-to-use/javascript-api/methods/dom-watch)
- [@fortawesome/fontawesome-svg-core - npm](https://www.npmjs.com/package/@fortawesome/fontawesome-svg-core)
- [FortAwesome/vue-fontawesome: Font Awesome 5 Vue component](https://github.com/FortAwesome/vue-fontawesome)