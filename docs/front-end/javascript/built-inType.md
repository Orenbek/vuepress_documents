---
title: 认识内置类型
---

JS 中分为七种内置类型，七种内置类型又分为两大类型：基本类型和对象（Object）。

1. 空值 (null)
2. 未定义 (undefined)
3. 布尔值 (boolean)
4. 数字 (number)
5. 字符串 (string)
6. 对象 (object)
7. 符号 (symbol，ES6 中新增)

基本类型有六种： null，undefined，boolean，number，string，symbol。

::: warning
注意：没有 function 类型 函数都是对象
:::

其中 JS 的数字类型是浮点类型的，没有整型。并且浮点类型基于 IEEE 754 标准实现，在使用中会遇到某些 Bug。NaN 也属于 number 类型，并且 NaN 不等于自身。

对于基本类型来说，如果使用字面量的方式，那么这个变量只是个字面量，只有在必要的时候才会转换为对应的类型

```javascript
let a = 111; // 这只是字面量，不是 number 类型
a.toString(); // 使用时候才会转换为对象类型
```

对象（Object）是引用类型，在使用过程中会遇到浅拷贝和深拷贝的问题。
