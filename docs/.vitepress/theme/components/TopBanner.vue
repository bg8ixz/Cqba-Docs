// closeExpire参数 0 = 关闭后永久不显示；1 = 关闭后本次会话有效，刷新就恢复；1d = 1天后恢复；7d = 7天后恢复；30d = 30天后恢复
<template>
  <div v-if="enabled && !isClosed" class="top-banner-container">
    <div class="banner-content">
      <div class="banner-slider">
        <div
          v-for="(banner, index) in banners"
          :key="index"
          class="banner-slide"
          :class="{
            active: index === currentIndex,
            leaving: index === prevIndex
          }"
        >
          <span class="banner-title">{{ banner.title }}</span>
        </div>
      </div>
      <a
        v-if="currentBanner.action"
        :href="currentBanner.link"
        target="_blank"
        rel="noopener noreferrer"
        class="banner-action"
      >
        {{ currentBanner.action }}
      </a>
      <button class="banner-close" @click="closeBanner">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import bannerConfig from '../../utils/banner.json'

const { enabled, scrollInterval, closeExpire, banners } = bannerConfig
const currentIndex = ref(0)
const prevIndex = ref(-1)
const isClosed = ref(false)
let timer = null
const route = useRoute()

// 缓存key，带版本标记，改公告后可以改key让所有用户重新看到
const CLOSE_KEY = 'top-banner-closed-v1'
const BANNER_HEIGHT = 56
const BANNER_HEIGHT_MOBILE = 48

const currentBanner = computed(() => banners[currentIndex.value])

// 全局禁用时，立即清除任何残留的偏移样式
if (!enabled) {
  document.documentElement.classList.remove('has-top-banner')
  document.documentElement.style.removeProperty('--top-banner-height')
}

const parseExpireTime = (expireStr) => {
  if (expireStr === 1 || expireStr === '1') return 0        // 仅会话关闭，不存时间
  if (expireStr === 0 || expireStr === '0') return Infinity     // 永久关闭
  const num = parseInt(expireStr)
  return Date.now() + num * 24 * 60 * 60 * 1000
}

const checkClosed = () => {
  if (closeExpire === 1 || closeExpire === '1') return false
  const closedData = localStorage.getItem(CLOSE_KEY)
  if (!closedData) return false
  if (closeExpire === 0 || closeExpire === '0') return true
  const expireTime = parseInt(closedData, 10)
  if (Date.now() > expireTime) {
    localStorage.removeItem(CLOSE_KEY)
    return false
  }
  return true
}

const setBannerOffset = (enable) => {
  const isMobile = window.innerWidth <= 640
  const offset = isMobile ? BANNER_HEIGHT_MOBILE : BANNER_HEIGHT
  if (enable) {
    document.documentElement.classList.add('has-top-banner')
    document.documentElement.style.setProperty('--top-banner-height', `${offset}px`)
  } else {
    document.documentElement.classList.remove('has-top-banner')
    document.documentElement.style.removeProperty('--top-banner-height')
  }
}

const closeBanner = () => {
  isClosed.value = true
  setBannerOffset(false)

  if (closeExpire === 1 || closeExpire === '1') return
  const expireTime = parseExpireTime(closeExpire)
  if (expireTime === Infinity) {
    localStorage.setItem(CLOSE_KEY, 'Infinity')
  } else {
    localStorage.setItem(CLOSE_KEY, expireTime.toString())
  }
}

const startAutoScroll = () => {
  if (banners.length <= 1) return
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % banners.length
  }, scrollInterval)
}

watch(currentIndex, (newVal, oldVal) => {
  prevIndex.value = oldVal
})

const handleResize = () => {
  if (!isClosed.value && enabled) setBannerOffset(true)
}

watch(
  () => route.path,
  () => {
    if (!isClosed.value && enabled) nextTick(() => setBannerOffset(true))
  }
)

onMounted(() => {
  isClosed.value = checkClosed()
  // 如果公告禁用或者用户已关闭，清除偏移，恢复默认布局
  if (!enabled || isClosed.value) {
    setBannerOffset(false)
  } else {
    setBannerOffset(true)
    startAutoScroll()
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  window.removeEventListener('resize', handleResize)
  setBannerOffset(false)
})
</script>

<style scoped>
/* 样式部分 */
.top-banner-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(90deg, #1a1a2e, #16213e);
  color: white;
  overflow: hidden;
  z-index: 1000;
}

.banner-content {
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 145px;
  gap: 16px;
  position: relative;
}

.banner-slider {
  flex: 1;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.banner-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateY(100%);
  transition: transform 0.6s ease, opacity 0.4s ease;
}

.banner-slide.active {
  opacity: 1;
  transform: translateY(0);
}

.banner-slide.leaving {
  opacity: 0;
  transform: translateY(-100%);
}

.banner-title {
  font-size: 1rem;
  line-height: 1.5;
  color: #e5e7eb;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.banner-action {
  flex-shrink: 0;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.banner-action:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.banner-close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
}

.banner-close:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

@media (max-width: 640px) {
  .banner-content {
    height: 48px;
    padding: 0 12px;
    gap: 8px;
  }
  .banner-title {
    font-size: 0.85rem;
  }
  .banner-action {
    padding: 4px 10px;
    font-size: 0.8rem;
  }
}
</style>

<style>
/* 全局样式：当存在顶部公告栏时，调整 VitePress 布局 */
html.has-top-banner {
  --banner-offset: var(--top-banner-height, 56px);
}

/* 导航栏和侧边栏下移 */
html.has-top-banner .VPNavBar,
html.has-top-banner .VPSidebar {
  top: var(--banner-offset) !important;
  transition: top 0.3s ease;
}

/* 右侧大纲容器下移 */
html.has-top-banner .VPDocAside {
  top: calc(var(--vp-nav-height, 0px) + var(--banner-offset)) !important;
  transition: top 0.3s ease;
}

html.has-top-banner .VPContent {
  padding-top: calc(var(--vp-nav-height, 64px) + var(--banner-offset)) !important;
}

@media (max-width: 640px) {
  html.has-top-banner {
    --banner-offset: 48px;
  }
  html.has-top-banner .outline-marker {
    top: calc(25px + var(--banner-offset)) !important;
  }
}
</style>