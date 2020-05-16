---
title: cookie、localStorage和sessionStorage
---

## 使用方法

### cookie
#### 保存cookie值：
```js
var data = 'data';
document.cookie = 'token' + '=' + data;
```
我们对cookie进行的操作会被自动加上分号，插入到字符串中  
另外我们还可以设置过期时间
```js
function setCookie(cname,cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}
```

#### 获取指定名称的cookie值  
cookie值是很长的一个字符串。里面保存的不同的值通过分号来分割，例如：
```js
MUID=14DC01B5CA276E5C0A260C40CE276DDE; SRCHD=AF=NOFORM; _tarLang=default=en; _TTSS_OUT=hist=WyJlbiJd; imgv=lodlg=2&gts=20200414&lts=20200311; ULC=P=!A35C|209:@21&H=A35C|456:52&T=A35C|456:52:2
```
因此我们获取值的时候都是通过正则匹配来获取
```js
 function getCookie(name) { //获取指定名称的cookie值
// (^| )name=([^;]*)(;|$),match[0]为与整个正则表达式匹配的字符串，match[i]为正则表达式捕获数组相匹配的数组；
var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
if(arr != null) {
  console.log(arr);
  return unescape(arr[2]);
}
return null;
}
 var cookieData=getCookie('token'); //cookie赋值给变量。
```

### localStorage和sessionStorage:
```js
sessionStorage.setItem(key,value)
sessionStorage.getItem(key)
sessionStorage.valueOf();//获取全部数据
sessionStorage.removeItem(key); //删除指定键名数据
sessionStorage.clear();//清空缓存数据

localStorage的API跟sessionStorage相同
```
::: warning
注意：缓存的内容必须得是个字符串 不接受其他类型
:::

## 三者的异同

### 生命周期：

cookie：可设置失效时间，没有设置的话，默认是关闭浏览器后失效  
可以为 cookie 添加一个过期时间（以 UTC 或 GMT 时间）
```js
document.cookie="username=John Doe; expires=Thu, 18 Dec 2043 12:00:00 GMT";
```

localStorage：除非被手动清除，否则将会永久保存。  
sessionStorage： 仅在当前网页会话下有效，关闭页面或浏览器后就会被清除。  

### 存放数据大小：
cookie：4KB左右  
localStorage和sessionStorage：可以保存5MB的信息。

### http请求：
cookie：每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题  
localStorage和sessionStorage：仅在客户端（即浏览器）中保存，不参与和服务器的通信  

### 易用性：
cookie：需要程序员自己封装，源生的Cookie接口不友好  
localStorage和sessionStorage：源生接口可以接受，亦可再次封装来对Object和Array有更好的支持

### 作用域
cookie： 同源页面下共享  
localStorage：同源页面下共享  
sessionStorage：只在同一个页面有效，不同页面间无法共享。这里需要注意的是，页面仅指顶级窗口，如果一个页面包含多个iframe且他们属于同源页面，那么他们之间是可以共享sessionStorage的。

## 应用场景：
cookie：用来识别用户登录  
localStorage：长期需要保存的一些信息以及跨页面通信  
sessionStorage： 用来保存一些临时数据，防止用户刷新页面之后丢失了一些参数。

----
参考： [cookie、localStorage和sessionStorage 三者之间的区别以及存储、获取、删除等使用方式](https://juejin.im/post/5a191c47f265da43111fe859)
