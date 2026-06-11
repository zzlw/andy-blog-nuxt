<template>
  <header class="app-header">
    <div class="header-container">
      <button class="action-btn menu-btn" title="菜单" @click="drawerVisible = !drawerVisible">☰</button>
      <router-link to="/" class="logo">
        <span class="logo-text">{{ APP_META.title }}</span>
      </router-link>
      <nav class="nav">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item">
          {{ item.label }}
        </router-link>
      </nav>
      <div class="actions">
        <button class="action-btn" title="搜索" @click="openSearch">⌕</button>
        <button class="action-btn" :title="isDark ? '切换到亮色' : '切换到暗色'" @click="theme.toggle()">
          {{ isDark ? '☀' : '☾' }}
        </button>
      </div>
    </div>
  </header>

  <!-- 窄屏抽屉导航（纯响应式，宽屏下不渲染交互入口） -->
  <transition name="fade">
    <div v-if="drawerVisible" class="drawer-mask" @click="drawerVisible = false"></div>
  </transition>
  <aside class="drawer" :class="{ visible: drawerVisible }">
    <nav class="drawer-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="drawer-item"
        @click="drawerVisible = false"
      >
        {{ item.label }}
      </router-link>
    </nav>
    <div v-if="categories.length" class="drawer-section">
      <h3 class="section-title">分类</h3>
      <router-link
        v-for="category in categories"
        :key="category.id"
        :to="`/category/${category.id}`"
        class="drawer-item"
        @click="drawerVisible = false"
      >
        {{ category.name }}
      </router-link>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { APP_META } from '/@/configs/app.config'
import { useTheme } from '/@/composables/theme'
import { useGlobalState } from '/@/app/state'
import { useCategoriesStore } from '/@/stores/meta'

const theme = useTheme()
const isDark = theme.isDark
const globalState = useGlobalState()
const drawerVisible = globalState.switcher.drawerVisible
const categoriesStore = useCategoriesStore()
const categories = computed(() => categoriesStore.data)

const navItems = [
  { path: '/', label: '首页' },
  { path: '/archive', label: '归档' },
  { path: '/guestbook', label: '留言' },
  { path: '/about', label: '关于' }
]

const openSearch = () => {
  drawerVisible.value = false
  globalState.switcher.searchVisible.value = true
}
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: $navbar-height;
  background-color: var(--module-bg);
  border-bottom: 1px solid var(--color-text-divider);
  @include backdrop-blur(12px);
}

.header-container {
  height: 100%;
  max-width: $container-width;
  margin: 0 auto;
  padding: 0 $gap-lg;
  display: flex;
  align-items: center;
  gap: $gap-lg;
}

.logo {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-darker);
  letter-spacing: 0.12em;

  &:hover .logo-text {
    color: var(--color-primary);
  }
}

.nav {
  flex: 1;
  display: flex;
  gap: $gap-sm;
}

.nav-item {
  padding: 0.3em 0.8em;
  border-radius: $radius;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  transition: color 0.2s;

  &:hover {
    color: var(--color-text-darker);
  }

  &.router-link-active {
    color: var(--color-primary);
    font-weight: 600;
  }
}

.actions {
  display: flex;
  gap: $gap-sm;
}

.action-btn {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: $radius;
  font-size: 1.1rem;
  color: var(--color-text);
  transition: all 0.2s;

  &:hover {
    color: var(--color-primary);
    background-color: var(--module-bg-darker-1);
  }
}

.menu-btn {
  display: none;
}

.drawer-mask {
  position: fixed;
  inset: 0;
  z-index: 198;
  background-color: rgba(0, 0, 0, 0.4);
}

.drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 199;
  width: 70vw;
  max-width: 300px;
  padding: calc(#{$navbar-height} + #{$gap}) $gap $gap;
  background-color: var(--module-bg-opaque);
  transform: translateX(-100%);
  transition: transform 0.25s ease;
  overflow-y: auto;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
}

.drawer-item {
  display: block;
  padding: 0.6em 0.8em;
  border-radius: $radius;
  color: var(--color-link);

  &.router-link-active {
    color: var(--color-primary);
    background-color: var(--module-bg-darker-1);
  }
}

.drawer-section {
  margin-top: $gap-lg;

  .section-title {
    padding: 0 0.8em;
    margin-bottom: $gap-sm;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-secondary);
  }
}

@include mobile {
  .header-container {
    gap: $gap;
    padding: 0 $gap;
  }

  .menu-btn {
    display: block;
  }

  .logo {
    flex: 1;
    text-align: center;
  }

  .nav {
    display: none;
  }

  .drawer.visible {
    transform: translateX(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
