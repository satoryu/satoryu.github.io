---
title: Spring BootでjOOQを使えるようにする
excerpt: |
  Spring BootでjOOQを使えるようにしようとしたところ、シンプルなところでつまづいてしまったので、それについてのメモ。
category: blog
tags:
  - Spring Boot
  - jOOQ
  - Java
---

Spring BootでjOOQを使えるようにしようとしたところ、シンプルなところでつまづいてしまったので、それについてのメモ。

## jOOQについて

Javaで使えるORM の1つ。
データベースのテーブルスキーマからORMとなるJavaのコードを生成することができる。

これとは別にデータベースのスキーマ管理でflywayを利用することで、データベースの状態管理とそれにアクセスするためのコードを自動で得ることができる。
つまり、flywayでテーブルを生成し、そのテーブルからjOOQのコードジェネレーターでORMのコードを生成できる。

## 導入で躓いたところ

Spring Bootの公式ドキュメントに、jOOQを使う方法があるので、それに倣って、コントローラーを実装した。
[Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#data.sql.jooq)

```java
package com.satoryu.MyFirstSpringBoot;

import com.satoryu.MyFirstSpringBoot.tables.Article;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.jooq.DSLContext;

import java.util.List;
import java.util.stream.Collectors;


@Controller
public class ArticleController {
    private final DSLContext create;

    @Autowired
    public ArticleController(DSLContext dslContext){
        this.create = dslContext;
    }

    @GetMapping("/article/{id}")
    public String article(Model model, @PathVariable String id) {
      // Something to do here ...
    }
}
```

ここで、`ArticleController`の`dslContext`は、Spring BootのDIの仕組みで自動的にインスタンスがコンストラクタを通じて注入されるものと期待していた。

しかし、`./gradlew bootRun`を実行し、ローカルでサーバーを起動しようとすると下記のエラーが出てしまい、起動できなかった。

```shell
> Task :compileJava
> Task :processResources UP-TO-DATE
> Task :classes
> Task :bootRunMainClassName

> Task :bootRun
00:44:55.869 [Thread-0] DEBUG org.springframework.boot.devtools.restart.classloader.RestartClassLoader - Created RestartClassLoader org.springframework.boot.devtools.restart.classloader.RestartClassLoader@e2fac85

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v2.7.5)

2022-12-03 00:44:56.234  INFO 42993 --- [  restartedMain] a.m.T.MyFirstSpringBootApplication       : Starting MyFirstSpringBootApplication using Java 17.0.5 on satoutatsuyanoMacBook-Pro.local with PID 42993 (/Users/satoutatsuya/Projects/private/MyFirstSpringBoot/build/classes/java/main started by satoutatsuya in /Users/satoutatsuya/Projects/private/MyFirstSpringBoot)
2022-12-03 00:44:56.235  INFO 42993 --- [  restartedMain] a.m.T.MyFirstSpringBootApplication       : No active profile set, falling back to 1 default profile: "default"
2022-12-03 00:44:56.256  INFO 42993 --- [  restartedMain] .e.DevToolsPropertyDefaultsPostProcessor : Devtools property defaults active! Set 'spring.devtools.add-properties' to 'false' to disable
2022-12-03 00:44:56.256  INFO 42993 --- [  restartedMain] .e.DevToolsPropertyDefaultsPostProcessor : For additional web related logging consider setting the 'logging.level.web' property to 'DEBUG'
2022-12-03 00:44:56.770  INFO 42993 --- [  restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2022-12-03 00:44:56.777  INFO 42993 --- [  restartedMain] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2022-12-03 00:44:56.778  INFO 42993 --- [  restartedMain] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.68]
2022-12-03 00:44:56.810  INFO 42993 --- [  restartedMain] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2022-12-03 00:44:56.810  INFO 42993 --- [  restartedMain] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 554 ms
2022-12-03 00:44:56.842  WARN 42993 --- [  restartedMain] ConfigServletWebServerApplicationContext : Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'greetingController' defined in file [/Users/satoutatsuya/Projects/private/MyFirstSpringBoot/build/classes/java/main/aki/moon/MyFirstSpringBoot/GreetingController.class]: Unsatisfied dependency expressed through constructor parameter 0; nested exception is org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type 'org.jooq.DSLContext' available: expected at least 1 bean which qualifies as autowire candidate. Dependency annotations: {}
2022-12-03 00:44:56.844  INFO 42993 --- [  restartedMain] o.apache.catalina.core.StandardService   : Stopping service [Tomcat]
2022-12-03 00:44:56.850  INFO 42993 --- [  restartedMain] ConditionEvaluationReportLoggingListener :

Error starting ApplicationContext. To display the conditions report re-run your application with 'debug' enabled.
2022-12-03 00:44:56.864 ERROR 42993 --- [  restartedMain] o.s.b.d.LoggingFailureAnalysisReporter   :

***************************
APPLICATION FAILED TO START
***************************

Description:

Parameter 0 of constructor in com.satoryu.MyFirstSpringBoot.GreetingController required a bean of type 'org.jooq.DSLContext' that could not be found.


Action:

Consider defining a bean of type 'org.jooq.DSLContext' in your configuration.


BUILD SUCCESSFUL in 7s
5 actionable tasks: 4 executed, 1 up-to-date
0:44:56:  'bootRun' の実行を完了しました。
```

主要なエラーメッセージを抜き出すと、

`Parameter 0 of constructor in com.satoryu.MyFirstSpringBoot.GreetingController required a bean of type 'org.jooq.DSLContext' that could not be found.`

と出ており、どうやら`DSLContext`を依存しているパッケージ内から解決できていないように見える。

```groovy
dependencies {
  implementation 'org.springframework.boot:spring-boot-starter-web'
  testImplementation 'org.springframework.boot:spring-boot-starter-test'
  implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
  developmentOnly 'org.springframework.boot:spring-boot-devtools'
  implementation 'org.jooq:jooq'
  runtimeOnly 'org.postgresql:postgresql:42.5.0'
  jooqGenerator 'org.postgresql:postgresql:42.5.0'
  jooqGenerator("jakarta.xml.bind:jakarta.xml.bind-api:3.0.0")
}
```

依存関係の中に`org.jooq:jooq`を指定しているので、一見すると解決できそうに思える。

## 解決方法

上に書いた主要なエラーメッセージで検索すると、下位のバージョンに変更すると実行できるようになるといったものをいくつか見つけたが、そのとおりにバージョンを指定しても、エラーが変わることは無かった。

そもそもの使い方として何かが足りてないのではないかと思い、公式ドキュメントの中を探したところ、Spring BootにはStarterというものがあることを知った。

- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using.build-systems.starters)

Starterとは、ドキュメントによると
> Starters are a set of convenient dependency descriptors that you can include in your application. You get a one-stop shop for all the Spring and related technologies that you need without having to hunt through sample code and copy-paste loads of dependency descriptors.
つまり、Spring Bootで依存を張ることで使いたい機能や関連する技術が使えるようになるパッケージということのようだ。
そして、その公式のStarterの一覧の中に、`spring-boot-starter-jooq`というものがあるのを見つけた。

これを以下のように依存に加えたところ、エラーがでなくなった。

```groovy
dependencies {
  implementation 'org.springframework.boot:spring-boot-starter-web'
  testImplementation 'org.springframework.boot:spring-boot-starter-test'
  implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
  developmentOnly 'org.springframework.boot:spring-boot-devtools'
  implementation 'org.springframework.boot:spring-boot-starter-jooq' // <= Added
  implementation 'org.jooq:jooq'
  runtimeOnly 'org.postgresql:postgresql:42.5.0'
  jooqGenerator 'org.postgresql:postgresql:42.5.0'
  jooqGenerator("jakarta.xml.bind:jakarta.xml.bind-api:3.0.0")
}
```

ということで、エラーを解決することができた。

Spring Bootのドキュメントはしっかりしていてたくさんあるのだけれど、これから始めるための導入ガイドのようなものがなかなか見当たらなくて難しさを感じる。
Rails Guide的なものは無いのだろうか。
