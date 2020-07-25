---
title: 组件基础
---

## 基本示例
这里有一个 Vue 组件的示例：
```js
// 定义一个名为 button-counter 的新组件
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
```
组件是可复用的 Vue 实例，且带有一个名字：在这个例子中是 `<button-counter>`。我们可以在一个通过 `new Vue` 创建的 Vue 根实例中，把这个组件作为自定义元素来使用：
```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```
```js
new Vue({ el: '#components-demo' })
```

## 组件的复用
每用一次组件，就会有一个它的新实例被创建。

### `data` 必须是一个函数
当我们定义这个 `<button-counter>` 组件时，你可能会发现它的 data 并不是像这样直接提供一个对象：
```js
data: {
  count: 0
}
```

**一个组件的 data 选项必须是一个函数**，因此每个实例可以维护一份被返回对象的独立的拷贝：
```js
data: function () {
  return {
    count: 0
  }
}
```

## 监听子组件事件
### 在组件上使用 v-model
自定义事件也可以用于创建支持 `v-model` 的自定义输入组件。记住：
```html
<input v-model="searchText">
```
等价于：
```html
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```

当用在组件上时，`v-model` 则会这样：
```html
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```

为了让它正常工作，这个组件内的 `<input>` 必须：
- 将其 `value` attribute 绑定到一个名叫 `value` 的 prop 上
- 在其 `input` 事件被触发时，将新的值通过自定义的 `input` 事件抛出

写成代码之后是这样的：
```js
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})
```

现在 `v-model` 就应该可以在这个组件上完美地工作起来了：
```html
<custom-input v-model="searchText"></custom-input>
```

## 动态组件
有的时候，在不同组件之间进行动态切换是非常有用的。可以通过 Vue 的 `<component>` 元素加一个特殊的 `is` attribute 来实现：
```html
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component v-bind:is="currentTabComponent"></component>
```
在上述示例中，currentTabComponent 可以包括

- 已注册组件的名字，或
- 一个组件的选项对象


## 解析 DOM 模板时的注意事项
有些 HTML 元素，诸如 `<ul>`、`<ol>`、`<table>` 和 `<select>`，对于哪些元素可以出现在其内部是有严格限制的。而有些元素，诸如 `<li>`、`<tr>` 和 `<option>`，只能出现在其它某些特定的元素内部。

这会导致我们使用这些有约束条件的元素时遇到一些问题。例如：
```html
<table>
  <blog-post-row></blog-post-row>
</table>
```
这个自定义组件 `<blog-post-row>` 会被作为无效的内容提升到外部，并导致最终渲染结果出错。幸好这个特殊的 `is` attribute 给了我们一个变通的办法：
```html
<table>
  <tr is="blog-post-row"></tr>
</table>
```

需要注意的是如果我们从**以下来源使用模板的话，这条限制是不存在的**：
- 字符串 (例如：`template: '...'`)
- 单文件组件 (`.vue`)
- `<script type="text/x-template">`
