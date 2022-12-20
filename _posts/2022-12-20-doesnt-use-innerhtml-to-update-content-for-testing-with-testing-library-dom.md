---
title: innerTextを使ったHTML要素の更新はtesting-libary/domでは検知できない
excerpt: |
  ライブラリを利用して、HTML要素にテキストが追加されたことを確認するテストを書いたときに、その更新を検知できませんでした。
  その原因をライブラリのコードを読んで原因がわかったので、そのことについて書きました。
category: blog
tags:
  - jest
  - JavaScript
  - testing-library/dom
---

## TL;DR

- `@testing-library/dom`の`getText`で、探索する文字列の対象は、要素の`textContent`プロパティ
- `@testing-library/dom`によって生成された要素の`innerText`を変更しても、`textContent`は更新されない
- しかし、実際のブラウザ（Chrome）では`innerText`を変更すると`textContent`も更新される

## 動機

現在、[Copy for Scrapbox](https://chrome.google.com/webstore/detail/copy-for-scrapbox/kalhokahkhkmbkiliieonfdmdeajlnog)というChrome拡張を開発しており、そこにテストコードを`jest`で実装しようと思ったことがきっかけです。
このChrome拡張は、現在見ているタブや選択した複数のタブのURLとページのタイトルからScrapbox形式のリンクテキストを生成し、クリップボードにコピーする機能を提供しています。
このコピーが完了したことを、拡張のポップアップ部分でテキストを表示することでユーザーに提示しています。

そのテストを記述したところ、テキストが表示されていることを確認するコードがテキストを取得できていませんでした。
実際に、ブラウザで開発中のChrome拡張を実行してみると、期待したとおりにメッセージが表示されます。
デバッグしてみると、コード自体は実行されており、

## 実際のコード

ポップアップ部分のHTMLは以下のものです。

```html
  <div id="message-box"></div>
  <button id="copy-current-tab-button">Copy Current Tab</button>
  <button id="copy-selected-tabs-button">Copy Selected Tabs</button>
```

肝心な部分だけを抜き出しているので、`html`や`head`タグなどは省いています。
いずれかのボタンがお押されると、クリップボードにリンクがコピーされ、コピー完了を示すテキストが表示されます。
`#message-box`がそのテキストを表示する部分です。

そして、以下がテキストを表示させるJSのコードです。

```javascript
function appendMessage(messageText) {
  let messageElement = document.createElement('p')
  messageElement.innerText = messageText // <= 表示したいテキストがここで追加される
  messageBox.appendChild(messageElement)
}
```

`messageBox`は先の`#message-box`の要素です。
そこに、新しく`p`要素を生成し、その内部に表示したいテキスト`messageText`を入れています。
これでブラウザ上では表示されます。

次に該当のテストコードです。

```javascript
import { screen, waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

describe("appendMessage", () => {
  beforeAll(() => {
    document.body.innerHTML = `
      <div id="message-box"></div>
      <button id="copy-current-tab-button">Copy Current Tab</button>
      <button id="copy-selected-tabs-button">Copy Selected Tabs</button>
    `;

    require("./../popup.js");
  })

  beforeEach(async () => {
    // (1) ボタンをクリック
    user = userEvent.setup()
    const button = screen.getByRole('button', { name: 'Copy Current Tab' })
    await user.click(button);
  })

  test("insert p tag to show a given message", async () => {
    // (2) クリック後に表示されるメッセージを取得
    const message = await screen.getByText('Copied')

    expect(message).toBeTruthy()
  });
});
```

上記の(1)でボタンのクリックを再現し、その後に(2)で表示されているであろうテキスト（ここでは`Copied`）を含む要素を`getByText`を使って取得しようとしています。
これが実際には、存在しないというエラーになっていた。

## `@testing-libary/dom`を調べてみる

表示されるまでに時間がかかるのかと思い少し時間を開けてから`getByText`を実行させるなど色々試したが取得することができなかった。
そこで、実際に`getByText`の中がどのようになっているのか確認してみた。

`getByText`では、指定された文字列を`html.body`内の各要素から探している。
そのとき、各要素内のテキストを取得し、そこに指定された文字列が含まれていないかをチェックしている。
要素内のテキストを取得する関数`getNodeText`は以下のようになっている。

```javascript
import {TEXT_NODE} from './helpers'

function getNodeText(node: HTMLElement): string {
  if (
    node.matches('input[type=submit], input[type=button], input[type=reset]')
  ) {
    return (node as HTMLInputElement).value
  }

  return Array.from(node.childNodes)
    .filter(child => child.nodeType === TEXT_NODE && Boolean(child.textContent))
    .map(c => c.textContent) // <= ここ
    .join('')
}

export {getNodeText}
```

[dom-testing-library/get-node-text.ts at d1a57dd9266c41c42b9b384e3583f4b5d9131c64 · testing-library/dom-testing-library](https://github.com/testing-library/dom-testing-library/blob/d1a57dd9266c41c42b9b384e3583f4b5d9131c64/src/get-node-text.ts#L12)

上記にコメント文をいれたところを見ると`textContent`を参照していることがわかる。
つまり、`textContent`を更新すれば解決できそうな気配がする。

## `innerText`と`textContent`の違い

安易にこの部分を置き換えていいものなのかを検討するために、`innerText`と`textContent`の違いを調べてみた。

MDNに`textContent`のページがあり、そこに違いについて記述した部分があります。
以下、その引用です。

> - `textContent` は、 [`<script>`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/script) と [`<style>`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/style) 要素を含む、_すべて_の要素の中身を取得します。一方、 `innerText` は「人間が読める」要素のみを示します。
> - `textContent` はノード内のすべての要素を返します。一方、 `innerText` はスタイルを反映し、「非表示」の要素のテキストは返しません。
> - もっと言えば、 `innerText` は CSS のスタイルを考慮するので、 `innerText` の値を読み取ると最新の計算されたスタイルを保証するために [再フロー](https://developer.mozilla.org/ja/docs/Glossary/Reflow) を起動します。 (再フローは計算が重いので、可能であれば避けるべきです。)
> - `textContent` とは異なり、 `innerText` を Internet Explorer (バージョン 11 まで) で変更すると、要素から子ノードを削除するだけでなく、子孫のテキストノードを_完全に破棄します_。他の要素または同じ要素にノードをもう一度挿入することは不可能です。
>
> __[Node.textContent - Web API \| MDN](https://developer.mozilla.org/ja/docs/Web/API/Node/textContent#innertext_%E3%81%A8%E3%81%AE%E9%81%95%E3%81%84)__

## 結局どうしたか

また下記のようなことも書かれていました。

> さらに、textContent を使用することで XSS 攻撃を防ぐことができます。

`innerText`ではなく`textContent`を採用するきかっけになったのは、このためです。
特に`innerText`である理由は無いため、脆弱性を生まないものを利用する方が良いと考えました。

Chromeのコンソールなどで試してみるとわかるのだが、要素の`innerText`を変更するとその要素の`textContent`も変わる。
これは、`@testing-library/dom`がこのブラウザの挙動を再現できていないとも言える。
しかし、その部分を実装してフィードバックするにはかなり大変そうなのでそこには手を出さないでおいた。
