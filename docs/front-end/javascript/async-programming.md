---
title: 异步编程
---

## 前言
这一部分将涵盖的内容会稍微有点多，因为需要彻底明白这些内容确实需要对很多概念进行理解。包括执行上下文，执行栈，并发模型等。并发模型中就包含时间循环，宏微任务等概念。

## 什么是执行上下文？
简而言之，执行上下文是执行 JavaScript 代码的**环境**的抽象概念。每当 Javascript 代码在运行的时候，它都是在执行上下文中运行。

### 执行上下文的类型
JavaScript 中有三种执行上下文类型。

- **全局执行上下文** — 这是默认或者说基础的上下文，任何不在函数内部的代码都在全局上下文中。它会执行两件事：创建一个全局的 `window` 对象（浏览器的情况下），并且设置 `this` 的值等于这个全局对象。一个程序中只会有一个全局执行上下文。
- **函数执行上下文** — 每当一个函数被调用时, 都会为该函数创建一个新的上下文。每个函数都有它自己的执行上下文，不过是在函数被调用时创建的。函数上下文可以有任意多个。每当一个新的执行上下文被创建，它会按定义的顺序（将在后文讨论）执行一系列步骤。
- **Eval 函数执行上下文** — 执行在 `eval` 函数内部的代码也会有它属于自己的执行上下文，但由于 JavaScript 开发者并不经常使用 `eval`，所以在这里我不会讨论它。

## 执行栈
执行栈，也就是在其它编程语言中所说的“调用栈”，是一种拥有 LIFO（后进先出）数据结构的栈，被用来存储代码运行时创建的所有执行上下文。

当 JavaScript 引擎第一次遇到你的脚本时，它会创建一个全局的执行上下文并且压入当前执行栈。每当引擎遇到一个函数调用，它会为该函数创建一个新的执行上下文并压入栈的顶部。

引擎会执行那些执行上下文位于栈顶的函数。当该函数执行结束时，执行上下文从栈中弹出，控制流程到达当前栈中的下一个上下文。

让我们通过下面的代码示例来理解：
```js
let a = 'Hello World!';

function first() {
  console.log('Inside first function');
  second();
  console.log('Again inside first function');
}

function second() {
  console.log('Inside second function');
}

first();
console.log('Inside Global Execution Context');
```
执行栈如下图所示  
![](/frontend/javascript/executing-stacks.jpg)

当上述代码在浏览器加载时，JavaScript 引擎创建了一个全局执行上下文并把它压入当前执行栈。当遇到 first() 函数调用时，JavaScript 引擎为该函数创建一个新的执行上下文并把它压入当前执行栈的顶部。

当从 first() 函数内部调用 second() 函数时，JavaScript 引擎为 second() 函数创建了一个新的执行上下文并把它压入当前执行栈的顶部。当 second() 函数执行完毕，它的执行上下文会从当前栈弹出，并且控制流程到达下一个执行上下文，即 first() 函数的执行上下文。

当 first() 执行完毕，它的执行上下文从栈弹出，控制流程到达全局执行上下文。一旦所有代码执行完毕，JavaScript 引擎从当前栈中移除全局执行上下文。

上述过程是同步情况下的栈执行情况。如果代码当中出现了异步函数会发生什么呢?

```js
let a = 'Hello World!';

function first() {
  console.log('Inside first function');
  second();
  console.log('Again inside first function');
}

function second() {
  console.log('Inside second function');
  setTimeout(function third() {
    console.log('Inside third function')
  }, 1000)
}

first();
console.log('Inside Global Execution Context');
```
观察上面的函数。与之前的函数不一致的地方在于多了一个 `setTimeout` 异步函数。这种情况下，所有的同步函数执行时执行栈中的情况跟上文一致。不同的是在异步函数回调 `third` 被调用时，函数调用栈就又重新回到了 `全局 --> first --> second --> third` 。对于异步函数，js引擎会记录调用栈，并且保留执行上下文，也就是会生成一个闭包。

## 并发模型与事件循环

### 并行与并发
多线程的任务可以并行执行，而JavaScript单线程异步编程可以实现多任务并发执行，这里有必要说明一下并行与并发的区别。

- 并行，指同一时刻内多任务同时进行；
- 并发，指在同一时间段内，多任务同时进行着，但是某一时刻，只有某一任务执行；

通常所说的并发连接数，是指浏览器向服务器发起请求，建立TCP连接，每秒钟服务器建立的总连接数，而假如，服务器处10ms能处理一个连接，那么其并发连接数就是100。

JavaScript异步编程使得多个任务可以并发执行，而实现这一功能的基础是JavScript拥有一个基于事件循环的并发模型。

### 堆栈与队列
介绍JavaScript并发模型之前，先简单介绍堆栈和队列的区别：

- 堆（heap）：内存中某一未被阻止的区域，变量和函数储存在此堆中。堆中的变量和函数在超出作用域时需要进行回收，这个工作由JavaScript引擎自动完成；
- 栈（stack）：后进先出的顺序存储数据结构，通常存储函数参数和基本类型值变量（按值访问）；
- 队列（queue）：先进先出顺序存储数据结构。


## 事件循环流程
关于事件循环流程分解如下：

- 宿主环境为JavaScript创建线程时，会创建堆(heap)和栈(stack)，堆内存储JavaScript对象，栈内存储执行上下文；
- 栈内执行上下文的同步任务按序执行，执行完即退栈，而当异步任务执行时，该异步任务进入等待状态（不入栈），同时通知事件触发线程：当触发该事件时（或该异步操作响应返回时），需向任务队列插入一个事件消息；
- 当事件触发或响应返回时，事件触发线程向任务队列插入该事件消息（包含事件及回调）；
- 当栈内同步任务执行完毕后，js引擎线程从任务队列取出一个事件消息，其对应异步任务（函数）入栈，执行回调函数，如果未绑定回调，这个消息会被丢弃，执行完任务后退栈；
- 当线程空闲（即执行栈清空）时继续拉取任务队列下一轮消息（next tick，事件循环流转一次称为一次tick）。

```js
var ele = document.querySelector('body');
function clickCb(event) {
  console.log('clicked');
}
function bindEvent(callback) {
  ele.addEventListener('click', callback);
}
bindEvent(clickCb);
```
针对如上代码我们可以构建如下并发模型：  
![](/frontend/javascript/eventloop.jpg)

如上图，当执行栈同步代码块依次执行完直到遇见异步任务时，异步任务进入等待状态，通知线程，异步事件触发时，往任务队列插入一条事件消息；而当执行栈后续同步代码执行完后，读取任务队列，得到一条消息，然后将该消息对应的异步任务入栈，执行回调函数；一次事件循环就完成了，也即处理了一个异步任务。

## 任务队列
任务队列又分为macro-task（宏任务）与micro-task（微任务），在最新标准中，它们被分别称为task与jobs。

macro-task大概包括：
- script(整体代码)
- setTimeout
- setInterval
- setImmediate
- I/O
- UI render

micro-task大概包括:
- process.nextTick
- Promise
- Async/Await(实际就是promise)
- MutationObserver(html5新特性)

这里最重要的就是执行顺序。看下图中的流程图：
![](/frontend/javascript/macrotask&microtask.jpg)

总的结论就是，执行宏任务，然后执行该宏任务产生的微任务，若微任务在执行过程中产生了新的微任务，则继续执行微任务，微任务执行完毕后，再回到宏任务中进行下一轮循环。
```js
console.log('script start')
async function async1() {
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2 end')
    setTimeout(function () {
        console.log('setTimeout1')
        new Promise(resolve => {
            console.log('Promise3')
            resolve()
        })
        .then(function () {
            console.log('promise4')
        })
        .then(function () {
            console.log('promise5')
        })
    }, 0)
}
async1()

setTimeout(function () {
    console.log('setTimeout2')
}, 0)

new Promise(resolve => {
        console.log('Promise')
        resolve()
    })
    .then(function () {
        console.log('promise1')
    })
    .then(function () {
        console.log('promise2')
    })
console.log('script end')
```
以上代码在浏览器和node环境下执行顺序都一致。以下是其输出。
```js
script start
async2 end
Promise
script end
async1 end
promise1
promise2
setTimeout1
Promise3
promise4
promise5
setTimeout2
```

代码同步的
