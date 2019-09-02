---
title: 職務経歴
permalink: /curriculum_vitae/
read_time: false
author_profile: true
toc: true
---

## 2019/07 - 株式会社デンソー

## 2009/04 - 2019/06: 楽天株式会社

### 2017/05 - 現在: 新規 HR Tech&EdTech 立ち上げ

事業として新規で取り組むB2Bビジネスの立ち上げ時に、PoCからサービスイン、その後のサービス改善やお客さんの施策のコンサルティングなどを一貫して実施しました。

プロジェクト開始時点では、サービスのラフなアイデアしか存在していない状況だったので、チームで検証すべき点を洗い出すところか始め、
検証をするためのプロダクト（MVP）を開発し、想定顧客へ往訪してデモとインタビューを繰り返して、サービスのアイデアを検証していきました。
そのための技術選定として、アーキテクチャの変更やミドルウェアの選定が、自分たちの状況に応じて柔軟に行えるように、Microsoft Azureにしました。
仕様言語についても、メンバーでこれまで経験した言語の共通していたPHPを選択しました。
ですが、自分はそれまで5.3までしか経験していなかったため、モブプログラミングの中で積極的にドライバーを担当することで最新の書き方やお作法についてキャッチアップしていきました。

サービスインの際には、お客さんに対して、導入時の従業員の方々へのアナウンスや呼びかけ方、導入時のKPIを決めやサポート体制について議論し、お客さんの企業に現れるであろう混乱をなるべく小さくすることに努めました。
定期的な往訪を実施することで、お客さんの要望のヒアリング、悩み事の相談、また開発及びリリースの調整を、確約できる範囲で行うことができ、お客さんの期待値に応え続けることができました。
また、その際に、単なる頼まれたことをするのではなく、お客さんにとってその時点での最大の問題に対して最大の価値を提供できるようにしていました。
その結果、3度の契約更新に繋げることができました。

- 職務: エンジニア
  - アーキテクチャ設計、構築
  - 設計
  - テスト
  - 営業
  - サービス運用
  - カスタマーサポート
  - プログラミング
  - データ分析
  - ファシリテーション
- 技術要素
  - PHP
  - Laravel
  - Docker
  - Microsoft Azure
    - Azure WebApps
    - Azure Functions
    - Azure Storage
    - Azure Cosmos Db
    - Azure SQL Database
    - Azure Redis Cache
  - Git
  - アジャイル開発
  - モブプログラミング

### 2018/07 - 2018/09: ビジネス配属新卒向けエンジニア研修

ビジネス配属新卒へエンジニア研修での、メンターとして参加。
チーム開発のサポートや使用した技術の支援を実施。

- 職務: メンター
  - 技術サポート
  - 研修運営
- 技術要素
  - PHP
  - Java
  - Microsoft Azure
  - MySQL
  - Windows
  - Visual Studio Code
  - Scrum
  - アジャイル開発

### 2016/11 - 2017/04: 新規 CtoC シェアリングエコノミーサービス立ち上げ

これまでスクラムを実践してきて、小さく確実にリリースをし、フィードバックをもらいながら次のリリースにつなげていくことを楽しいと思っていました。
その一方で、社内サービスばかりだったため、カスタマー向けのサービスの開発に携わりたいという気持ちあありました。
そこで、社内公募制度を利用し、新規事業部門に異動しました。
リリースまでの短いスケジュールに間に合わせるべくチーム全体がアプリケーション開発に注力する中で、 まだ整備されていなかったインフラ関連を担当しました。

チームに入ったばかりだったので、それまでドキュメントとしてしか存在しなかった開発環境構築を一通り実行しつつ、
それを自動でセットアップできるうようにスクリプトを作成しました。
メンバーが使用しているOSがWindowsとMacが混在していたため、Dockerを使い環境を統一することを試みました。
ミドルウェアのイメージとバージョンを揃え、初期設定を行うためのスクリプト作成することで、開発環境に不具合が出たときにすぐに戻せる状況にしました。
開発環境を整える中で、テストの自動実行可能にするために必要な依存を洗い出し、JenkinsサーバーでGitリポジトリにプッシュされた
ブランチを随時テストを自動でしかけるようにしました。

それと並行して、本番環境と検証環境のサーバー調達とセットアップをし、アプリケーションをデプロイするための手順を作成しました。
当時、チーム内で毎朝最新のmasterブランチを探索テストする習慣があったので、常に検証環境をmasterの最新に保てるように、
Jenkinsで自動的にビルドとデプロイを実行するように仕掛けました。

他にも下記のようなシステムの設定を行いました。

- Datadogによる監視の設定
- Splunkによるログ収集とアラート検知の仕組みを構築
- RethinkDBのクラスタのデプロイ、チューニング

- 職務: サーバーサイドエンジニア
  - システム構築
  - システム設計
  - 開発環境構築
  - コードレビュー
- 技術要素
  - Java
  - Spring Boot
  - Docker
  - Datadog
  - Splunk
  - Elasticsearch
  - RethinkDB
  - MySQL
  - Jenkins
  - Scrum

### 2016/07 - 2016/11: インシデントレポートシステムのリプレイス

- 職務: エンジニアリーダー
  - 開発プロセス改善
  - システム環境改善
  - プロダクト
- 技術要素
  - Ruby
  - Ruby on Rails
  - Redmine
  - Docker
  - Capistrano
  - HipChat

### 2013/02 - 2016/06: 社内サービスの新旧リプレイス、運用

外注し、納品されたままのレガシーな社内サービスのリプレイス、その後の開発・運用の中で、エンジニア兼スクラムマスターとして携わりました。

ドキュメントが残されていない状況から可動しているサービスを直接操作した上で、仕様を特定していったり、バックエンドの一部であったActive Directoryの中を調査することで、外部仕様と内部仕様を特定するところからはじめました。
それらの状態から最低限担保すべき部分を特定し、Ruby on Railsでスクラッチから構築しました。

開発する中で必要となったライブラリの変更は、Pull Requestを送ことを続けるようにしていました。
当時、RubyからActive Directoryを操作している事例が少なかったため、いくつかのバグや機能としての不備があったので、それらをフィードバックしました。

- [Bugfix/filter parser fails to parse blackets by satoryu · Pull Request #157 · ruby-ldap/ruby-net-ldap](https://github.com/ruby-ldap/ruby-net-ldap/pull/157)
- [Bug Fix: Fails to generate filter parser when given string includes multibyte chars. by satoryu · Pull Request #66 · ruby-ldap/ruby-net-ldap](https://github.com/ruby-ldap/ruby-net-ldap/pull/66)
- [Specific errors subclassing Net::LDAP::Error by satoryu · Pull Request #183 · ruby-ldap/ruby-net-ldap](https://github.com/ruby-ldap/ruby-net-ldap/pull/183)
- [Raise Net::LDAP::ConnectionRefusedError when new connection is refused. by satoryu · Pull Request #213 · ruby-ldap/ruby-net-ldap](https://github.com/ruby-ldap/ruby-net-ldap/pull/213)
- [Net::LDAP#encryption accepts string by satoryu · Pull Request #239 · ruby-ldap/ruby-net-ldap](https://github.com/ruby-ldap/ruby-net-ldap/pull/239)
- [Drop support for ruby 1.9.3 by satoryu · Pull Request #240 · ruby-ldap/ruby-net-ldap](https://github.com/ruby-ldap/ruby-net-ldap/pull/240)

システムリプレイスの際には、並行稼動期間を設けたり、新規サービスに問題があった際にすぐに戻せるようにリカバリ対策を備えておくなどをし、ユーザー影響を最小限にすることに専念しました。

- 職務: エンジニア、スクラムマスター
- 技術要素
  - Ruby
  - Ruby on Rails
  - Redis
  - MySQL
  - Jenkins
  - Capistrano
  - Ansible
  - Scrum
  - LDAP
  - Active Directory

### 2011/09 - 2013/01: プライベート PaaS 環境構築、運用

- 職務: エンジニア
  - 導入支援
  - 開発
  - システム設計
  - テスト
  - 運用
- 技術要素
  - Ruby
  - Node.js
  - Ruby on Rails
  - Cloud Foundry
  - Chef
  - MongoDB
  - Redis
  - VMware

### 2010/05 - 2011/09: 出店者向け動画サービスの開発、運用

- 職務: エンジニア
  - 商用ツールの比較検討
  - 開発
  - テスト
  - 運用
- 技術要素
  - PHP
  - Kohana
  - MySQL

### 2010/05 - 2011/08: 新規プライベート画像ストレージサービスの開発、運用

### 2009/04 - 2010/04: 市場ユーザー向け商品通知サービスの開発、運用
