---
title: 深入了解组件
---

## 组件注册

### 组件名

定义组件名的方式有两种：

1. **使用 kebab-case**

```js
Vue.component("my-component-name", {
  /* ... */
});
```

当使用 kebab-case (短横线分隔命名) 定义一个组件时，你也必须在引用这个自定义元素时使用 kebab-case，例如 `<my-component-name>`。

2. **使用 PascalCase**

```js
Vue.component("MyComponentName", {
  /* ... */
});
```

当使用 PascalCase (首字母大写命名) 定义一个组件时，你在引用这个自定义元素时两种命名法都可以使用。也就是说 `<my-component-name>` 和 `<MyComponentName>` 都是可接受的。注意，尽管如此，直接在 DOM (即非字符串的模板) 中使用时只有 kebab-case 是有效的。

### 全局注册

到目前为止，我们只用过 `Vue.component` 来创建组件：

```js
Vue.component("my-component-name", {
  // ... 选项 ...
});
```

这些组件是全局注册的。也就是说它们在注册之后可以用在任何新创建的 Vue 根实例 (new Vue) 的模板中。比如：

```js
Vue.component("component-a", {
  /* ... */
});
Vue.component("component-b", {
  /* ... */
});
Vue.component("component-c", {
  /* ... */
});

new Vue({ el: "#app" });
```

```html
<div id="app">
  <component-a></component-a>
  <component-b></component-b>
  <component-c></component-c>
</div>
```

在所有子组件中也是如此，也就是说这三个组件在各自内部也都可以相互使用。

### 局部注册

全局注册往往是不够理想的。比如，如果你使用一个像 webpack 这样的构建系统，全局注册所有的组件意味着即便你已经不再使用一个组件了，它仍然会被包含在你最终的构建结果中。这造成了用户下载的 JavaScript 的无谓的增加。

在这些情况下，你可以通过一个普通的 JavaScript 对象来定义组件：

```js
var ComponentA = {
  /* ... */
};
var ComponentB = {
  /* ... */
};
var ComponentC = {
  /* ... */
};
```

然后在 `components` 选项中定义你想要使用的组件：

```js
new Vue({
  el: "#app",
  components: {
    "component-a": ComponentA,
    "component-b": ComponentB
  }
});
```

对于 `components` 对象中的每个 property 来说，其 property 名就是自定义元素的名字，其 property 值就是这个组件的选项对象。

注意**局部注册的组件在其子组件中不可用**。例如，如果你希望 `ComponentA`在 `ComponentB` 中可用，则你需要这样写：

```js
var ComponentA = {
  /* ... */
};

var ComponentB = {
  components: {
    "component-a": ComponentA
  }
  // ...
};
```

## 模块系统
