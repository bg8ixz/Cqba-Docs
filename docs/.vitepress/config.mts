import { defineConfig } from 'vitepress'
import autoFrontmatter from 'vitepress-plugin-setfrontmatter'
import { createRewrites } from "vitepress-plugin-permalink";
import Sidebar from 'vitepress-plugin-sidebar-resolve';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "CQ·BA",
  titleTemplate: '业余无线电爱好者手册',
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
  lastUpdated: false,  // 显示最后更新时间，本地测试是需要关闭
  vite: {
    plugins: [
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
            lastUpdated: new Date().toISOString()
          }
        }
      }),
      Sidebar({
        resolveRule: 'rewrites',    // 基于 rewrites 后的虚拟路径生成侧边栏
        path: '',   // 扫描根目录（默认是 srcDir，即 docs 文件夹）
        titleFormMd: true,    // 是否从 md 文件读取一级标题作为侧边栏文本（推荐 true）
        collapsed: true,   // 是否折叠侧边栏（可设为 true 或 false）
        ignoreIndexMd: true,    // 忽略 index.md（避免每个目录下出现多余的条目）
        fileIndexPrefix: true,    // 文件名排序：如果文件名有数字前缀（如 01.xxx.md），插件会自动排序并去除序号
        defaultSortNum: 9999,    // 排序默认值
        scannerRootMd: true,    // 是否扫描根目录下的 md 文件（默认是 false）
        initItems: true,    // 是否初始化侧边栏（默认是 true）
        initItemsText: true,    // 是否初始化第一层 items 的 text 为当前目录名，当 initItems 为 true 时生效。
        // 自定义前缀转换函数，用于在侧边栏中添加图标
        prefixTransform: prefix => {
          // 判断是否为 HTML 标签
          const htmlTagRegex = /^<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/;
          if (htmlTagRegex.test(prefix)) return prefix;

          return `<i class="iconfont ${prefix}"></i> `;
        },
      })
    ]
  },
  // 配置 Markdown 插件，用于在文章中显示文章统计信息
  markdown: {	
    // 组件插入h1标题下
    config: (md) => {	
      // 使用 markdown-it 插件
      md.use((md) => {	
        // 渲染规则：在 H1 标签结束后插入组件
        const originalHeadingClose = md.renderer.rules.heading_close || function (tokens, idx, options, env, self) {	
          return self.renderToken(tokens, idx, options);	
        };	

        md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {	
          const htmlResult = originalHeadingClose(tokens, idx, options, env, slf);	

          // 只有当标题是 h1 时才插入
          if (tokens[idx].tag === 'h1') {	
            return htmlResult + `<ArticleInfo />`;	
          }	

          return htmlResult;	
        };	
      })	
    }	
  },

  // 主题配置
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
          {text: '介绍',link: '/pages/dabbca' },
          {text: '走进业余无线电',link: '/pages/35f753' },
          {text: '百宝箱',link: '/pages/c4ff56' },
        ]
      }
    ],

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
