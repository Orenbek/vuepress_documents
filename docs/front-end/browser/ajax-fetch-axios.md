---
title: AJAX, Fetch, and Axios
---

Asynchronous JavaScript?

## HTTP Requests in the Browser

- URL bar
- Links
- JavaScript
  - window.location.herf = ''
  - src=''
- Submitting forms (GET/POST)

All of the above make the browser navigate and retrieve new documents

Often times for each of the above actions, views are stored on the server and served up as HTML pages When a user goes to a new page, **the browser navigates in totality, refreshing and retrieving a brand new HTML document**. Each page, since it’s a new page, retrieves stylesheets, scripts, files, etc.

## What is AJAX?

- “Asynchronous JavaScript And XML”
- Making background HTTP requests using JavaScript
- Handling the response of those HTTP requests with JavaScript
- No page refresh necessary
- `window.fetch()`

## Why AJAX?

- AJAX allows us to build Single Page Applications (SPAs).  
  Via wikipedia: - “An SPA is a web application or web site that interacts
  with the user by ++dynamically rewriting the current page
  rather than loading entire new pages from a server++”
- SPAs mean no reload or "refresh" within the user interface
  - JS manipulates the DOM as the user interacts
- User experience similar to a native / mobile application

## XMLHttpRequest （Native AJAX）

XMLHttpRequest 这是个构造函数，用于初始化一个可发起 ajax 请求的 XMLHttpRequest 对象。由于此对象使用起来不方便，因此有了很多封装库，比如 JQuery 的 ajax 方法，Axios 等。

继承关系：  
![image](https://user-gold-cdn.xitu.io/2020/4/17/17187af489b143fd?w=1273&h=228&f=png&s=13193)

### 方法

- xhr.open(method, url, async, user, password)；  
  作用: 通过 XMLHttpRequest 实例，初始化一个请求。 默认初始化一个异步请求。
- xhr.send(data)
- xhr.abort()
- xhr.getAllResponseHeaders()  
  注意：需要在 onreadystatechange 事件函数中使用
- xhr.getResponseHeader(headerStr)  
  注意：需要在 onreadystatechange 事件函数中使用

### 属性

- xhr.readyState  
  说明：当前请求的五种状态值，一般在事件函数 onreadystatechange 中作为条件判断，以下是五种状态值及对应说明。 - 0: 请求未初始化 - 1: 服务器连接已建立 - 2: 请求已接收 - 3: 请求处理中 - 4: 请求已完成，且响应已就绪
- xhr.responseType
- xhr.timeout
- xhr.withCredentials  
  说明: 跨域请求是否提供凭据(cookie、HTTP 认证及客户端 SSL 证明等)。
- xhr.upload

### 事件

- xhr.onreadystatechange  
  示例：

```js
xhr.onreadystatechange = function() {
  if (xhr.readyState !== 4) {
    return;
  }
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
    // jquery success(XHR, TS)
    options.success(xhr.response, xhr.status);
  } else {
    // jquery error(XHR, TS, statusText)
    options.error(xhr, xhr.status, xhr.statusText);
  }
};
```

- xhr.onloadstart
- xhr.onprogress
- xhr.onabort
- xhr.onerror
- xhr.onload
- xhr.ontimeout
- xhr.onloadend

## Wait, what is fetch()

- The Fetch API provides an interface for fetching resources
  (including across the network).  
  这里的意思应该是 Fetch API 提供了加载资源的接口。包括通过网络来进行加载。那本地文件是否可以呢？
- Provides a generic definition of Request and Response objects, as well as other things involved with network requests
- The `fetch()` method takes one mandatory argument, the path to the resource you want to fetch, and returns a promise that resolves to the response to that request (successful or not).  
  mandatory 强制性的
- You can optionally pass an init options object as second argument (used to configure req headers for other types of HTTP requests such as PUT, POST, DELETE)

```js
fetch("http://example.com/movies.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(JSON.stringify(myJson));
  });
```

## What is Axios?

Axios is a promise-based HTTP client for JavaScript. It allows you to:

- Make XMLHttpRequests from the browser
- Make http requests from node.js
- Supports the Promise API
- Automatic transforms for JSON data

Axios provides more functions to make other network requests as well, such as:

- `axios.get(<uri>, <payload>)`
- `axios.post(<uri>, <payload>)`
- `axios.put(<uri>, <payload>)`
- `axios.delete(<uri>, <payload>)`
  You can also pass a config object instead:

```js
axios({
 method: ‘get’,
 url: ‘http://dummy.data'
 responseType: ‘<insert response type, e.g. stream>’
})
```

## Fetch vs Axios

- Fetch API is built into the window object, and therefore doesn’t need to be installed as a dependency or imported in client-side code.
- Axios needs to be installed as a dependency. However, it automatically transforms JSON data for you, thereby avoiding the two-step process of making a `.fetch()` request and then a second call to the `.json()` method on the response.

主要差异就是，fetch 在请求 json 格式的请求时需要多写一步 调用 `.json()` 命令
