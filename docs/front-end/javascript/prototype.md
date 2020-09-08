---
title: 原型链
---

## 函数的原型对象

在 JavaScript 中，我们创建一个函数 A(就是声明一个函数), 那么浏览器就会在内存中创建一个对象 B，而且每个函数都默认会有一个属性 `prototype` 指向了这个对象( 即：prototype 的属性的值是这个对象 )。这个对象 B 就是函数 A 的原型对象，简称函数的原型。这个原型对象 B 默认会有一个属性 `constructor` 指向了这个函数 A ( 意思就是说：constructor 属性的值是函数 A )。

​ 看下面的代码：

```js
/*
  声明一个函数，则这个函数默认会有一个属性叫 prototype 。而且浏览器会自动按照一定的规则
  创建一个对象，这个对象就是这个函数的原型对象，prototype属性指向这个原型对象。这个原型对象
  有一个属性叫constructor 执行了这个函数

  注意：原型对象默认只有属性：constructor。其他都是从Object继承而来，暂且不用考虑。
*/
function Person() {}
```

![](/frontend/javascript/prototype.png)

由上图可知，原型与构造函数之间分别有一个指针指向对方。

在这里插一下 创建对象的几种方法

```js
// 方法1
var obj1 = { name: "obj" };

// 方法2
var obj2 = new Object({ name: "obj" });

// 方法3
var obj3 = new Object.create({ name: "obj" });

// 方法3
var M = function() {
  this.name = "obj";
};
var obj4 = new M();
```

## 使用构造函数创建对象

当把一个函数作为构造函数 (理论上任何函数都可以作为构造函数) 使用 new 创建对象的时候，那么这个对象就会存在一个默认的不可见的属性，来指向了构造函数的原型对象。 **这个不可见的属性我们一般用 `[[prototype]]` 来表示，只是这个属性没有办法直接访问到**。

看下面的代码：

```js
function Person() {}
/*
  利用构造函数创建一个对象，则这个对象会自动添加一个不可见的属性 [[prototype]], 而且这个属性
  指向了构造函数的原型对象。
*/
var p1 = new Person();
```

![](/frontend/javascript/prototype2.png)

1. 从上面的图示中可以看到，创建 p1 对象虽然使用的是 Person 构造函数，但是对象创建出来之后，这个 p1 对象其实已经与 Person 构造函数没有任何关系了，p1 对象的`[[ prototype ]]`属性指向的是 Person 构造函数的原型对象。
2. 如果使用`new Person()`创建多个对象，则多个对象都会同时指向 Person 构造函数的原型对象。
3. 我们可以手动给这个原型对象添加属性和方法，那么 p1,p2,p3…这些对象就会共享这些在原型中添加的属性和方法。
4. 如果我们访问 p1 中的一个属性 name，如果在 p1 对象中找到，则直接返回。如果 p1 对象中没有找到，则直接去 p1 对象的`[[prototype]]`属性指向的原型对象中查找，如果查找到则返回。(如果原型中也没有找到，则继续向上找原型的原型—原型链。 后面再讲)。
5. 如果通过 p1 对象添加了一个属性 name，则 p1 对象来说就屏蔽了原型中的属性 name。 换句话说：在 p1 中就没有办法访问到原型的属性 name 了。
6. 通过 p1 对象只能读取原型中的属性 name 的值，而不能修改原型中的属性 name 的值。 `p1.name = "李四";`并不是修改了原型中的值，而是在 p1 对象中给添加了一个属性 name。

```js
function Person() {}
// 可以使用Person.prototype 直接访问到原型对象
//给Person函数的原型对象中添加一个属性 name并且值是 "张三"
Person.prototype.name = "张三";
Person.prototype.age = 20;

var p1 = new Person();
/*
  访问p1对象的属性name，虽然在p1对象中我们并没有明确的添加属性name，但是
  p1的 [[prototype]] 属性指向的原型中有name属性，所以这个地方可以访问到属性name
  就值。
  注意：这个时候不能通过p1对象删除name属性，因为只能删除在p1中删除的对象。
*/
alert(p1.name); // 张三

var p2 = new Person();
alert(p2.name); // 张三  都是从原型中找到的，所以一样。

alert(p1.name === p2.name); // true

// 由于不能修改原型中的值，则这种方法就直接在p1中添加了一个新的属性name，然后在p1中无法再访问到
//原型中的属性。
p1.name = "李四";
alert("p1：" + p1.name);
// 由于p2中没有name属性，则对p2来说仍然是访问的原型中的属性。
alert("p2:" + p2.name); // 张三
```

![](/frontend/javascript/prototype3.png)

## 与原型有关的几个属性和方法

### prototype 属性

prototype 存在于构造函数中 (其实任意函数中都有，只是不是构造函数的时候 prototype 我们不关注而已) ，他指向了这个构造函数的原型对象。
参考前面的示意图。

### constructor 属性

constructor 属性存在于原型对象中，他指向了构造函数

```js
function Person() {}
alert(Person.prototype.constructor === Person); // true
var p1 = new Person();
//使用instanceof操作符可以判断一个对象的类型。
//typeof一般用来获取简单类型和函数。而自定义类一般使用instanceof，因为自定义类用typeof总是返回object。
alert(p1 instanceof Person); // true
```

### `__proto__` 属性

用构造方法创建一个新的对象之后，这个对象中默认会有一个不可访问的属性 `[[prototype]]` , 这个属性就指向了构造方法的原型对象。  
​ 但是在个别浏览器中，也提供了对这个属性`[[prototype]]`的访问(chrome 浏览器和火狐浏览器。ie 浏览器不支持)。访问方式：`p1.__proto__`  
​ 但是开发者尽量不要用这种方式去访问，因为操作不慎会改变这个对象的继承原型链。

```js
function Person() {}
//直接给Person的原型指定对象字面量。则这个对象的constructor属性不再指向Person函数
Person.prototype = {
  constructor: Person,
  name: "志玲",
  age: 20
};
var p1 = new Person();

alert(p1.__proto__ === Person.prototype); //true
```

### hasOwnProperty 方法

我们用去访问一个对象的属性的时候，这个属性既有可能来自对象本身，也有可能来自这个对象的`[[prototype]]`属性指向的原型。  
​ 那么如何判断这个对象的来源呢？  
​hasOwnProperty 方法，可以判断一个属性是否来自对象本身。

```js
function Person() {}
Person.prototype.name = "志玲";
var p1 = new Person();
p1.sex = "女";
//sex属性是直接在p1属性中添加，所以是true
alert("sex属性是对象本身的：" + p1.hasOwnProperty("sex"));
// name属性是在原型中添加的，所以是false
alert("name属性是对象本身的：" + p1.hasOwnProperty("name"));
//  age 属性不存在，所以也是false
alert("age属性是存在于对象本身：" + p1.hasOwnProperty("age"));
```

### in 操作符

in 操作符用来判断一个属性是否存在于这个对象中。但是在查找这个属性时候，现在对象本身中找，如果对象找不到再去原型中找。换句话说，只要对象和原型中有一个地方存在这个属性，就返回 true

```js
function Person() {}
Person.prototype.name = "志玲";
var p1 = new Person();
p1.sex = "女";
alert("sex" in p1); // 对象本身添加的，所以true
alert("name" in p1); //原型中存在，所以true
alert("age" in p1); //对象和原型中都不存在，所以false
```

如何判断一个属性是否存在于原型中：  
如果一个属性存在，但是没有在对象本身中，则一定存在于原型中。

```js
function Person() {}
Person.prototype.name = "志玲";
var p1 = new Person();
p1.sex = "女";

//定义一个函数去判断原型所在的位置
function propertyLocation(obj, prop) {
  if (!(prop in obj)) {
    alert(prop + "属性不存在");
  } else if (obj.hasOwnProperty(prop)) {
    alert(prop + "属性存在于对象中");
  } else {
    alert(prop + "对象存在于原型中");
  }
}
propertyLocation(p1, "age");
propertyLocation(p1, "name");
propertyLocation(p1, "sex");
```

## 组合原型模型和构造函数模型创建对象

### 原型模型创建对象的缺陷

原型中的所有的属性都是共享的。也就是说，用同一个构造函数创建的对象去访问原型中的属性的时候，大家都是访问的同一个对象，如果一个对象对原型的属性进行了修改，则会反映到所有的对象上面。  
​ 但是在实际使用中，每个对象的属性一般是不同的。张三的姓名是张三，李四的姓名是李四。
​ **但是，这个共享特性对方法(属性值是函数的属性)又是非常合适的。**  
所有的对象共享方法是最佳状态。这种特性在 c#和 Java 中是天生存在的。

```js
function Person(name, age) {}
//在原型对象内封装方法和属性
Person.prototype.eat = function(food) {
  alert(Person.prototype.name + "爱吃" + food);
};
Person.prototype.play = function(playName) {
  alert(Person.prototype.name + "爱玩" + playName);
};
Person.prototype.name = "张三";
Person.prototype.age = 20;
var p1 = new Person();
var p2 = new Person();
// p1和p2属性和方法都是共享的
```

### 构造函数模型创建对象的缺陷 ​

在构造函数中添加的属性和方法，每个对象都有自己独有的一份，大家不会共享。这个特性对属性比较合适，但是对方法又不太合适。因为对所有对象来说，他们的方法应该是一份就够了，没有必要每人一份，造成内存的浪费和性能的低下。

```js
function Person() {
  this.name = "李四";
  this.age = 20;
  this.eat = function() {
    alert("吃完东西");
  };
}
var p1 = new Person();
var p2 = new Person();
//每个对象都会有不同的方法
alert(p1.eat === p2.eat); //fasle
```

可以使用下面的方法解决：

```js
function Person() {
  this.name = "李四";
  this.age = 20;
  this.eat = eat;
}
function eat() {
  alert("吃完东西");
}
var p1 = new Person();
var p2 = new Person();
//因为eat属性都是赋值的同一个函数，所以是true
alert(p1.eat === p2.eat); //true
```

但是上面的这种解决方法具有致命的缺陷：封装性太差。使用面向对象，目的之一就是封装代码，这个时候为了性能又把代码抽出对象之外，这是反人类的设计。

### 使用组合模式解决上述两种缺陷

原型模式适合封装方法，构造函数模式适合封装属性，综合两种模式的优点就有了组合模式。

```js
//在构造方法内部封装属性
function Person(name, age) {
  this.name = name;
  this.age = age;
}
//在原型对象内封装方法
Person.prototype.eat = function(food) {
  alert(this.name + "爱吃" + food);
};
Person.prototype.play = function(playName) {
  alert(this.name + "爱玩" + playName);
};

var p1 = new Person("李四", 20);
var p2 = new Person("张三", 30);
p1.eat("苹果");
p2.eat("香蕉");
p1.play("志玲");
p2.play("凤姐");
```

## 动态原型模式创建对象

前面讲到的组合模式，也并非完美无缺，有一点也是感觉不是很完美。把构造方法和原型分开写，总让人感觉不舒服，应该想办法把构造方法和原型封装在一起，所以就有了动态原型模式。

​ 动态原型模式把所有的属性和方法都封装在构造方法中，而仅仅在需要的时候才去在构造方法中初始化原型，又保持了同时使用构造函数和原型的优点。

```js
//构造方法内部封装属性
function Person(name, age) {
  //每个对象都添加自己的属性
  this.name = name;
  this.age = age;
  /*
    判断this.eat这个属性是不是function，如果不是function则证明是第一次创建对象，
    则把这个funcion添加到原型中。
    如果是function，则代表原型中已经有了这个方法，则不需要再添加。
    perfect！完美解决了性能和代码的封装问题。
  */
  if (typeof this.eat !== "function") {
    Person.prototype.eat = function() {
      alert(this.name + " 在吃");
    };
  }
}
var p1 = new Person("志玲", 40);
p1.eat();
```

从 ES6 开始，可以使用 class 操作符来定义一个类 详情见 class 的详解
