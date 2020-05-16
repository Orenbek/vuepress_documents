---
title: 前端事件Event以及EventTarget
---

## 前言

之前没有好好研究 Web API 都有哪些。我们都知道事件在JS当中是一个很重要的部分，但是本人之前对事件没有做过好好地研究，导致概念不清。在准备好好地把事件相关的概念和API都搞懂理清。首先我们看看 MDN 上 [Web API](https://developer.mozilla.org/zh-CN/docs/Web/API) 接口都有哪些:

![](https://user-gold-cdn.xitu.io/2020/4/17/17186e7396e4a977?w=250&h=137&f=png&s=6086)

跟事件相关的API分别有 Event、EventTarget、EventListener。下面我们一一讲解。

## Event

Event 接口表示在 DOM 中发生的任何事件; 一些是用户生成的（例如鼠标或键盘事件），而其他由 API 生成（例如指示动画已经完成运行的事件，视频已被暂停等等）。  
事件通常由外部源触发，同样也会以编程方式触发，例如执行一个 element 的一个 `HTMLElement.click()` 方法，或通过定义事件，然后使用 `EventTarget.dispatchEvent()` 将其派发到一个指定的目标。  

::: tips
关于DOM事件流以及DOM事件等级在这里不会进行讲解，这里只是会理清楚上面提到的三个API的区别。  
:::
简单一句话总结Event对象就是它用来描述一个事件。我们来看看它主要的一些主要的属性和方法。  

### 构造函数
Event(typeArg[, eventInit])  
Creates an Event object, returning it to the caller.  
参数说明：
- typeArg  `string`  
代表事件类型字符串，例如keypress，click
- eventInit `Optional`  
    - bubbles Optional  
定义事件是否冒泡，默认为false
    - cancelable `Optional`  
定义事件是否可取消，默认为false
    - composed `Optional`  
指示事件是否会在影子DOM根节点之外触发侦听器。默认为false

### 属性
- Event.bubbles 只读  
一个布尔值，用来表示该事件是否在DOM中冒泡。
- Event.cancelable 只读
一个布尔值，用来表示这个事件是否可以取消。
- Event.currentTarget 只读  
当前注册事件的对象的引用。这是一个这个事件目前需要传递到的对象（译者：大概意思就是注册这个事件监听的对象）。这个值会在传递的途中进行改变。
- Event.target 只读  
对事件起源目标的引用。
- Event.type 只读  
事件的类型（不区分大小写）。
- Event.isTrusted 只读  
指明事件是否是由浏览器（当用户点击实例后）或者由脚本（使用事件的创建方法，例如event.initEvent）启动。

### 方法
- Event.preventDefault()  
取消事件（如果可以取消）。
- Event.stopImmediatePropagation()  
对于此特定事件，阻止所有其他侦听器被调用。这包括附加到相同元素的侦听器以及附加到稍后将遍历的元素的侦听器（例如，在捕获阶段）。
- Event.stopPropagation()  
阻止事件在DOM中进一步传播。

> Tips: 发现MDN文档上，英文文档比中文文档在规范性和全面性上都要好，讲解的也更加准确。以后最好看英文！

## EventTarget
EventTarget 是一个由可以接收事件的对象实现的接口，并且可以为它们创建侦听器。  
Element，document 和 window 是最常见的事件目标，但是其他对象也可以是事件目标，比如XMLHttpRequest，AudioNode，AudioContext 等等。  
许多事件目标（包括元素，文档和 window）还支持通过 `on...` 属性和属性设置[事件处理程序](https://developer.mozilla.org/zh-CN/docs/Web/Guide/DOM/Events/Event_handlers)。  
> 对上面说的可以接受事件的对象该如何判断？

### 构造函数
EventTarget()  
创建一个新的 EventTarget 对象实例。

### 方法
- EventTarget.addEventListener()  
在EventTarget上注册特定事件类型的事件处理程序。 
```js
target.addEventListener(type, listener, options);
target.addEventListener(type, listener, useCapture);
```
    - type 表示监听的事件类型的字符串。  
    - listener 当所监听的事件类型触发时，会接收到一个事件通知（实现了 Event 接口的对象）对象。  
    - useCapture `Optional`  决定在事件冒泡或者捕捉过程当中出发 listener 。默认为false，即冒泡的时候触发。  
    - options `Optional`  可选参数对象
        - capture: Boolean, 表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。  
        - once:  Boolean，表示 listener 在添加之后最多只调用一次。如果是 true， listener 会在其被调用之后自动移除。  
        - passive: Boolean，设置为true时，表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。
    
- EventTarget.removeEventListener()  
EventTarget中删除事件侦听器。
- EventTarget.dispatchEvent()  
将事件分派到此EventTarget。

### 示例

EventTarget的简单实现
```js
var EventTarget = function() {
  this.listeners = {};
};

EventTarget.prototype.listeners = null;
EventTarget.prototype.addEventListener = function(type, callback) {
  if(!(type in this.listeners)) {
    this.listeners[type] = [];
  }
  this.listeners[type].push(callback);
};

EventTarget.prototype.removeEventListener = function(type, callback) {
  if(!(type in this.listeners)) {
    return;
  }
  var stack = this.listeners[type];
  for(var i = 0, l = stack.length; i < l; i++) {
    if(stack[i] === callback){
      stack.splice(i, 1);
      return this.removeEventListener(type, callback);
    }
  }
};

EventTarget.prototype.dispatchEvent = function(event) {
  if(!(event.type in this.listeners)) {
    return;
  }
  var stack = this.listeners[event.type];
  event.target = this;
  for(var i = 0, l = stack.length; i < l; i++) {
      stack[i].call(this, event);
  }
};
```
来自MDN。如果感兴趣值得深入研究。
 

## 创建自定义事件

介绍完各自主要方法和属性，可能还是不明白区别。我们在这里创建一下自定义事件就可以知道它们的区别了。 
```js
let elem = document.getElementById("elem");
// Listen for the event.
elem.addEventListener('build', function (e) { ... }, false);

let event = new Event('build');
// Dispatch the event.
elem.dispatchEvent(event);
```

通过上述例子我们可以发现，`elem` 元素就是 EventTarget 对象，它可以创建侦听器。我们通过Event对象创建了一个build事件，之后 EventTarget 对象调用它的 dispatchEvent 方法来触发事件。此时它触发的是build事件。

### 添加自定义数据 – CustomEvent()
通过Event对象创建的事件无法传入自定义数据。因此有了CustomEvent对象，供我们在创建事件的同时可以传入自定义数据。

```js
let elem = document.getElementById("elem");
// Listen for the event.
elem.addEventListener('build', function (e) { ... }, false);

let event = new CustomEvent('build', { 'detail': elem.dataset.time });
// Dispatch the event.
elem.dispatchEvent(event);
```
至此 Event 和 EventTarget 两者的区别应该明了了。


## 获取DOM events
两种常见的风格是：广义 `addEventListener()` 和一组特定的`on-event`处理器。下面重点介绍后者如何工作的细节。

### 注册on-event 处理器（event handler）
on-event 处理器是由DOM元素提供的一组属性，以帮助管理元素如何对事件反应。元素可以使可交互性的（例如链接，按钮，图像，表单）或者非可交互的（比如基本文档本身等）。事件是异性行为，像点击，检测到按下按键，获得焦点等。on-event 事件通常被相应地命名，诸如onclick，onkeypress，onfocus等。  

你可以为一个给定的对象的某个特定事件（比如click）指定一个 on<...> 事件处理器，使用以下几种不同的方式：
- 在元素上使用 HTML attribute on{eventtype} ，例如：  
`<button onclick="return handleClick(event);">` 
- 或者通过 JavaScript 设置相应的属性（ property），例如：  
`document.getElementById("mybutton").onclick = function(event) { ... }`

注意，每个对象对于给定的事件只能有一个事件处理器（尽管该处理程序可以调用多个子处理器）。这就是为什么 `addEventListener()`  通常是获得事件通知的更好方法。

### 非元素对象
事件处理器也可以使用属性设置在生成事件的许多非元素对象上， 包括`window`, `document`, `XMLHttpRequest`, 和其他等等，例如：  
`xhr.onprogress = function() { ... }`

-------

至此关于 **Event** 以及 **EventTarget** 区别以及如何获取 **DOM events** 的两种方法都介绍完毕了。
