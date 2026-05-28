import { defineConfig } from 'vitepress'
import autoFrontmatter from 'vitepress-plugin-setfrontmatter'
import { createRewrites } from "vitepress-plugin-permalink";
import Sidebar from 'vitepress-plugin-sidebar-resolve';
import timeline from "vitepress-markdown-timeline";

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
  ignoreDeadLinks: true, // 临时关闭死链检测，否则 Cloudflare 构建失败
  lastUpdated: false,  // 显示最后更新时间，本地测试是需要关闭
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
            lastUpdated: new Date().toISOString()
          }
        }
      }),
      // 侧边栏插件，用于根据文件路径自动生成侧边栏
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
          // 添加图标功能，在文档标题中使用 sidebarPrefix: icon-图标代码 来添加图标
          return `<i class="iconfont ${prefix}"></i> `;
        },
      })
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
    logo: '/images/logo/logo.png',
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
    nav: [
      { text: '主页', link: '/' },
      { text: '博客', link: '//imkee.com/' },
      { text: 'HamCQ',
        items: [
          {text: '介绍',link: '/pages/dabbca' },
          {text: '走进业余无线电',link: '/pages/35f753' },
          {text: '百宝箱',link: '/pages/c4ff56' },
        ]
      },
      { text: '更多',
        items: [
          {text: '关于本站',link: '/pages/8a6c4e' },
          {text: '侵权投诉',link: '/pages/ec90ef' },
          {text: '更新日志',link: '/pages/d4ed89' },
          {text: '参与贡献',link: '/pages/ee1c6e' },
        ]
      },
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
      title: '查无该页面',
      quote: '如果你不改变方向，并且执意探寻，那么你将成功获得 404 错误。',
      linkLabel: '返回首页',
      linkText: '点击这里返回主页'
    },
    footer:{
      message: '<a href="https://icp.gov.moe/?keyword=20267776" target="_blank">萌ICP备20267776号</a>',
      copyright: `&copy; 2009 - ${new Date().getFullYear()} CQBA.CN & BG8IXZ`
    }
  }
})
