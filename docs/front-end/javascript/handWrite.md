---
title: 手写js
---

## new

1. 新生成一个对象并且对对象进行初始化
2. 链接到原型
3. 绑定this
4. 返回这个对象

我们也可以试着来自己实现一个 new
```js
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
::: warnings
arguments 不是数组，是类数组
:::

## instanceof

instanceof 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 prototype。

我们也可以试着实现一下 instanceof

```js
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

## 深浅拷贝
深浅拷贝是值对对象类型进行不同深度的复制

### 浅拷贝

首先可以通过 `Object.assign` 来解决这个问题。
```js
let a = {
    age: 1
}
let b = Object.assign({}, a)
a.age = 2
console.log(b.age) // 1
```

当然我们也可以通过展开运算符（…）来解决
```js
let a = {
    age: 1
}
let b = {...a}
a.age = 2
console.log(b.age) // 1
```

通常浅拷贝就能解决大部分问题了，但是当我们遇到如下情况就需要使用到深拷贝了
```js
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

### 深拷贝
这个问题通常可以通过 `JSON.parse(JSON.stringify(object))` 来解决。
但是该方法也是有局限性的：

- 会把 undefined 转换为 null (JSON格式中没有undefined格式)
- 会忽略 symbol
- Date 对象会转换为字符串
- RegExp 对象会转换为空对象
- 不能序列化函数
- 不能解决循环引用的对象

#### for...in 加递归

```js
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
这两个方法都无法拷贝 **函数**，**Date**，**RegExp** 类型的对象。

::: warnings
注意！Date和RegExp类型的变量**都是对象 不是基本类型**！不过这些特殊的对象，不是值引用，而是值复制。也就是说不是所有的对象都是值引用！
:::

因为这两个值类型是对象，但是又不能通过`for in`进行遍历，因此这里会出问题。最后的结果是这函数返回的值中两个类型都会转为空的对象

另外以上两个方法都无法解决环的问题

#### 解决环引用的问题
可以使用一个 `WeakMap` 结构存储已经被拷贝的对象，每一次进行拷贝的时候就先向 `WeakMap` 查询该对象是否已经被拷贝，如果已经被拷贝则取出该对象并返回，将deepCopy函数改造成如下：
```js
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
```js
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

