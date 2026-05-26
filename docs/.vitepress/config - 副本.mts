import { defineConfig } from 'vitepress'
import { set_sidebar } from "./utils/auto-gen-sidebar.mjs";

// 定义 rewrites 规则
const rewrites = {
  'HamCQ/00-介绍/:slug*': 'HamCQ/:slug*',
  'HamCQ/01.走进业余无线电/:slug*': 'HamCQ/getting-started/:slug*',
  'HamCQ/03.百宝箱/:slug*': 'HamCQ/misc/:slug*',
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "CQ·BA",
  description: "CQ吧站点描述。",
  head: [["link", { rel: "icon", href: "/images/logo/favicon.svg" }]],
  cleanUrls: true,  // 启用简洁 URL
  rewrites: rewrites,
  themeConfig: {
    siteTitle: false, // 是否显示标题（有LOGO时关闭)
    logo: '/images/logo/logo.png',
    // https://vitepress.dev/reference/default-theme-config
    outline: {
      level: [2, 4],   // 显示 h2 和 h3 标题，默认是 2（只有 h2）
      label: '页面导航'  // 将 'On this page' 改为中文
    },
    nav: [
      { text: '主页', link: '/' },
      { text: '示例', link: '/markdown-examples' },
      { text: 'HamCQ',
        items: [
          {text: '介绍',link: '/HamCQ/' },
          {text: '走进业余无线电',link: '/HamCQ/getting-started/' },
          {text: '百宝箱',link: '/HamCQ/misc/' },
        ]
      }
    ],

    // 自动生成侧边标题
    sidebar: {
      "/HamCQ/": set_sidebar("/HamCQ/00-介绍/", rewrites),
      "/HamCQ/getting-started/": set_sidebar("/HamCQ/01.走进业余无线电/", rewrites),
      "/HamCQ/misc/": set_sidebar("/HamCQ/03.百宝箱/", rewrites),
    },  
    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    footer:{
      message: '<a href="https://icp.gov.moe/?keyword=20267776" target="_blank">萌ICP备20267776号</a>',
      copyright: '&copy; 2026 CQBA.CN & BG8IXZ'
    }
  }
})
