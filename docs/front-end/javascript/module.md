---
title: 模块化
---

## 明白 JS 模块化
说到JavaScript的模块化，基本都会提到CommonJs，AMD，CMD，ES6的模块化解决方案。在研究他们如何实现模块化之前，我们得理解 JavaScript 实现模块化的原理是什么。

### 模块化是什么，有什么用？
模块化就是将一个大的功能拆分为多个块，每一个块都是独立的，你不需要去担心污染全局变量，命名冲突什么的。

那么模块化的好处也就显然易见了
- 解决命名冲突
- 依赖管理
- 代码更加可读
- 提高复用性

这里有另外一个大神的PPT上是这么写为何需要模块化的
- Web sites are turning into Web Apps
- Code complexity grows as the site gets bigger
- Highly decoupled JS files/modules is wanted
- Deployment wants optimized code in few HTTP calls

## 第一日 上古时期
从设计模式说起

### 函数封装

这个嘛，谁都会，最大的缺点就是污染全局作用域了
```js
function fn1() {
    // balabalabala
}
function fn2() {
    // balabalabala
}
```

### 简单封装：Namespace 模式

```js
var myModule = {
    var1: 1,
    fn1: function() {}
}
```
- 减少 Global 上的变量数目
- 本质是对象，一点都不安全

### 匿名闭包 ：IIFE 模式

这个嘛，高级了点，并且也有了模块化的意思，这种写法在老项目中很常见，一个 JS 文件中就是一个立即执行函数
```js
var Module = (function(){
    var _private = "safe now";
    var foo = function(){
        console.log(_private)
    }

    return {
        foo: foo
    }
})()

Module.foo();
Module._private; // undefined
```

再增强一点 ：引入依赖
```js
var Module = (function($){
    var _$body = $("body");     // we can use jQuery now!
    var foo = function(){
        console.log(_$body);    // 特权方法
    }

    // Revelation Pattern
    return {
        foo: foo
    }
})(jQuery)

Module.foo();
```

这就是 **==模块模式==** 也是现代模块实现的基石

立即执行函数有什么作用？只有一个作用：创建一个独立的作用域。  
通过定义一个匿名函数，创建了一个新的函数作用域，相当于创建了一个“私有”的命名空间，该命名空间的变量和方法，不会破坏污染全局的命名空间。

## 第二日 石器时代

> SCRIPT LOADER  
> 只有封装性可不够，我们还需要加载

Let's Back To Script Tags
```js
body
    script(src="jquery.js")
    script(src="app.js")    // do some $ things...
```

- Order is essential
- Load in parallel
- DOM 顺序即执行顺序

但现实是这样的…
```js
body
    script(src="zepto.js")
    script(src="jhash.js")
    script(src="fastClick.js")
    script(src="iScroll.js")
    script(src="underscore.js")
    script(src="handlebar.js")
    script(src="datacenter.js")
    script(src="deferred.js")
    script(src="util/wxbridge.js")
    script(src="util/login.js")
    script(src="util/base.js")
    script(src="util/city.js")
    script(src="util/date.js")
    script(src="util/cookie.js")
    script(src="app.js")
```
- 难以维护 Very difficult to maintain!
- 依赖模糊 Unclear Dependencies
- 请求过多 Too much HTTP calls

### LABjs - Script Loader (2009)
**Loading And Blocking JavaScript**

::: tip
Using LABjs will replace all that ugly "script tag soup"
:::

How Does It Works?
```js
script(src="LAB.js" async)

$LAB.script("framework.js").wait()
    .script("plugin.framework.js")
    .script("myplugin.framework.js").wait()
    .script("init.js");
```

Executed in parallel  
First-come, First-served(when execution order is not important)

```js
$LAB
.script( [ "script1.js", "script2.js", "script3.js"] )
.wait(function(){ // wait for all scripts to execute first
    script1Func();
    script2Func();
    script3Func();
});
```
Dependency Management  
LABjs做到了基于文件的依赖管理

## 第三日 蒸汽朋克
> MODULE LOADER  
> 模块化架构的工业革命

**YUI3 Loader - Module Loader (2009)**
> YUI's lightweight core and modular architecture make it scalable, fast, and robust.

回顾昔日王者的风采:
```js
// YUI - 编写模块
YUI.add('dom', function(Y) {
  Y.DOM = { ... }
})

// YUI - 使用模块
YUI().use('dom', function(Y) {
  Y.DOM.doSomeThing();
  // use some methods DOM attach to Y
})
```

Creating Custom Modules
```js
// hello.js
YUI.add('hello', function(Y){
    Y.sayHello = function(msg){
        Y.DOM.set(el, 'innerHTML', 'Hello!');
    }
},'3.0.0',{
    requires:['dom']
})

// main.js
YUI().use('hello', function(Y){
    Y.sayHello("hey yui loader");
})
```

Still "Script Tag Soup"?  
YUI下的文件加载  
```js
script(src="/path/to/yui-min.js")       // YUI seed
script(src="/path/to/my/module1.js")    // add('module1')
script(src="/path/to/my/module2.js")    // add('module2')
script(src="/path/to/my/module3.js")    // add('module3')
```
```js
YUI().use('module1', 'module2', 'module3', function(Y) {
    // you can use all this module now
});
```
- 你不再需要按照执行顺序写script标签  you don't have to include script tags in a set order
- 加载和执行分开  separation of loading from execution


YUI做到了基于模块的依赖管理  
漏了一个问题？ **==Too much HTTP calls==**  

**YUI Combo**  
How Combo Works
```js
script(src="http://yui.yahooapis.com/3.0.0/build/yui/yui-min.js")
script(src="http://yui.yahooapis.com/3.0.0/build/dom/dom-min.js")
变为
script(src="http://yui.yahooapis.com/combo?
    3.0.0/build/yui/yui-min.js&
    3.0.0/build/dom/dom-min.js")
```
Serves multiple files in a single request  
GET 请求，需要服务器支持


## 第四日 号角吹响
> COMMONJS  
> 征服世界的第一步是跳出浏览器

**CommonJS - API Standard (2009.08)**
javascript: not just for browsers any more!
```js
// a.js
module.exports = {
    a: 1
}
// or 
exports.a = 1

// b.js
var module = require('./a.js')
module.a // -> log 1
```

Synchronously
```js
// timeout.js
var EXE_TIME = 2;

(function(second){
    var start = +new Date();
    while(start + second*1000 > new Date()){}
})(EXE_TIME)

console.log("2000ms executed")

// main.js
require('./timeout');   // sync load
console.log('done!');
```
**同步/阻塞式加载**

## 第五日 双塔奇兵
> AMD/CMD
> 浏览器环境模块化方案

分歧和冲突
- Modules/Async
- Modules/Wrappings
- Modules/Transport

**AMD(Async Module Definition)**  
RequireJS 对模块定义的规范化产出

**CMD(Common Module Definition)**  
SeaJS 对模块定义的规范化产出


### RequireJS - AMD Implementation (2011)  

> JavaScript file and module loader.  
> It is optimized for in-browser use

If require() is async?
```js
//CommonJS Syntax
var Employee = require("types/Employee");

function Programmer (){
    //do something
}

Programmer.prototype = new Employee();

// 如果 require call 是异步的，那么肯定 error
// 因为在执行这句前 Employee 模块根本来不及加载进来
```
this code will not work

Function Wrapping
```js
//AMD Wrapper
define(
    ["types/Employee"],  //依赖
    function(Employee){  //这个回调会在所有依赖都被加载后才执行
        function Programmer(){
            //do something
        };

        Programmer.prototype = new Employee();
        return Programmer;  //return Constructor
    }
)
```

AMD vs CommonJS  
1. 书写风格
```js
// Module/1.0
var a = require("./a");  // 依赖就近
a.doSomething();

var b = require("./b")
b.doSomething();

// AMD recommended style
define(["a", "b"], function(a, b){ // 依赖前置
    a.doSomething();
    b.doSomething();
})
```

2. 执行时机
```js
// Module/1.0
var a = require("./a");  // 执行到此时，a.js 同步下载并执行

// AMD with CommonJS sugar
define(["require"], function(require){
    // 在这里， a.js 已经下载并且执行好了
    var a = require("./a")
})
```
Early Download, Early Executing


### SeaJS - CMD Implementation (2011)  

> Extremely simple experience of modular development

More like CommonJS Style
```js
define(function(require, exports, module) {
  var $ = require('jquery');

  exports.sayHello = function() {
    $('#hello').toggle('slow');
  };
});
```

AMD vs CMD - the truly different  
Still Execution Time
```js
// AMD recommended
define(['a', 'b'], function(a, b){
    a.doSomething();    // 依赖前置，提前执行
    b.doSomething();
})
```
```js
// CMD recommended
define(function(require, exports, module){
    var a = require("a");
    a.doSomething();
    var b = require("b");
    b.doSomething();    // 依赖就近，延迟执行
})
```
Early Download, Lazy Executing


### RequireJS 最佳实践
Use Case
```js
require([
    'React',    // 尽量使用 ModuleID
    'IScroll',
    'FastClick'
    'navBar',   // 和同目录下的 js 文件
    'tabBar',
], function(
    React,      // Export
    IScroll
    FastClick
    NavBar,
    TabBar,
) {
```

Config
```js
require.config({
    // 查找根路径，当加载包含协议或以/开头、.js结尾的文件时不启用
    baseUrl: "./js",
    // 配置 ModuleID 与 路径 的映射
    paths: {
        React: "lib/react-with-addons",
        FastClick: "http://cdn.bootcss.com/fastclick/1.0.3/fastclick.min",
        IScroll: "lib/iscroll",
    },
    // 为那些“全局变量注入”型脚本做依赖和导出配置
    shim: {
        'IScroll': {
            exports: "IScroll"
        },
    },
    // 从 CommonJS 包中加载模块
    packages: [
        {
            name: "ReactChart",
            location: "lib/react-chart",
            main: "index"
        }
    ]
})
```

Optimized Build
```js
node r.js -o build.js
```

```js
// build.js
// 简单的说，要把所有配置 repeat 一遍
({
    appDir: './src',
    baseUrl: './js',
    dir: './dist',
    modules: [
        {
            name: 'app'
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        React : "lib/react-with-addons",
        FastClick: "http://cdn.bootcss.com/fastclick/1.0.3/fastclick.min",
        IScroll: "lib/iscroll"
    },
    shim: {
        'IScroll': {
            exports: "IScroll"
        },
    },
    packages: [
        {
            name: "ReactChart",
            location: "lib/react-chart",
            main: "index"
        }
    ]
})
```

## 第六日 精灵宝钻
> BROWSERIFY/WEBPACK
> 大势所趋，去掉这层包裹！

**NPM**  
Node Package Manger  
Browsers don't have the require method defined,
but Node.js does.

Browserify - CommonJS In Browser  (2011 / 2014 stable)  
require('modules') in the browser by bundling up all of your dependencies

Install  
`npm install -g browserify`  
Actually You Need Do Nothing But Write CommonJS Code!
```
# magic just happened!
$ browserify main.js -o bundle.js
```

Browserify parses the AST for require() calls to traverse the entire dependency graph of your project.  
AST: Abstract Syntax Tree

每一次改动都需要手动 recompile ？  
No, auto-recompile.  
Watch - Watchify  
``` npm install -g watchify ```

```
# WATCH!
$ watchify app.js -o bundle.js -v
```

Build 后要如何 Debug  
Source Map  
逆向所有合并、压缩、混淆！
```
# debug mode
$ browserify main.js -o bundle.js --debug
```

**Webpack - Module Bundler (2014)**  
transforming, bundling, or packaging just about any resource or asset

Webpack For Browserify Users  
```sh
# These are equivalent(相同的):
$ browserify main.js > bundle.js
$ webpack main.js bundle.js
```
BUT
```js
// better with a webpack.config.js
module.exports = {
    entry: "./main.js",
    output: {
        filename: "bundle.js"
    }
}
```

Simple CLI
```sh
# make sure your directory contains webpack.config.js

# Development: debug + devtool + source-map + pathinfo
webpack main.js bundle.js -d

# Production: minimize + occurence-order
webpack main.js bundle.js -p

# Watch Mode
webpack main.js bundle.js --watch
```
Everything is already there!

**Browserify vs Webpack**
小而美 VS 大而全

来源： [JavaScript 模块化七日谈](https://huangxuan.me/js-module-7day/)


## ES6 模块与 CommonJS 模块的差异

1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
- ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的import有点像 Unix 系统的“符号连接”，原始值变了，import加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。
2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- 运行时加载: CommonJS 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。
- 编译时加载: ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，import时采用静态命令的形式。即在import时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”。

CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。
