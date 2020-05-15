---
title: 类型判断
---

## Typeof
typeof 对于基本类型，除了 null 都可以显示正确的类型      

typeof 对于对象，除了函数都会显示 object  
当操作数为原始类型(Primitive)时很有效，但是对于对象具体类型的判断往往并不是我们需要的结果。
```javascript
function a(){}
typeof a // 'function'

typeof '123'; // string
typeof new String('123'); // object
```

对于 null 来说，虽然它是基本类型，但是会显示 object，这是一个存在很久了的 Bug
`typeof null // 'object'`
> PS：为什么会出现这种情况呢？因为在 JS 的最初版本中，使用的是 32 位系统，为了性能考虑使用低位存储了变量的类型信息，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。

如果我们想获得一个变量的正确类型，可以通过 Object.prototype.toString.call(xx)。这样我们就可以获得类似 [object Type] 的字符串。

## instanceof
instanceof操作符主要用来检查构造函数的原型是否在对象的原型链上。

```javascript
const s = new String('123');

s instanceof String; // true
s instanceof Object; // true
```
利用instanceof操作符，我们可以对自定义的对象进行判断：  
```javascript
function Animal (name) {
this.name = name
}

const fizz = new Animal('fizz');

fizz instanceof Animal // true
```

::: warning
注意：使用对象必须是一个 object ！
:::

```javascript
// 语法： object instanceof constructor；

let n1 = 123;			 // n 是类型为 Number 的元素！！！不是对象！！！
typeof n1;				 // "number"	回想一下我们有7种类型
n1 instanceof Number;	  // false	 function Number() { }

let n2 = new Number(123)  // 现在 n2 是一个 object 元素！！！
typeof n2;				 // "object"
n2 instanceof Number;	  // true
```
正如，上述方式所说，这种方式只适合判断 object ！！！

## constructor
实际上我们也可以通过constructor属性来达到类型判断的效果：

```javascript
function Animal (name) {
    this.name = name
}

const fizz = new Animal('fizz');
fizz.constructor === Animal // true
fizz.constructor.name === 'Animal' // true
// 这里fizz对象本身是没有constructor属性的，这个属性是它原型上的属性 
//原型上的属性可以被fizz访问到
```
但是在实际情况下，constructor属性可以被随意修改，而且你在原型继承中，很容易忽略掉constructor的正确指向：
```javascript
function Rabbit (name) {
Animal.call(this, name)
}

Rabbit.prototype = Object.create(Animal.prototype);
// 上面这一步可以用 Rabbit.prototype = new Animal() 来代替简写

// 需要手动设置constructor的正确指向
Rabbit.prototype.constructor = Rabbit;

const rabbit = new Rabbit('🐰');

rabbit.constructor === Rabbit // true
```

## Object.prototype.toString
利用toString方法基本上可以解决所有内置对象类型的判断：

```javascript
function foo(){};

Object.prototype.toString.call(1);  '[object Number]'
Object.prototype.toString.call('1'); '[object String]'
Object.prototype.toString.call(NaN); '[object Number]'
Object.prototype.toString.call(foo);  '[object Function]'
Object.prototype.toString.call([1,2,3]); '[object Array]'
Object.prototype.toString.call(undefined); '[object Undefined]'
Object.prototype.toString.call(null); '[object Null]'
Object.prototype.toString.call(true); '[object Boolean]'
....
```
当然 `Object.prototype.toString.call` 也可以换成 `Object.prototype.toString.apply` 或者是 `Object.prototype.toString.bind`。
但是这种方法对于自定义的构造函数仍然无效。

## isPrototypeOf
作用：检测一个对象是否是另一个对象的原型。或者说一个对象是否被包含在另一个对象的原型链中

```javascript
var p = {x:1};//定义一个原型对象
var o = Object.create(p);//使用这个原型创建一个对象
p.isPrototypeOf(o);//=>true：o继承p
Object.prototype.isPrototypeOf(p);//=> true p继承自Object.prototype

function Animal(){
　this.species = "动物";
};
var eh = new Animal();
Animal.prototype.isPrototypeOf(eh)//=>true
```
这种方法在类型判断很少用。它主要用来判断一个对象是否是另一个对象继承而来的。

## 常见类型判断
### 空值 (null)：

#### 法1：直接用严格等于判断。
```javascript
var isNull = function (obj) {
	return obj === null;
};
```
这是最直接并且有效的方式；

#### 法2：巧妙地利用 ! null 的结果为 true：
```javascript
var isNull = function (obj) {
	return !obj && typeof obj === "object";
};

```
此方法虽然很巧妙，但是没有法1直接；

### 未定义 (undefined)

#### 法1：这是最推荐的方式。
```javascript
var isUndefined = function (obj) {
	return obj === void 0;
}
```
很多常见的工具库都采用这种方式，极力推荐！！！

#### 法2：直接利用 typeof 判断：
```javascript
var isUndefined = function (obj) {
	return typeof obj === "undefined";
}
```
这种方式，也是相对稳定的；

### 布尔值 (boolean)
underscore.js 会这样判断

```javascript
var isBoolean = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Boolean]';
}
```
这里是因为考虑到可能通过new Boolean()方式创建的布尔值。  
类似地，我们采用 .constructor 和 typeof 的方式也可以实现判断。

### 数字 (number)

```javascript
var isNumber = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Number]';
}
```
类似地，我们采用 constructor 和 typeof 的方式也可以实现判断。

### 字符串 (string)

```javascript
var isString = function (obj) {
	return Object.prototype.toString.call(obj) === '[object String]';
}
```
类似地，我们采用 constructor 和 typeof 的方式也可以实现判断。

### 对象 (object)

```js
var isObject = function (obj) {
	var type = typeof obj;
	return type === 'function' || type === 'object' && !!obj;
}
// OR
var isObject = function (obj) {
	var type = typeof obj;
	return type === 'function' || type === 'object' && obj !== null;
}
```
这里，是我最疑惑的地方，为什么要用 !!obj ？
1. typeof null === object 结果为 true ;
2. !obj 的方式，null 和 undefined 返回结果都为 true 而其他类型为 false；
3. 以上面这种实现方式，如果传递值为 null 的时候，就会被 !!obj 过滤掉；

同样的 我们也可以用Object.prototype.toString来判断是否是对象 只不过要注意函数的判断

### 数组(Array)

#### 法1： 最稳妥的办法：
```js
Object.prototype.toString.call([1,2,3])	// "[object Array]"
```
老老实实地用这个方法吧！！！

#### 法2：instanceof 法，仅为拓展：
```js
var a = [1, 2, 3];		// 在最开始就声明了，数组也是对象，此法可以用来判断数组；
a instanceof Array;		// 而这个对象的构造函数是 function Array() { }
```

#### 法3：构造函数法，仅为拓展
```js
var a = [1, 2, 3];
a.constructor === Array;   // true	数组
// 上面这句 也可以写成 a.__proto__.constructor === Array
// 不过部分浏览器不支持这种写法
```
注：如果 a 等于 null 或者 a 等于 undefined ，还要报错，这种方式坚决不推荐！！！


### 有用的数据类型判断函数

#### isArray
`Array.isArray([]) // true`

#### isNaN
判断一个数是不是 NaN 不能单纯地使用 === 这样来判断, 因为 NaN 不与任何数相等, 包括自身, 并且Object.prototype.toString.bind(NaN)() 返回值为"[object Number]"，因此最好使用ES6的Number.isNaN()方法:
```js
Number.isNaN(NaN) // true
Number.isNaN(function(){}) // false
```
