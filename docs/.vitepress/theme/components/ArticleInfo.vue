<!-- .vitepress/theme/components/ArticleInfo.vue -->
<script setup lang="ts">
import { useData } from 'vitepress'
import { ref, onMounted, computed, onUnmounted, nextTick, watch } from 'vue'
import { countWord, formatDate, calculateReadTime, countTransK } from '../../utils/tools'

const formatWordCount = (count: number): string => {
    // 如果字数大于等于 1000
    if (count >= 1000) {
        // 除以 1000 并保留 1 位小数，加上 'k'
        return (count / 1000).toFixed(1) + 'k'
    }
    // 小于 1000 直接返回原数字
    return count.toString()
}

const { frontmatter, page } = useData()

// --- 日期处理 ---
const dateFormatter = formatDate()
const format = (date: string | number | Date | undefined) => {
    if (!date) return ''
    return dateFormatter.format(new Date(date)).replace(/\//g, '-')
}

// 优先显示 frontmatter.date 作为发布时间，否则为空
const firstCommit = computed(() => format(frontmatter.value.date || frontmatter.value.firstCommit))
const lastUpdated = computed(() => format(frontmatter.value.lastUpdated || page.value.lastUpdated))

// --- 字数与阅读时间统计 ---
const wordCount = ref(0)
const readTime = ref(0)

const updateStats = () => {
    const docDomContainer = document.querySelector('#VPContent')
    if (!docDomContainer) return

    // 统计图片
    const imgs = docDomContainer.querySelectorAll('.content-container .main img')
    const imageCount = imgs.length

    // 统计文字
    const content = docDomContainer.querySelector('.content-container .main')?.textContent || ''
    const words = countWord(content)
    wordCount.value = words

    // 计算阅读时间
    readTime.value = calculateReadTime(words, imageCount)
}

// --- PV 统计 (监听 Busuanzi 或其他脚本写入) ---
const pv = ref('-') // 初始状态 ∞ 或者 -
let observer: MutationObserver | null = null

// 20260527 新增：手动刷新 PV 的函数
const refreshPV = () => {
  // 方式1：使用 busuanzi 的 fetch 方法
  if (window.busuanzi && typeof window.busuanzi.fetch === 'function') {
    window.busuanzi.fetch()
    // 等待写入完成后更新显示（通过 observer 自动处理，也可以直接读取）
    setTimeout(() => {
      const pvEl = document.getElementById('busuanzi_value_page_pv')
      if (pvEl && pvEl.textContent) {
        const val = parseInt(pvEl.textContent)
        if (!isNaN(val)) {
          pv.value = countTransK(val)
        }
      }
    }, 300)
    return
  }

  // 方式2：如果 fetch 方法不存在，重新注入脚本
  const existingScript = document.querySelector('script[src*="busuanzi.pure.mini.js"]')
  if (existingScript) {
    // 移除旧脚本再重新添加，强制重新执行
    existingScript.remove()
  }
  const script = document.createElement('script')
  script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
  script.async = true
  document.head.appendChild(script)
}

const initPVObserver = () => {
    // 1. 寻找 Busuanzi 生成的标准 ID
    let pvEl = document.getElementById('busuanzi_value_page_pv')

    // 2. 如果没找到，尝试寻找我们自定义的隐藏 span (兼容性处理)
    if (!pvEl) {
        pvEl = document.getElementById('vercount_value_page_pv')
    }

    if (!pvEl) {
        pv.value = '-'
        return
    }

    const readPv = () => {
        const text = pvEl.textContent?.trim()
        if (text) {
            const val = parseInt(text)
            if (!isNaN(val)) {
                pv.value = countTransK(val)
                if (observer) observer.disconnect() // 获取成功后停止监听
            }
        }
    }

    if (pvEl.textContent) readPv()
    else {
        observer = new MutationObserver(readPv)
        observer.observe(pvEl, { childList: true, characterData: true, subtree: true })
    }
}

// --- 生命周期 ---
onMounted(() => {
    nextTick(() => {
        updateStats()
        initPVObserver()
        refreshPV()    // 初次加载确保刷新统计（如果脚本已存在但未写入）
    })
})

onUnmounted(() => {
    observer?.disconnect()
})

// 监听路由变化，刷新 PV
watch(
    () => page.value.relativePath,
    () => {
        pv.value = '...'    // 先显示加载中
        nextTick(() => {
            updateStats()   // 更新字数、阅读时间
            if (observer) observer.disconnect()     // 断开旧的 observer
            refreshPV()     // 触发不蒜子重新计数
            initPVObserver()    // 重新绑定 observer 监听新写入的值
        })
    }
)
</script>

<template>
    <div class="article-info">
        <!-- 必须保留这个隐藏的 span，供 Busuanzi 脚本写入数据 -->
        <span id="busuanzi_container_page_pv"
            style="position: absolute; width: 0; height: 0; overflow: hidden; opacity: 0; pointer-events: none;">
            <span id="busuanzi_value_page_pv"></span>
        </span>

        <div class="info-item" v-if="firstCommit" title="发布时间">
            <svg fill="none" viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="m17 3h4c.2652 0 .5196.10536.7071.29289.1875.18754.2929.44189.2929.70711v16c0 .2652-.1054.5196-.2929.7071s-.4419.2929-.7071.2929h-18c-.26522 0-.51957-.1054-.70711-.2929-.18753-.1875-.29289-.4419-.29289-.7071v-16c0-.26522.10536-.51957.29289-.70711.18754-.18753.44189-.29289.70711-.29289h4v-2h2v2h6v-2h2zm-13 6v10h16v-10zm2 2h2v2h-2zm0 4h2v2h-2zm4-4h8v2h-8zm0 4h5v2h-5z"
                    fill="#8a8a8a" />
            </svg>
            <span>发布于: {{ firstCommit }}</span>
        </div>

        <div class="info-item" v-if="lastUpdated" title="更新时间">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 48 48">
                <path
                    d="M24,4C13,4,4,13,4,24s9,20,20,20s20-9,20-20S35,4,24,4z M31.5,27h-8c-0.8,0-1.5-0.7-1.5-1.5v-12c0-0.8,0.7-1.5,1.5-1.5	s1.5,0.7,1.5,1.5V24h6.5c0.8,0,1.5,0.7,1.5,1.5S32.3,27,31.5,27z"
                    fill="#8a8a8a">
                </path>
            </svg>
            <span>更新于: {{ lastUpdated }}</span>
        </div>

        <div class="info-item" title="字数统计">
            <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
                <path
                    d="M204.8 0h477.866667l273.066666 273.066667v614.4c0 75.093333-61.44 136.533333-136.533333 136.533333H204.8c-75.093333 0-136.533333-61.44-136.533333-136.533333V136.533333C68.266667 61.44 129.706667 0 204.8 0z m307.2 607.573333l68.266667 191.146667c13.653333 27.306667 54.613333 27.306667 61.44 0l102.4-273.066667c6.826667-20.48 0-34.133333-20.48-40.96s-34.133333 0-40.96 13.653334l-68.266667 191.146666-68.266667-191.146666c-13.653333-27.306667-54.613333-27.306667-68.266666 0l-68.266667 191.146666-68.266667-191.146666c-6.826667-13.653333-27.306667-27.306667-47.786666-20.48s-27.306667 27.306667-20.48 47.786666l102.4 273.066667c13.653333 27.306667 54.613333 27.306667 61.44 0l75.093333-191.146667z"
                    fill="#777777"></path>
            </svg>
            <span>字数: {{ formatWordCount(wordCount) }}</span>
        </div>

        <div class="info-item" title="阅读时间">
            <svg class="icon" viewBox="0 0 1060 1024" width="16" height="16">
                <path
                    d="M556.726857 0.256A493.933714 493.933714 0 0 0 121.929143 258.998857L0 135.021714v350.390857h344.649143L196.205714 334.482286a406.820571 406.820571 0 1 1-15.908571 312.649143H68.937143A505.819429 505.819429 0 1 0 556.726857 0.256z m-79.542857 269.531429v274.907428l249.197714 150.966857 42.422857-70.070857-212.114285-129.389714V269.787429h-79.542857z"
                    fill="#8a8a8a"></path>
            </svg>
            <span>时长: {{ readTime }} 分钟</span>
        </div>

        <div class="info-item" title="阅读量">
            <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
                <path
                    d="M512 512c-114.688 0-209.92-95.232-209.92-209.92S397.312 92.16 512 92.16s209.92 95.232 209.92 209.92S626.688 512 512 512z"
                    fill="#8a8a8a"></path>
                <path
                    d="M906.24 931.84c-20.48-266.24-245.76-389.12-394.24-389.12S137.216 665.6 117.76 931.84c0 20.48 15.36 35.84 35.84 35.84h716.8c20.48 0 35.84-15.36 35.84-35.84z"
                    fill="#8a8a8a"></path>
            </svg>
            <span>阅读量: {{ pv }}</span>
        </div>
    </div>
</template>

<style scoped>
.article-info {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    color: var(--vp-c-text-2);
    font-size: 0.9rem;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    fill: currentColor;
    opacity: 0.8;
}
</style>