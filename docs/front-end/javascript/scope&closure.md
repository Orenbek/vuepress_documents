---
title: 作用域和闭包
---

## 理解作用域

你真的理解作用域吗？  
JavaScript 中的作用域有两种：**函数作用域**与**块作用域**。

1. 函数作用域
   任意代码片段外部添加包装函数，可以将内部的变量和函数定义“隐藏”起来，外部作用域无法访问包装函数内部的任何内容。  
   函数作用域的含义是指，属于这个函数的全部变量都可以在整个函数的范围内使用及复用（事实上在嵌套的作用域中也可以使用）。

示例：

```js
function foo(a) {
  var b = 2;
  // 一些代码
  function bar() {
    // ...
  }
  // 更多的代码
  zoo();
}

function zoo() {
  //
}
```

变量 b 作用域为函数 foo 内部。值得注意的是 bar 函数内也可以访问变量 b。但是 zoo 函数内部访问不了 foo 函数内部的变量 b，因为 zoo 不是嵌套于 foo 函数体内。

2. 块作用域
1. with
1. try/catch
1. let
1. const

::: tips
讲到这里需要稍微对变量提升做一些说明。JavaScript 中函数声明和函数变量声明在 JavaScript 引擎进行解析是会先进行提升，且优先级是函数声明优先于变量声明。
通过 let 和 const 关键词进行声明的变量不会进行提升。这一块内容容易理解，这里就不展开讲了。
:::

## 闭包

JavaScript 中闭包无处不在，你只需要能够识别并拥抱它。 闭包并不是一个需要学习新的语法或模式才能使用的工具。

我们首先来看个例子。

```js
function foo() {
  var a = 2;
  function bar() {
    console.log(a);
  }
  return bar;
}
var baz = foo();
baz(); // 2 —— 朋友，这就是闭包的效果。
```

在上面的例子中，按理来说 foo 函数执行过后，变量 a 理应应该被垃圾回收机制进行回收。但是实际上并没有。原因是内部返回的 bar 函数内部引用了 foo 函数内的变量。这种情况下，垃圾回收不会进行回收操作，这种情况就被成为闭包。

当然，无论使用何种方式对函数类型的值进行传递，当函数在别处被调用时都可以观察到闭包。  
一般有很多场景都包含了闭包。函数返回一个函数，或者是回调函数。都会形成闭包。

```js
function A() {
  let a = 1;
  function B() {
    console.log(a);
  }
  return B;
}
```

你是否会疑惑，为什么函数 A 已经弹出调用栈了，为什么函数 B 还能引用到函数 A 中的变量。因为函数 A 中的变量这时候是存储在堆上的。现在的 JS 引擎可以通过逃逸分析辨别出哪些变量需要存储在堆上，哪些需要存储在栈上。

经典面试题，循环中使用闭包解决 var 定义函数的问题

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
```

第一种使用闭包

```js
for (var i = 1; i <= 5; i++) {
  (function(j) {
    setTimeout(function timer() {
      console.log(j);
    }, j * 1000);
  })(i);
}
```

第二种就是使用 `setTimeout` 的第三个参数

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function timer(j) {
      console.log(j);
    },
    i * 1000,
    i
  );
}
```

第三种就是使用 let 定义 i 了

```js
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
```

## 模块

还有其他的代码模式利用闭包的强大威力，但从表面上看，它们似乎与回调无关。下面一起来研究其中最强大的一个：**模块**

```js
function CoolModule() {
  var something = "cool";
  var another = [1, 2, 3];
  function doSomething() {
    console.log(something);
  }
  function doAnother() {
    console.log(another.join(" ! "));
  }
  return {
    doSomething: doSomething,
    doAnother: doAnother
  };
}
var foo = CoolModule();
foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```

这个模式在 JavaScript 中被称为模块。最常见的实现模块模式的方法通常被称为**模块暴露**，这里展示的是其变体。

首先，`CoolModule()` 只是一个函数，必须要通过调用它来创建一个模块实例。如果不执行外部函数，内部作用域和闭包都无法被创建。

其次，`CoolModule()` 返回一个用对象字面量语法 `{ key: value, ... }` 来表示的对象。这个返回的对象中含有对内部函数而不是内部数据变量的引用。我们保持内部数据变量是隐藏且私有的状态。可以将这个对象类型的返回值看作本质上是模块的公共 API。  
这个对象类型的返回值最终被赋值给外部的变量 foo，然后就可以通过它来访问 API 中的属性方法，比如 `foo.doSomething()`。

如果要更简单的描述，模块模式需要具备两个必要条件。

1. 必须有外部的封闭函数，该函数必须至少被调用一次（每次调用都会创建一个新的模块实例）。
2. 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，且可以访问或者修改私有的状态。

关于模块，我觉得是一个非常值得研究。不过，我准备等我把 JavaScript 异步编程部分总结完之后再来研究这个未知的世界。
