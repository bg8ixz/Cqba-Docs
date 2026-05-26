import { defineConfig } from 'vitepress'
import { set_sidebar } from "./utils/auto-gen-sidebar.mjs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "CQ·BA",
  titleTemplate: '业余无线电爱好者手册',
  description: "关于业余无线电爱好者之间不得不说的那些事。",
  head: [["link", { rel: "icon", href: "/images/logo/favicon.svg" }]],
  cleanUrls: true,  // 启用简洁 URL
  lastUpdated: true,  // 显示最后更新时间
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
          {text: '介绍',link: '/' },
          {text: '走进业余无线电',link: '/' },
          {text: '百宝箱',link: '/' },
        ]
      }
    ],

    sidebar: [
      {
        text: '示例',
        items: [
          { text: 'Markdown 示例', link: '/markdown-examples' },
          { text: 'Runtime API 示例', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/bg8ixz/Cqba-Docs' }
    ],
    // 编辑链接
    editLink: {
      pattern: 'https://github.com/bg8ixz/Cqba-Docs/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },
    // 显示最后更新时间
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'short'
      }
    },
    // 文档页脚
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    // 404 页面
    notFound: {
      code: '404',
      title: '页面未找到',
      quote: '您访问的页面不存在',
      linkLabel: '返回首页',
      linkText: '点击这里返回主页'
    },
    footer:{
      message: '<a href="https://icp.gov.moe/?keyword=20267776" target="_blank">萌ICP备20267776号</a>',
      copyright: '&copy; 2026 CQBA.CN & BG8IXZ'
    }
  }
})
