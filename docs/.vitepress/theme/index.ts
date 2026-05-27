// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import backtotop from './components/backtotop.vue'  // 引入返回顶部组件
import ArticleInfo from './components/ArticleInfo.vue'  // 引入文章统计信息组件

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 指定组件使用doc-footer-before插槽
      'doc-footer-before': () => h(backtotop),   
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件，用于在文章中显示文章统计信息
    app.component('ArticleInfo', ArticleInfo); 
  },
  // 把 busuanzi 统计载入
  head: [
    [
      'script',
      {
        src: '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js',
        async: true
      }
    ]
  ]
} satisfies Theme
