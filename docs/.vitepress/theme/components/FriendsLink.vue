<template>
  <div class="friends-container">
    <h2 class="friends-title">友情链接</h2>
    <div class="friends-list">
      <a 
        v-for="item in friendsList" 
        :key="item.name"
        :href="item.link"
        target="_blank"
        rel="noopener noreferrer"
        class="friend-item"
        :title="item.details || item.name"
      >
        <img v-if="item.icon" :src="item.icon" alt="" class="friend-icon">
        <span>{{ item.name }}</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import friendsList from '../../utils/friends.json'
</script>

<style scoped>
/* 友链区域整体容器控制最大宽度、居中 */
.friends-container {
  margin: 0 auto;             /* 水平居中 */
  max-width: 1152px;          /* 最大宽度 */
  margin-top: 5rem; /* 给友链和上面的内容留一点间距 */
  margin-bottom: -50px; /* 根据实际偏移量调整 */
}

/* 友链标题样式、间距、颜色 */
.friends-title {
  text-align: center;         /* 居中 */
  margin: 32px 0 20px;        /* 上下间距 */
  font-size: 18px;            /* 字体大小 */
  font-weight: 600;           /* 字体粗细 */
  color: var(--vp-c-text-2);  /* 文字颜色（适配深浅模式） */
  /* border-top: none;   */        /* 去除上边线 H2 样式独有分隔线 */
}

/* 友链列表弹性布局、居中、紧凑间距 */
.friends-list {
  display: flex;              /* 弹性布局 */
  flex-wrap: wrap;            /* 空间不够自动换行 */
  justify-content: center;    /* 水平居中 */
  gap: 10px;                  /* 按钮之间间距（原版10px，非常紧凑） */
}

/* 友链按钮 */
.friend-item {
  display: inline-flex;       /* 图标+文字同行 */
  align-items: center;        /* 垂直居中 */
  gap: 6px;                   /* 图标与文字间距 */
  padding: 6px 14px;          /* 按钮内边距（控制大小） */
  border: 1px solid var(--vp-c-divider); /* 边框 */
  border-radius: 20px;        /* 圆角 */
  background: var(--vp-c-bg-soft);     /* 背景色 */
  color: var(--vp-c-text-2);  /* 文字颜色 */
  font-size: 13px;            /* 文字大小 */
  font-weight: 500;           /* 文字粗细 */
  text-decoration: none;      /* 去掉下划线 */
  transition: all .2s ease;   /* 平滑过渡 */
  white-space: nowrap;        /* 禁止文字换行 */
}

/* 鼠标悬浮效果 */
.friend-item:hover {
  border-color: var(--vp-c-brand-1);   /* 边框变主题色 */
  color: var(--vp-c-brand-1);          /* 文字变主题色 */
  background: var(--vp-c-brand-soft);  /* 背景变浅主题色 */
  transform: translateY(-1px);         /* 轻微上浮 */
  box-shadow: 0 2px 8px #00000014;     /* 柔和阴影 */
}

/* 友链图标 */
.friend-icon {
  width: 18px;               /* 图标宽度 */
  height: 18px;              /* 图标高度 */
  object-fit: contain;        /* 保持比例 */
  border-radius: 3px;        /* 轻微圆角 */
  flex-shrink: 0;            /* 不让图标被挤压变形 */
}
</style>