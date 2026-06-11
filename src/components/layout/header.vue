<template>
  <header class="app-header">
    <div class="header-container">
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
</template>

<script setup lang="ts">
import { APP_META } from '/@/configs/app.config'
import { useTheme } from '/@/composables/theme'
import { useGlobalState } from '/@/app/state'

const theme = useTheme()
const isDark = theme.isDark
const globalState = useGlobalState()

const navItems = [
  { path: '/', label: '首页' },
  { path: '/archive', label: '归档' },
  { path: '/guestbook', label: '留言' },
  { path: '/about', label: '关于' }
]

const openSearch = () => {
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
  @include backdrop-blur(10px);
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
  letter-spacing: 0.1em;

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
  color: var(--color-link);
  transition: all 0.2s;

  &:hover {
    color: var(--color-link-hover);
    background-color: var(--module-bg-darker-1);
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
</style>
