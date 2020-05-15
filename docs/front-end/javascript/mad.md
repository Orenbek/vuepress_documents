
## new
<font size=4>

1. 新生成一个对象并且对对象进行初始化
2. 链接到原型
3. 绑定this
4. 返回这个对象

我们也可以试着来自己实现一个 new
```
function New() {
    let obj = {}
    const objClass = [].shift.call(arguments)
    const params = [].concat.call(arguments)
    // attention! js中arguments不是一个数组 是一个类数组 不能用数组方法
    // 因此这里不能直接用arguments.shift() 
    // 上面 [].shift.call(arguments) 等于 Array.prototype.shift.call(arguments)
    // 通常用 var args = Array.prototype.slice.apply(arguments) 语句来把函数参数转换成一个数组
    if (objClass.prototype !== null) {
        obj.__proto__ = objClass.prototype
    }
    const ret = objClass.apply(obj, params)
    if ((typeof ret === 'object' || typeof ret === 'function') && ret !== null) {
        return ret
    }
    // 如果函数没有返回对象类型，那么new表达式中的函数将会返回该对象
    return obj
}
```
</font>

## instanceof
<font size=4>

instanceof 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 prototype。

我们也可以试着实现一下 instanceof

```
function Instanceof(instance, targetClass) {
    if (!instance.__proto__) {
        return false
    }
    // instanceof 判断的对象均需为对象
    
    // 获得类型的原型
    let prototype = targetClass.prototype
    // 获得对象的原型
    instance = instance.__proto__
    // 判断对象的类型是否等于类型的原型
    while (true) {
    	if (instance === null)
    		return false
    	if (prototype === instance)
    		return true
    	instance = instance.__proto__
    }
}
```
</font>

## this
<font size=4>

四中绑定规则：
1. 默认绑定
2. 隐式绑定
3. 显式绑定（call、apply、bind）
4. new 绑定

</font>

## 闭包
<font size=4>
闭包的定义很简单：函数 A 返回了一个函数 B，并且函数 B 中使用了函数 A 的变量，函数 B 就被称为闭包。

```
function A() {
  let a = 1
  function B() {
      console.log(a)
  }
  return B
}
```
你是否会疑惑，为什么函数 A 已经弹出调用栈了，为什么函数 B 还能引用到函数 A 中的变量。因为函数 A 中的变量这时候是存储在堆上的。现在的 JS 引擎可以通过逃逸分析辨别出哪些变量需要存储在堆上，哪些需要存储在栈上。

经典面试题，循环中使用闭包解决 var 定义函数的问题
```
for ( var i=1; i<=5; i++) {
	setTimeout( function timer() {
		console.log( i );
	}, i*1000 );
}
```

第一种使用闭包
```
for (var i = 1; i <= 5; i++) {
  (function(j) {
    setTimeout(function timer() {
      console.log(j);
    }, j * 1000);
  })(i);
}
```

第二种就是使用 `setTimeout` 的第三个参数
```
for ( var i=1; i<=5; i++) {
	setTimeout( function timer(j) {
		console.log( j );
	}, i*1000, i);
}
```

第三种就是使用 let 定义 i 了
```
for ( let i=1; i<=5; i++) {
	setTimeout( function timer() {
		console.log( i );
	}, i*1000 );
}
```

</font>

## 深浅拷贝
<font size=4>
深浅拷贝是值对对象类型进行不同深度的复制

#### 浅拷贝
首先可以通过 Object.assign 来解决这个问题。
```
let a = {
    age: 1
}
let b = Object.assign({}, a)
a.age = 2
console.log(b.age) // 1
```

当然我们也可以通过展开运算符（…）来解决
```
let a = {
    age: 1
}
let b = {...a}
a.age = 2
console.log(b.age) // 1
```

通常浅拷贝就能解决大部分问题了，但是当我们遇到如下情况就需要使用到深拷贝了
```
let a = {
    age: 1,
    jobs: {
        first: 'FE'
    }
}
let b = {...a}
a.jobs.first = 'native'
console.log(b.jobs.first) // native
```
浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话，那么就又回到刚开始的话题了，两者享有相同的引用。要解决这个问题，我们需要引入深拷贝。

#### 深拷贝
这个问题通常可以通过 JSON.parse(JSON.stringify(object)) 来解决。
但是该方法也是有局限性的：

- 会把 undefined 转换为 null (JSON格式中没有undefined格式)
- 会忽略 symbol
- Date 对象会转换为字符串
- RegExp 对象会转换为空对象
- 不能序列化函数
- 不能解决循环引用的对象

###### for...in 加递归

```

function isObj(obj) {
    return (typeof obj === 'object' || typeof obj === 'function') && obj !== null
}
function deepCopy(obj) {
    let tempObj = Array.isArray(obj) ? [] : {}
    for(let key in obj) {
        tempObj[key] = isObj(obj[key]) ? deepCopy(obj[key]) : obj[key]
    }
    return tempObj
}
```
这两个方法都无法拷贝 ==函数==，==Date==，==RegExp== 类型的对象。
> ==注意！Date和RegExp类型的变量都是对象 不是基本类型！不过这些特殊的对象，不是值引用，而是值复制。也就是说不是所有的对象都是值引用！==

因为这两个值类型是对象，但是又不能通过for in进行遍历，因此这里会出问题。最后的结果是这函数返回的值中两个类型都会转为空的对象

另外以上两个方法都无法解决环的问题

###### 解决环引用的问题
可以使用一个 `WeakMap` 结构存储已经被拷贝的对象，每一次进行拷贝的时候就先向 `WeakMap` 查询该对象是否已经被拷贝，如果已经被拷贝则取出该对象并返回，将deepCopy函数改造成如下：
```
function deepCopy(obj, hash = new WeakMap()) {
    if(hash.has(obj)) return hash.get(obj)
    let cloneObj = Array.isArray(obj) ? [] : {}
    hash.set(obj, cloneObj)
    for (let key in obj) {
        cloneObj[key] = isObj(obj[key]) ? deepCopy(obj[key], hash) : obj[key];
    }
    return cloneObj
}
```
到此为止，这函数仍然有bug，比如支持特殊对象的拷贝。
```
// 只解决date，reg类型，其他的可以自己添加

function deepCopy(obj, hash = new WeakMap()) {
    let cloneObj
    let Constructor = obj.constructor
    switch(Constructor){
        case RegExp:
            cloneObj = new Constructor(obj)
            break
        case Date:
            cloneObj = new Constructor(obj.getTime())
            break
        default:
            if(hash.has(obj)) return hash.get(obj)
            cloneObj = new Constructor()
            hash.set(obj, cloneObj)
    }
    for (let key in obj) {
        cloneObj[key] = isObj(obj[key]) ? deepCopy(obj[key], hash) : obj[key];
    }
    return cloneObj
}
```

上述代码依旧没有解决函数的拷贝，当然JavaScript中的坑还有很多，比如如何拷贝不可枚举属性，如何拷贝Error对象等等的坑。

</font>

## 模块化
<font size=4>

#### 明白 JS 模块化
说到JavaScript的模块化，基本都会提到CommonJs，AMD，CMD，ES6的模块化解决方案。在研究他们如何实现模块化之前，我们得理解 JavaScript 实现模块化的原理是什么。

###### 模块化是什么，有什么用？
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

#### 第一日 上古时期
从设计模式说起

###### 函数封装
这个嘛，谁都会，最大的缺点就是污染全局作用域了
```
function fn1() {
    // balabalabala
}
function fn2() {
    // balabalabala
}
```
###### 简单封装：Namespace 模式
这个嘛，也是谁都会的，最大的缺点就是没有私有变量，外部能改
```
var myModule = {
    var1: 1,
    fn1: function() {}
}
```
###### 匿名闭包 ：IIFE 模式
这个嘛，高级了点，并且也有了模块化的意思，这种写法在老项目中很常见，一个 JS 文件中就是一个立即执行函数
```
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
```
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

#### 第二日 石器时代
> SCRIPT LOADER  
> 只有封装性可不够，我们还需要加载

Let's Back To Script Tags
```
body
    script(src="jquery.js")
    script(src="app.js")    // do some $ things...
```
- Order is essential
- Load in parallel
- DOM 顺序即执行顺序

但现实是这样的…
```
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

###### LABjs - Script Loader (2009)
Loading And Blocking JavaScript
> Using LABjs will replace all that ugly "script tag soup"

How Does It Works?
```
script(src="LAB.js" async)

$LAB.script("framework.js").wait()
    .script("plugin.framework.js")
    .script("myplugin.framework.js").wait()
    .script("init.js");
```
Executed in parallel?  
First-come, First-served(when execution order is not important)

Sugar
```
$LAB
.script( [ "script1.js", "script2.js", "script3.js"] )
.wait(function(){ // wait for all scripts to execute first
    script1Func();
    script2Func();
    script3Func();
});
```
Dependency Management  
基于文件的依赖管理

#### 第三日 蒸汽朋克
> MODULE LOADER  
> 模块化架构的工业革命

YUI3 Loader - Module Loader (2009)
> YUI's lightweight core and
modular architecture
make it scalable, fast, and robust.

回顾昔日王者的风采:
```
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
```
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
基于模块的依赖管理  
漏了一个问题？ ==Too much HTTP calls==  

**YUI Combo**  
How Combo Works
```
script(src="http://yui.yahooapis.com/3.0.0/build/yui/yui-min.js")
script(src="http://yui.yahooapis.com/3.0.0/build/dom/dom-min.js")
变为
script(src="http://yui.yahooapis.com/combo?
    3.0.0/build/yui/yui-min.js&
    3.0.0/build/dom/dom-min.js")
```
Serves multiple files in a single request  
GET 请求，需要服务器支持


#### 第四日 号角吹响
> COMMONJS  
> 征服世界的第一步是跳出浏览器

CommonJS - API Standard (2009.08)
javascript: not just for browsers any more!
```
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
```
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

#### 第五日 双塔奇兵
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


###### RequireJS - AMD Implementation (2011)  
> JavaScript file and module loader.  
> It is optimized for in-browser use

If require() is async?
```
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
```
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
```
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
```
// Module/1.0
var a = require("./a");  // 执行到此时，a.js 同步下载并执行

// AMD with CommonJS sugar
define(["require"], function(require){
    // 在这里， a.js 已经下载并且执行好了
    var a = require("./a")
})
```
Early Download, Early Executing


###### SeaJS - CMD Implementation (2011)  
> Extremely simple experience of modular development

More like CommonJS Style
```
define(function(require, exports) {
    var a = require('./a');
    a.doSomething();

    exports.foo = 'bar';
    exports.doSomething = function() {};
});
```
```
// RequireJS 兼容风格
define('hello', ['jquery'], function(require, exports, module) {
    return {
        foo: 'bar',
        doSomething: function() {}
    };
});
```

AMD vs CMD - the truly different  
Still Execution Time
```
// AMD recommended
define(['a', 'b'], function(a, b){
    a.doSomething();    // 依赖前置，提前执行
    b.doSomething();
})
```
```
// CMD recommanded
define(function(require, exports, module){
    var a = require("a");
    a.doSomething();
    var b = require("b");
    b.doSomething();    // 依赖就近，延迟执行
})
```
Early Download, Lazy Executing


###### RequireJS 最佳实践
Use Case
```
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
```
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
```
node r.js -o build.js
```
```
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

#### 第六日 精灵宝钻
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
```
# These are equivalent(相同的):
$ browserify main.js > bundle.js
$ webpack main.js bundle.js
```
BUT
```
// better with a webpack.config.js
module.exports = {
    entry: "./main.js",
    output: {
        filename: "bundle.js"
    }
}
```

Simple CLI
```
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

来源： https://huangxuan.me/js-module-7day/


###### ES6 模块与 CommonJS 模块的差异

1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
- ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的import有点像 Unix 系统的“符号连接”，原始值变了，import加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。
2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- 运行时加载: CommonJS 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。
- 编译时加载: ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，import时采用静态命令的形式。即在import时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”。

CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。
</font>

## call, apply, bind 区别
<font size=4>
首先说下前两者的区别。  
call 和 apply 都是为了解决改变 this 的指向。作用都是相同的，只是传参的方式不同。  
除了第一个参数外，call 可以接收一个参数列表，apply 只接受一个参数数组。  
```
let a = {
    value: 1
}
function getValue(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value)
}
getValue.call(a, 'yck', '24')
getValue.apply(a, ['yck', '24'])
```
###### 模拟实现 call 和 apply
可以从以下几点来考虑如何实现  
- 不传入第一个参数，那么默认为 window
- 改变了 this 指向，让新的对象可以执行该函数。那么思路是否可以变成给新的对象添加一个函数，然后在执行完以后删除？

```
Function.prototype.myCall = function (context) {
  var context = context || window
  // 给 context 添加一个属性
  // getValue.call(a, 'yck', '24') => a.fn = getValue
  context.fn = this
  // 将 context 后面的参数取出来
  var args = [...arguments].slice(1)
  // getValue.call(a, 'yck', '24') => a.fn('yck', '24')
  var result = context.fn(...args)
  // 删除 fn
  delete context.fn
  return result
}
```
以上就是 call 的思路，apply 的实现也类似
```
Function.prototype.myApply = function (context) {
  var context = context || window
  context.fn = this

  var result
  // 需要判断是否存储第二个参数
  // 如果存在，就将第二个参数展开
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }

  delete context.fn
  return result
}
```
bind 和其他两个方法作用也是一致的，只是该方法会返回一个函数。并且我们可以通过 bind 实现柯里化。  
同样的，也来模拟实现下 bind  
```
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  var _this = this
  var args = [...arguments].slice(1)
  // 返回一个函数
  return function F() {
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
      return new _this(...args, ...arguments)
    }
    return _this.apply(context, args.concat(...arguments))
  }
}
```
</font>
