---
title: "UglifyjsWebpackPluginが非推奨になったので乗り換えた"
category: blog
tags: [JavaScript,Webpack,Babel]
---
<p>Vue.js やらWebpackやらPWAを勉強するために小さいアプリケーションを作っていたのだが、それがいつの日からかリリース時のビルドのみ失敗するようになった。</p>

<h2>TL;DR</h2>

<p>修正したPull Requestはこちら。
<iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fsatoryu%2FCalCal%2Fpull%2F18" title="Fix build failure in UglifyjsWebpackPlugin by satoryu · Pull Request #18 · satoryu/CalCal" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/satoryu/CalCal/pull/18">github.com</a></cite></p>

<h2>何に乗り換えるか</h2>

<p>そもそもUglifyjsWebpackPluginは、2ヶ月ほど前に非推奨（deprecated）になっているのを見つけた。
<a href="https://github.com/webpack-contrib/uglifyjs-webpack-plugin">GitHub - webpack-contrib/uglifyjs-webpack-plugin: [deprecated] UglifyJS Plugin</a></p>

<p>それを継ぐ選択肢として、<a href="https://github.com/terser/terser">terser</a>を用いた<a href="https://github.com/webpack-contrib/terser-webpack-plugin">terser-webpack-plugin</a>がある。
しかし、そもそも今作っているアプリではBabelを使っていたので、依存をなるべく減らすためにもbabel-preset-minifyに乗り換えることにした。</p>

<h2>使い方</h2>

<p>まずはUglifyjsWebpackPluginをアンインストールし、babel-preset-minifyをインストールする。</p>

<pre class="code bash" data-lang="bash" data-unlink>npm uninstall -D uglify-webpack-plugin
npm install -D babel-preset-minify</pre>


<p>次にWebpackの設定ファイルを以下のように変更する。</p>

```diff
  module: {
    rules: [
      {
        include: [path.resolve(__dirname, "src")],
        loader: "babel-loader",
        options: {
          plugins: ["syntax-dynamic-import"],
          presets: [
+            "minify",    # <= 追加
            [
              "@babel/preset-env",
              {
                modules: false
              }
            ]
          ]
        },

        test: /\.js$/
      },
```

<p>単に、<code>babel-loader</code>のオプションの1つである<code>options.presets</code>に<code>"minify"</code>を追加するだけだ。
もし、<code>babel-preset-minify</code>のオプションを指定したい場合、<code>"minify"</code>の代わりに以下のようなオブジェクトを渡す。</p>

```javascript
[
  "minify",
  {
    "removeConsole": {
      "exclude": ["error", "info"]
    }
  }
]
```

<p>ちゃんと<code>webpack --mode=production</code>のときだけminifyしてくれるので、十分使えそう。</p>

<h2>参考</h2>

<ul>
<li><a href="https://babeljs.io/docs/en/babel-preset-minify">babel-preset-minify · Babel</a></li>
<li><a href="https://github.com/webpack-contrib/terser-webpack-plugin">webpack-contrib/terser-webpack-plugin: Terser Plugin</a></li>
<li><a href="https://github.com/satoryu/CalCal/pull/18">Fix build failure in UglifyjsWebpackPlugin by satoryu · Pull Request #18 · satoryu/CalCal</a></li>
</ul>


