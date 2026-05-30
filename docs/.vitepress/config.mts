import { defineConfig } from 'vitepress'
import autoFrontmatter from 'vitepress-plugin-setfrontmatter'
import { createRewrites } from "vitepress-plugin-permalink";
import { withSidebar } from 'vitepress-sidebar';
import timeline from "vitepress-markdown-timeline";
import nav from './nav.mts';    // 导入导航栏配置数组
import sidebar  from './sidebar.mts';   // 侧边导航栏配置数组（采用静态方式时使用）
import { generateSidebar } from './utils/generateSidebar.mjs';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "CQ·BA",
  titleTemplate: '记录电波与热爱',  // 网站副标题
  description: "关于业余无线电爱好者之间不得不说的那些事。",
  head: [
    ["link", { rel: "icon", href: "/images/logo/favicon.svg" }],
    ["link", { rel: "stylesheet", href: "//at.alicdn.com/t/c/font_5185174_wquzxldb85.css" }],
    // 新增 Umami 统计
    [
      "script",
      {
        src: "https://umami.imkee.com/style.css",
        "data-website-id": "55574370-f93c-425f-842a-d9a01fa5aaff"
      }
    ]
  ],
  // 路由重写 重写 使 用pages 访问，文档在 docs，所以必须传 srcDir: 'docs'，让插件去 docs 目录扫描 md 的 permalink。
  rewrites: createRewrites({
    srcDir: 'docs'
  }),
  cleanUrls: true,  // 启用简洁 URL
  ignoreDeadLinks: true, // 临时关闭死链检测，否则 Cloudflare 构建失败
  lastUpdated: true,  // 显示最后更新时间，本地测试是需要关闭
  vite: {
    plugins: [
      // 自动添加永久链接插件
      autoFrontmatter({
        pattern: '**/*.md',   // 处理所有Markdown文件
        globOptions: { ignore: [""] }, //忽略的文件或目录
        permalinkPrefix: 'pages', // 永久链接前缀，如设置为"/pages/"，生成的permalink为"/pages/xxxx",不设置则不会生成
        categories: true, // 是否启用自动添加frontmatter.categories分类功能
        transform: (frontmatter, fileInfo) => {
          // 根据文件路径添加标签
          const tags = []
          if (fileInfo.relativePath.includes('vue')) {
            tags.push('vue')
          }
          if (fileInfo.relativePath.includes('react')) {
            tags.push('react')
          }
          
          return {
            ...frontmatter,
            tags,
            // lastUpdated: new Date().toISOString()  // 在文档中插入最后更新时间
          }
        }
      }),
    ]
  },
  // 配置 Markdown 插件，用于在文章中显示文章统计信息
  markdown: {
    math: true,  // 启用数学公式插件
    config: (md) => {
      const originalRender = md.render.bind(md)
      // 注册时间线插件
      md.use(timeline);
      md.render = (src, env) => {
        const html = originalRender(src, env)
        // 获取当前文件的路径（相对路径，例如 'index.md' 或 'docs/index.md'）
        const filePath = env.relativePath || env.path || ''
        // 判断当前页面是不是首页
        const isRootIndex = filePath === 'index.md' || filePath.endsWith('/index.md')
        if (isRootIndex) {
          return html
        }
        // 如果 frontmatter 中标记了 noArticleInfo，则不插入组件
        if (env.frontmatter?.noArticleInfo) {
          return html
        }
        const startsWithH1 = /^\s*<h1/i.test(html.trimStart())
        if (startsWithH1) {
          // 第一个标签就是 H1 → 在 H1 结束后插入
          return html.replace(/(<h1.*?>.*?<\/h1>)/i, `$1<ArticleInfo />`)
        } else {
          // 不是以 H1 开头 → 顶部插入
          return `<ArticleInfo />${html}`
        }
      }
    }
  },

  // 主题配置
  themeConfig: {
    siteTitle: false, // 是否显示标题（有LOGO时关闭)
    logo: {
      light: '/images/logo/logo-black.png', // 浅色模式下显示的深色logo
      dark: '/images/logo/logo-white.png',  // 深色模式下显示的浅色logo
      alt: 'CQ·BA'
    },
    externalLinkIcon: true,   // 是否显示外部链接图标
    // https://vitepress.dev/reference/default-theme-config
    outline: {
      level: [2, 4],   // 显示 h2 和 h3 标题，默认是 2（只有 h2）
      label: '文章目录'  // 将 'On this page' 改为中文
    },
    langMenuLabel: '多语言',
    darkModeSwitchLabel: '主题模式',
    sidebarMenuLabel: '菜单',    // 移动端“菜单”按钮文字
    returnToTopLabel: '回到顶部', // 移动端“返回顶部”按钮文字
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    nav: nav, // 导航栏配置数组从 nav.mts 中导入
    
    sidebar: generateSidebar(), // 静态导入文件用 sidebar 动态用generateSidebar()生成
    // sidebar: [
    //   {
    //     text: '示例',
    //     items: [
    //       { text: 'Markdown 示例', link: '/markdown-examples' },
    //       { text: 'Runtime API 示例', link: '/api-examples' }
    //     ]
    //   }
    // ],

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
        dateStyle: 'medium',
        timeStyle: 'medium'
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
      title: '查无该页面',
      quote: '如果你不改变方向，并且执意探寻，那么你将成功获得 404 错误。',
      linkLabel: '返回首页',
      linkText: '点击这里返回主页'
    },
    footer:{
      message: '<a href="https://icp.gov.moe/?keyword=20267776" target="_blank">萌ICP备20267776号</a>',
      copyright: `&copy; 2009 - ${new Date().getFullYear()} CQBA.CN & BG8IXZ`
    }
  },
  // 配置 sitemap 插件
  sitemap: {
    hostname: 'https://docs.cqba.cn', // 域名要带协议头
    lastmodDateOnly: true,      // 是否只显示日期，不显示时间
  }
})