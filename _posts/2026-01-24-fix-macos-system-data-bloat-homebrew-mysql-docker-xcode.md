---
title: Macの「システムデータ」が大きすぎる原因と減らし方（Homebrew/Docker/Xcode開発者向け）
category: blog
excerpt: Macの「システムデータ」が300GBを占有。duコマンドで原因を特定し、Homebrew配下のMySQL残骸（32GB）やDocker、lima VMなどを削除して130GB空き容量を確保した手順を紹介。
header:
  overlay_filter: rgba(35, 35, 35, 0.2)
tags:
  - macOS
  - Homebrew
  - MySQL
  - Docker
  - Xcode
  - ストレージ管理
---

現在プライベートで使用しているMacBook Proのストレージ（500GB）のうち、「システムデータ」が約300GBを占有してしまっていた。
この空き容量を増やすため、ChatGPTに相談しながら実際にやった調査と削減の手順と実際に実行したコマンドを記録しておく。

> **結論：**
> 「システムデータ」の正体は単一ではなく、スナップショット、開発環境、VM、キャッシュ、バックアップなどが混在している領域だった。
> 今回の主な原因はHomebrew配下に残っていたMySQLのデータディレクトリ（32GB） で、最終的に 約130GBの空き容量を確保できた。

## 「システムデータ」が肥大化する原因

ChatGPTによると、Finderのストレージ表示でいう「システムデータ」には以下が混ざっているという。

- APFSスナップショット（Time Machine / OSアップデートの巻き戻し用）
- 開発者ツールのキャッシュ（Xcode、Simulator、Android SDK、node系など）
- Dockerなど仮想環境のディスクイメージ
- iPhone/iPadローカルバックアップ
- アプリのコンテナ／Application Supportの巨大データ

なので、上記を順番に該当するのか確認しながら対応していくことにした。

## APFSスナップショットを確認する

ローカルスナップショットが肥大化してると「システムデータ」に乗るということで、最初に確認した。

### スナップショット一覧を見る

```bash
tmutil listlocalsnapshots /
```

今回出たのはこんな感じ（Time Machine系じゃなくてOS更新系っぽい）：

```
Snapshots for volume group containing disk /:
com.apple.os.update-...
com.apple.os.update-...
com.apple.os.update-MSUPrepareUpdate
```

ChatGPTにこの結果について聞くと、`com.apple.os.update-*` はmacOSアップデートの巻き戻し用途の可能性が高いという指摘だった。
「システム設定」でアップデートを確認すると、macOSのアップデートが残っていた。
ソフトウェアアップデートを完了させ、`tmutil` で再度スナップショットを確認したところ、スナップショットの表示は消えた。
しかし、システムデータ自体はまだ300GB弱残っていたので、主犯は別にいるということで次の候補を確認した。

## ディスクユーティリティでスナップショットを確認する

スナップショットが原因じゃないことを判断するために確認した。

具体的には、まず「ディスクユーティリティ」を開き、APFSスナップショット表示させる。
`Macintosh HD - Data` 側にスナップショットが無いか確認した。

確認したところ、Data側のスナップショットが無かった。
そこで次に、実体の大容量ディレクトリを探りながら確認していった。

## ~/Libraryのキャッシュを確認・削除する

「システムデータ」の正体がユーザー領域（`~/Library`）に潜んでることは多いので、最初に軽く見る。

### `/Library/Caches` を削除

```bash
du -sh ~/Library/Caches/* | sort -h | tail -n 20
```

これはキャッシュのみが保存されているディレクトリなので、無条件で削除した。

### Application Support の上位を確認

```bash
du -sh ~/Library/Application\ Support/* 2>/dev/null | sort -h | tail -n 20
```

ここで、数GB〜十数GBレベルのもの（HomebrewキャッシュやGoogle、Notionなど）が見つかった。
ただ、合計しても40GB程度なので、300GBには届かない。
そこで、もっと上位（ルート寄り）から掘る必要がある。

## duコマンドで大容量ディレクトリを特定する

全体構造を一気に掴むため、 `/System/Volumes/Data` 直下のサイズの大きいものを調べた。

```bash
sudo du -xhd 1 /System/Volumes/Data | sort -h | tail -n 30
```

今回の上位は

* `/System/Volumes/Data/Users` **179G**
* `/System/Volumes/Data/Applications` **55G**
* `/System/Volumes/Data/opt` **45G**
* `/System/Volumes/Data/Library` **34G**
* `/System/Volumes/Data/private` **13G**

`/opt`とUsers（特に `~/Library`）の中を優先して削除候補を探していくことにした。

## Homebrewのvarディレクトリに残ったDBデータを削除する

Homebrewの本体は普通 `Cellar` のサイズが大きくなると予想されたが、今回は違った。

### /opt の内訳

```bash
sudo du -xhd 1 /opt | sort -h | tail -n 30
```

```
44G /opt/homebrew
```

さらにHomebrewの内訳を調べた。

```bash
sudo du -xhd 1 /opt/homebrew | sort -h | tail -n 30
```

ここで上位に出てきたのが、以下の2つだった。

* `/opt/homebrew/Cellar` **10G**
* `/opt/homebrew/var` **32G**

`var`、 つまりサービスのデータが肥大化していると考えられる。

さらにその内訳を調べてみた。

```bash
sudo du -xhd 1 /opt/homebrew/var | sort -h | tail -n 50
```

するとMySQLのディレクトリがほとんどを占めていた。

```
32G /opt/homebrew/var/mysql
```

`brew`コマンドで念の為今は使用していないことを確認した。

```bash
brew list --formula | egrep '^(mysql|mysql@|mariadb)$' || true
```

何も出てこなかったので、現在このMacbookにはインストールされていないことがわかった。

念の為、それ以外の経由でもmysqlが存在していないかを、デフォルトのポート番号3306使用しているプロセスが存在しないか確認した。

```bash
lsof -iTCP:3306 -sTCP:LISTEN || true
```

```bash
ps aux | egrep 'mysqld|mariadbd' | grep -v egrep || true
```

ここまでで何も出てこなかったので、使ってないデータディレクトリだけ残っていると判断した。


```bash
rm -rf /opt/homebrew/var/mysql
```

## lima/colimaの不要なVMを削除する

`sudo du -xhd 1 /Users/<user>` で見つかった大物のひとつが `~/.lima`。
これは、以前にLinux上でないと動かせないDockerイメージを利用する必要があったため使用していたcolimaのVMの残りだった。
もう使ってないので、 `limactl delete` で不要なVMを削除した。

## ~/Libraryの大容量ディレクトリを特定する

`~/Library` の直下ランキングで、どこが太いか確定させた。

```bash
sudo du -xhd 1 /Users/satoutatsuya/Library 2>/dev/null | sort -h | tail -n 40
```

* `~/Library/Application Support` **28G**
* `~/Library/Containers` **23G**
* `~/Library/Developer` **14G**
* `~/Library/Android` **12G**
* `~/Library/pnpm` **1.8G**

## Containersディレクトリを確認する

### Containersの中にDockerを発見

```bash
sudo du -xhd 1 "$HOME/Library/Containers" | sort -h | tail -n 50
```

* `com.docker.docker` **19G**
* `com.microsoft.teams2` 1.5G

Dockerのコンテナイメージなどがディスクを食っていそうなことがわかった。

## Docker Desktopのディスク使用量を削減する

まず状況確認をした。

```bash
docker system df
```

キャッシュ削除と未使用イメージ、コンテナ、ボリュームを削除した。

```bash
docker builder prune -a
docker system prune -a --volumes
```

## Xcodeシミュレータのキャッシュを削除する

ChatGTP曰く、Xcode関連で使用されるディレクトリ類らしい。
実際に以下を実施した。

```bash
xcrun simctl delete unavailable
rm -rf ~/Library/Developer/CoreSimulator/Caches
du -sh ~/Library/Developer/CoreSimulator
```

結果、1GBくらい削除できた。
iOSシミュレータの本体は `Devices`ディレクトリにあるので、もっと空き容量を作るには `Devices` を消す必要があるらしい。
今回はそこまで手を入れなかった。

## macOSのシステムデータを減らす手順まとめ

1. `tmutil listlocalsnapshots /` でスナップショット確認（OS更新系ならまずアップデート完了）
2. `sudo du -xhd 1 /System/Volumes/Data ...` で「どこが太いか」決め打ち
3. `sudo du -xhd 1 /opt/homebrew ...` → `var` が太いならサービスデータ（DBなど）疑う
4. `/opt/homebrew/var/mysql` みたいな “残骸datadir” を、起動確認してから削除
5. `~/Library` を分解して、内容を確認

## まとめ：開発環境の残骸がシステムデータを圧迫していた

今回、最終的に130GBくらい空きが増えた。
「システムデータ」って名前のせいで“OSが食ってる？”と誤解していたが、実態は開発環境や仮想環境の残骸が原因だった。

同じ症状の人は、まず `/System/Volumes/Data` を `du` で分解して見ていくことをおすすめします。
