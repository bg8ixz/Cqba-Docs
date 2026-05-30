// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import backtotop from './components/backtotop.vue'  // 引入返回顶部组件
import ArticleInfo from './components/ArticleInfo.vue'  // 引入文章统计信息组件
import "vitepress-markdown-timeline/dist/theme/index.css";  // 引入时间线插件样式
import FriendsLink from './components/FriendsLink.vue'  // 引入友情链接组件
import TopBanner from './components/TopBanner.vue'  // 引入顶部 banner 公告组件

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 指定组件使用layout-top插槽
      'layout-top': () => h(TopBanner),
      // 指定组件使用doc-footer-before插槽
      'doc-footer-before': () => h(backtotop),   
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件，用于在文章中显示文章统计信息
    app.component('ArticleInfo', ArticleInfo); 
    // 全局注册友情链接组件，在 Markdown 里直接用
    app.component('FriendsLink', FriendsLink);
    // 动态添加busuanzi统计脚本
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
      script.async = true
      document.head.appendChild(script)
    }
  },
} satisfies Theme
