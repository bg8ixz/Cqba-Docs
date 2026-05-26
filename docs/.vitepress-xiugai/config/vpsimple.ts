export const VpSimpleConfig = {
  "srcDir": "./",
  "vpsimple": {
    "shellBaseDir": "",
    "gitBaseDir": "",
    "cmdDocsDev": "npm run docs:dev",
    "cmdDocsBuild": "npm run docs:build",
    "cmdNpmInstall": "npm install",
    "cmdGitInit": "git init",
    "cmdGitPull": "git pull",
    "cmdGitAdd": "git add .",
    "cmdGitCommit": "git commit -m 'autoupdate'",
    "cmdGitPush": "git push"
  },
  "assetsDir": "static",
  "sitemap": {
    "hostname": "https://example.com",
    "lastmodDateOnly": false
  },
  "themeConfig": {
    "externalLinkIcon": false,
    "i18nRouting": true,
    "logo": "\\images\\logo.png",
    "socialLinks": [
      {
        "icon": "github",
        "link": "https://github.com/vuejs/vitepress"
      }
    ],
    "outline": {
      "level": "4",
      "label": "On this page"
    },
    "search": {
      "provider": "local",
      "options": {
        "appId": "",
        "apiKey": "",
        "indexName": "",
        "locales": {
          "zh": {
            "placeholder": "搜索文档",
            "translations": {
              "button": {
                "buttonText": "搜索文档",
                "buttonAriaLabel": "搜索文档"
              },
              "modal": {
                "searchBox": {
                  "resetButtonTitle": "清除查询条件",
                  "resetButtonAriaLabel": "清除查询条件",
                  "cancelButtonText": "取消",
                  "cancelButtonAriaLabel": "取消"
                },
                "startScreen": {
                  "recentSearchesTitle": "搜索历史",
                  "noRecentSearchesText": "没有搜索历史",
                  "saveRecentSearchButtonTitle": "保存至搜索历史",
                  "removeRecentSearchButtonTitle": "从搜索历史中移除",
                  "favoriteSearchesTitle": "收藏",
                  "removeFavoriteSearchButtonTitle": "从收藏中移除"
                },
                "errorScreen": {
                  "titleText": "无法获取结果",
                  "helpText": "你可能需要检查你的网络连接"
                },
                "footer": {
                  "selectText": "选择",
                  "navigateText": "切换",
                  "closeText": "关闭",
                  "searchByText": "搜索提供者"
                },
                "noResultsScreen": {
                  "noResultsText": "无法找到相关结果",
                  "suggestedQueryText": "你可以尝试查询",
                  "reportMissingResultsText": "你认为该查询应该有结果？",
                  "reportMissingResultsLinkText": "点击反馈"
                }
              }
            }
          },
          "en": {
            "placeholder": "Search docs",
            "translations": {
              "button": {
                "buttonText": "Search docs",
                "buttonAriaLabel": "Search docs"
              },
              "modal": {
                "searchBox": {
                  "resetButtonTitle": "Clear query",
                  "resetButtonAriaLabel": "Clear query",
                  "cancelButtonText": "Cancel",
                  "cancelButtonAriaLabel": "Cancel"
                },
                "startScreen": {
                  "recentSearchesTitle": "Recent searches",
                  "noRecentSearchesText": "No recent searches",
                  "saveRecentSearchButtonTitle": "Save search",
                  "removeRecentSearchButtonTitle": "Remove search",
                  "favoriteSearchesTitle": "Favorites",
                  "removeFavoriteSearchButtonTitle": "Remove from favorites"
                },
                "errorScreen": {
                  "titleText": "Unable to fetch results",
                  "helpText": "You may want to check your network connection"
                },
                "footer": {
                  "selectText": "select",
                  "navigateText": "navigate",
                  "closeText": "close",
                  "searchByText": "Search by"
                },
                "noResultsScreen": {
                  "noResultsText": "No results for",
                  "suggestedQueryText": "You can try searching for",
                  "reportMissingResultsText": "You think it should have results?",
                  "reportMissingResultsLinkText": "Click here to report it"
                }
              }
            }
          }
        }
      }
    },
    "langMenuLabel": "多语言",
    "returnToTopLabel": "回到顶部",
    "sidebarMenuLabel": "菜单",
    "darkModeSwitchLabel": "主题",
    "lightModeSwitchTitle": "切换到浅色模式",
    "darkModeSwitchTitle": "切换到深色模式",
    "editLink": {
      "text": "Edit this page on GitHub",
      "pattern": "https://github.com/zhangdi168/VitePressSimple/edit/main/docs/:path"
    },
    "docFooter": {
      "prev": "Previous page",
      "next": "Next Page"
    },
    "nav": [
      {
        "text": "首页",
        "link": "/"
      },
      {
        "text": "示例",
        "link": "/markdown-examples"
      }
    ],
    "sidebar": {},
    "siteTitle": "VitePressSimple",
    "footer": {
      "message": "",
      "copyright": ""
    }
  },
  "locales": {
    "en-US": {
      "label": "English",
      "lang": "en-US",
      "themeConfig": {
        "langMenuLabel": "多语言",
        "returnToTopLabel": "回到顶部",
        "sidebarMenuLabel": "菜单",
        "darkModeSwitchLabel": "主题",
        "lightModeSwitchTitle": "切换到浅色模式",
        "darkModeSwitchTitle": "切换到深色模式",
        "externalLinkIcon": true,
        "editLink": {
          "text": "Edit this page on GitHub",
          "pattern": "https://github.com/zhangdi168/VitePressSimple/edit/main/docs/:path"
        },
        "docFooter": {
          "prev": "Previous page",
          "next": "Next page"
        },
        "nav": [],
        "sidebar": {},
        "i18nRouting": true,
        "siteTitle": "这是一个网站",
        "footer": {
          "message": "第一行",
          "copyright": "第二行"
        }
      }
    },
    "/": {
      "label": "简体中文",
      "lang": "/",
      "themeConfig": {
        "langMenuLabel": "多语言",
        "returnToTopLabel": "回到顶部",
        "sidebarMenuLabel": "菜单",
        "darkModeSwitchLabel": "主题",
        "lightModeSwitchTitle": "切换到浅色模式",
        "darkModeSwitchTitle": "切换到深色模式",
        "externalLinkIcon": true,
        "editLink": {
          "text": "Edit this page on GitHub",
          "pattern": "https://github.com/zhangdi168/VitePressSimple/edit/main/docs/:path"
        },
        "docFooter": {
          "prev": "Previous page",
          "next": "Next page"
        },
        "nav": [],
        "sidebar": {},
        "i18nRouting": true,
        "siteTitle": "这是一个网站",
        "footer": {
          "message": "第一行",
          "copyright": "第二行"
        }
      }
    }
  },
  "cacheDir": "./.vitepress/cache",
  "title": "CQ·BA",
  "titleTemplate": "| 业余无线电爱好者的自留地",
  "description": "CQ吧站点描述。",
  "lang": "zh-CN",
  "base": "/",
  "outDir": "./.vitepress/dist",
  "cleanUrls": false,
  "rewrites": {
    "packages/pkg-a/src/pkg-a-docs.md": "pkg-a/index.md",
    "packages/pkg-b/src/pkg-b-docs.md": "pkg-b/index.md"
  },
  "cachePath": true
};
