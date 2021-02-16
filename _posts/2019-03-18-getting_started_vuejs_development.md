---
title: "Vue.js で開発を始める手順をまとめてみる。"
category: blog
tags: [Webpack,JavaScript,Vue.js]
toc: true
---

フロントエンド開発に疎い自分とサヨナラしようと昨年末くらいから[Vue.js](https://jp.vuejs.org/index.html)の勉強をしている。
ドキュメントやチュートリアルを見て、自分で考えた小さいアプリケーションを作りながら覚えていこうとしている。
何個か作ってみたけれど、毎度初回に何のパッケージをいれて、どうセットアップするかで時間を取られるので、ここいらで少し自分なりにまとめてみる。

<!-- more -->

ここで紹介している手順は下記の環境を想定しています。

- macOS High Sierra 10.13.6
- node v10.6.0
- npm 6.1.0

## TL;DR

出来上がったものをGitHubで公開しているので、お時間が無い方はこちらをどうぞ。

{% linkpreview "https://github.com/satoryu/my-vuejsapp" %}

## リポジトリを作る

ここで`my-vuejsapp`というアプリケーションを作るとする。

```sh
mkdir my-vuejsapp
cd my-vuejsapp
git init
```

## NPMの準備

パッケージ管理`npm`を使用するためにディレクトリ内で初期化する。

```sh
npm init -y
```

npmパッケージをインストールした時にうっかりそれらをコミットしてしまわないように、`node_modules`ディレクトリを無視する設定を追加する。
具体的には、下記の内容の`.gitignore`ファイルをリポジトリ直下に追加する。

```
node_modules
```

安心のために、この時点でコミットしておこう。

## Webpack

ここではWebpackを使ってJavaScriptとHTMLを生成する方法を説明する。

### インストール

最終的にデプロイするJavaScriptファイルを生成するために、ここではWebpackを使う。
初期化のために[`webpack-cli`](https://www.npmjs.com/package/@webpack-cli/init)と[`@webpack-cli/init`](https://www.npmjs.com/package/@webpack-cli/init)  も合わせてインストールする。

```sh
npm install -D webpack webpack-cli @webpack-cli/init
```

続いて、`webpack-cli`の`init`サブコマンドを使って、Webpackの設定ファイルを生成する。

```sh
$ npx webpack-cli init

ℹ INFO For more information and a detailed description of each question, have a look at https://github.com/webpack/webpack-cli/blob/master/INIT.md
ℹ INFO Alternatively, run `webpack(-cli) --help` for usage info.

? Will your application have multiple bundles? No
? Which module will be the first to enter the application? [default: ./src/index]
? Which folder will your generated bundles be in? [default: dist]:
? Will you be using ES2015? Yes
? Will you use one of the below CSS solutions? SASS

> node-sass@4.11.0 install /Users/tatsuya.b.sato/Projects/private/my-vuejsapp/node_modules/node-sass
> node scripts/install.js

Cached binary found at /Users/tatsuya.b.sato/.npm/node-sass/4.11.0/darwin-x64-64_binding.node

> node-sass@4.11.0 postinstall /Users/tatsuya.b.sato/Projects/private/my-vuejsapp/node_modules/node-sass
> node scripts/build.js

Binary found at /Users/tatsuya.b.sato/Projects/private/my-vuejsapp/node_modules/node-sass/vendor/darwin-x64-64/binding.node
Testing binary
Binary is fine
npm WARN acorn-dynamic-import@4.0.0 requires a peer of acorn@^6.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN my-vuejsapp@1.0.0 No description
npm WARN my-vuejsapp@1.0.0 No repository field.

+ babel-plugin-syntax-dynamic-import@6.18.0
+ style-loader@0.23.1
+ sass-loader@7.1.0
+ @babel/core@7.2.2
+ uglifyjs-webpack-plugin@2.0.1
+ babel-loader@8.0.5
+ node-sass@4.11.0
+ webpack-cli@3.2.3
+ @babel/preset-env@7.3.1
+ css-loader@2.1.0
+ webpack@4.29.6
updated 11 packages and audited 69968 packages in 11.283s
found 128 low severity vulnerabilities
  run `npm audit fix` to fix them, or `npm audit` for details

Congratulations! Your new webpack configuration file has been created!
{ parser: "babylon" } is deprecated; we now treat it as { parser: "babel" }.
```

上のダイアログでの質問とここでの回答は、

- 「複数の成果物を作る？」「いいえ」
- 「エントリーファイルのモジュール名は？」「デフォルトの`./src/index `」
- 「成果物はどこに作る？」「こっちもデフォルトの`dist`ディレクトリに」
- 「ES2015使う？」「はい」
- 「CSSのメタ言語には何使う？」「SASS」

としている。

### ビルド

この時点で、JavaScriptをビルドできるか確認する。
まず、下記の内容の `src/index.js` ファイルを作成する。

```javascript
console.log("Hello, Webpack!");
```

次に、`webpack`コマンドを使いビルドする。

```sh
$ npx webpack --config ./webpack.dev.js
Hash: 288fe4ef5796d056406f
Version: webpack 4.29.6
Time: 536ms
Built at: 03/14/2019 6:54:55 PM
                       Asset     Size  Chunks             Chunk Names
main.37b35a805a4a212c0d5b.js  3.8 KiB    main  [emitted]  main
Entrypoint main = main.37b35a805a4a212c0d5b.js
[./src/index.js] 29 bytes {main} [built]
```

エラーなどでなければ、`dist`ディレクトリ以下に`main.[chunkhash].js` ((`
ここで[chunkhash]はchunk（ファイル）ごとに与えられたハッシュ値)) が生成されているはず。

`dist`ディレクトリをコミットしないように、`.gitignore` ファイルに`dist`を追加する。

```diff
node_modules
+ dist
```

### HTMLを生成する

ここで生成したWebpackの設定ファイル内では、outputオプションで`[chunkhash]`が使用されている。

```javascript
output: {
  chunkFilename: '[name].[chunkhash].js',
  filename: '[name].[chunkhash].js'
},
```

これは、キャッシュを活用するために付けられたハッシュ値であり、Chunkごとに生成される。

生成されたJavaScriptファイルをHTML内で読み込むためには、このハッシュ値を含めて指定しなければいけない。しかし、このハッシュ値は`index.js`を変更した時に変わってしまうので、HTMLも変更する必要がある。
これはミスが発生しそうなので、HTMLファイルもWebpackで生成させることにする。

そのためのプラグインである[`html-webpack-plugin`](https://github.com/jantimon/html-webpack-plugin/) をインストールする。

```sh
npm i -D html-webpack-plugin
```

次に、プラグインを読み込むため、下記のように`webpack.dev.js`を変更する。

```diff
diff --git a/webpack.dev.js b/webpack.dev.js
index d213a77..64700a1 100644
--- a/webpack.dev.js
+++ b/webpack.dev.js
@@ -23,6 +23,7 @@ const path = require('path');
  */

 const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
+const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
        module: {
@@ -69,6 +70,12 @@ module.exports = {
                filename: '[name].[chunkhash].js'
        },

+       plugins: [
+               new HtmlWebpackPlugin({
+                       template: './src/index.html'
+               })
+       ],
+
        mode: 'development',

        optimization: {
```

元となるHTMLファイルとして、下記のような`src/index.html` を作る。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>My Vue.js App</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

ここで重要なのは、`div#app`である。
`html-webpack-plugin`は、生成された成果物を読み込むためのscriptタグを`#app`直後に挿入する。
ここでビルドを実行すると、distディレクトリに下記のような`index.html`ファイルが生成される。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>My Vue.js App</title>
</head>
<body>
    <div id="app"></div>
<script type="text/javascript" src="main.f6d5b3f7cd28b3697ced.js"></script></body>
</html>
```

`html-webpack-plugin`のデフォルトの設定で、`#app`直後に生成されたJavaScriptファイルの読み込みがなされている。
これは変更可能であるが、ここでは割愛する。

## Vue.js

ここでは、Vue.jsを使用したアプリケーション開発を始めるための設定、vueファイルによるVueコンポーネントを使用するたねの設定について説明する。

### インストール

まずはVue.jsのパッケージをインストールする。

```sh
npm install -D vue
```

この時点だと`import Vue from 'vue';` とやっても適切に読み込まれないので、Webpackの設定ファイル`webpack.dev.js`にAliasを追加する。

```diff
diff --git a/webpack.dev.js b/webpack.dev.js
index 64700a1..c718ee2 100644
--- a/webpack.dev.js
+++ b/webpack.dev.js
@@ -76,6 +76,12 @@ module.exports = {
                })
        ],

+       resolve: {
+               alias: {
+                 vue$: "vue/dist/vue.esm.js"
+               }
+         },
+
        mode: 'development',
```

### 簡単なVue.jsのアプリを作る。

`src/index.js` の中身を消し、下記の内容を書いて、保存する。

```javascript
import Vue from 'vue';

new Vue({
    el: '#app',
    template: `<h1>Hello, Vue!</h1>`
});
```

変更が完了したらビルドを実行し、ブラウザで`dist/index.hml` を開く。

> Hello, Vue!

が見えたら正しく設定できている。

### 単一ファイルコンポーネントを使えるようにする。

`new Vue({...})` でコンポーネントを定義できるのですが、開発するアプリケーションが大きくなると、不便な点が出てきます。
そこで、[単一ファイルコンポーネント](https://jp.vuejs.org/v2/guide/single-file-components.html)を扱えるようにし、`.vue`ファイルにコンポーネントの定義を分割していきます。

Webpackで単一ファイルコンポーネントを扱えるようにするには、[`vue-loader`](https://github.com/vuejs/vue-loader)と[`vue-template-compiler`](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler)を使う。

```sh
npm install -D vue-loader vue-template-compiler
```

Webpackの設定ファイル`webpack.dev.js` を以下のように修正する。

```diff
diff --git a/webpack.dev.js b/webpack.dev.js
index c718ee2..c1b733b 100644
--- a/webpack.dev.js
+++ b/webpack.dev.js
@@ -24,6 +24,7 @@ const path = require('path');

 const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
+const VueLoaderPlugin = require('vue-loader/lib/plugin');

 module.exports = {
        module: {
@@ -47,6 +48,10 @@ module.exports = {

                                test: /\.js$/
                        },
+                       {
+                               test: /\.vue$/,
+                               loader: 'vue-loader'
+                       },
                        {
                                test: /\.(scss|css)$/,

@@ -71,6 +76,7 @@ module.exports = {
        },

        plugins: [
+               new VueLoaderPlugin(),
                new HtmlWebpackPlugin({
                        template: './src/index.html'
                })
```

プラグインとしてVueLoaderPluginをインストールし、`vue`ファイルに対して`vue-loader`を介して生成している。

試しに以下のようなVueコンポーネントを、`src/App.vue` に保存する。

```javascript
<template>
    <div>
        <h1>{{ greeting }} {{ name }}!</h1>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            greeting: 'Hello,',
            name: 'Vue Component'
        }
    }
}
</script>
```

このコンポーネントを読み込むため、`src/index.js` も以下のように修正する。

```diff
diff --git a/src/index.js b/src/index.js
index 0e8da1a..7dab791 100644
--- a/src/index.js
+++ b/src/index.js
@@ -1,8 +1,8 @@
-import Vue from "vue";
+import Vue from 'vue';
+import App from './App.vue';

 new Vue({
   el: "#app",
-  template: `
-        <h1>Hello, Vue!</h1>
-    `
+  components: { App },
+  template: '<App/></App>'
 });
```

最後にビルドして、生成された`dist/index.html`をブラウザで開き、**"Hello, Vue Component!"** が表示されていれば成功。


## おわりに

ここでは、Webpackを用いてVue.jsのアプリをビルドするための環境の設定手順を紹介した。
CSSフレームワークやフォントなどを扱うためには、この手順に加えて、いくつかnpmパッケージのインストールと設定の変更が必要になる。
また、[Vue CLI](https://cli.vuejs.org/)というものがあり、これを使ってプロジェクトのディレクトリを生成することができる。おそらく、Vue CLIの方がより簡単に構築ができそうである。

そして、本を一冊買ったのに積読なのを思い出した。

[asin:4297100916:detail]
