---
categories:
  categories:
    - 
permalink: /pages/97b577
date: 2026-05-26 14:17:16
title: markdown-examples
tags: []
lastUpdated: 2026-05-26T09:35:35.971Z
---

# Markdown 扩展示例

本页面展示了 VitePress 提供的一些内置 Markdown 扩展功能。

## 代码高亮

VitePress 提供由 [Shiki](https://github.com/shikijs/shiki) 驱动的代码高亮功能，还支持行高亮等高级特性：

**输入**

````md
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

**输出**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## 自定义容器

**输入**

```md
::: info
这是一个信息框。
:::

::: tip
这是一个提示。
:::

::: warning
这是一个警告。
:::

::: danger
这是一个危险警告。
:::

::: details
这是一个详情块。
:::
```

**输出**

::: info
这是一个信息框。
:::

::: tip
这是一个提示。
:::

::: warning
这是一个警告。
:::

::: danger
这是一个危险警告。
:::

::: details
这是一个详情块。
:::

## 更多

查看文档以了解 [完整的 Markdown 扩展列表](https://vitepress.dev/guide/markdown)。
