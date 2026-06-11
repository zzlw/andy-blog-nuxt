<template>
  <header class="mobile-header">
    <button class="menu-btn" @click="sidebarVisible = !sidebarVisible">☰</button>
    <router-link to="/" class="logo">{{ APP_META.title }}</router-link>
    <div class="right-actions">
      <button class="menu-btn" @click="openSearch">⌕</button>
      <button class="menu-btn" @click="theme.toggle()">{{ isDark ? '☀' : '☾' }}</button>
    </div>
  </header>
  <transition name="fade">
    <div v-if="sidebarVisible" class="sidebar-mask" @click="sidebarVisible = false"></div>
  </transition>
  <aside class="mobile-sidebar" :class="{ visible: sidebarVisible }">
    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="sidebar-nav-item"
        @click="sidebarVisible = false"
      >
        {{ item.label }}
      </router-link>
    </nav>
    <div class="sidebar-section" v-if="categories.length">
      <h3 class="section-title">分类</h3>
      <router-link
        v-for="category in categories"
        :key="category.id"
        :to="`/category/${category.id}`"
        class="sidebar-nav-item"
        @click="sidebarVisible = false"
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
const sidebarVisible = globalState.switcher.mobileSidebarVisible
const categoriesStore = useCategoriesStore()
const categories = computed(() => categoriesStore.data)

const navItems = [
  { path: '/', label: '首页' },
  { path: '/archive', label: '归档' },
  { path: '/guestbook', label: '留言' },
  { path: '/about', label: '关于' }
]

const openSearch = () => {
  sidebarVisible.value = false
  globalState.switcher.searchVisible.value = true
}
</script>

<style lang="scss" scoped>
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: $navbar-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $gap;
  background-color: var(--module-bg);
  border-bottom: 1px solid var(--color-text-divider);
  @include backdrop-blur(10px);
}

.logo {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-darker);
}

.right-actions {
  display: flex;
  gap: $gap-sm;
}

.menu-btn {
  width: 2.2rem;
  height: 2.2rem;
  font-size: 1.2rem;
  color: var(--color-text);
}

.sidebar-mask {
  position: fixed;
  inset: 0;
  z-index: 198;
  background-color: rgba(0, 0, 0, 0.4);
}

.mobile-sidebar {
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

  &.visible {
    transform: translateX(0);
  }
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.sidebar-nav-item {
  display: block;
  padding: 0.6em 0.8em;
  border-radius: $radius;
  color: var(--color-link);

  &.router-link-active {
    color: var(--color-primary);
    background-color: var(--module-bg-darker-1);
  }
}

.sidebar-section {
  margin-top: $gap-lg;

  .section-title {
    padding: 0 0.8em;
    margin-bottom: $gap-sm;
    font-size: 0.85rem;
    color: var(--color-text-secondary);
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
