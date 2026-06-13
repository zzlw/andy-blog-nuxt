import type { RouterConfig } from '@nuxt/schema'

/**
 * 自定义滚动行为：
 * - 浏览器前进/后退：恢复历史滚动位置
 * - 带 hash：平滑滚到锚点（留出顶部导航高度）
 * - 普通路由切换：瞬时回到顶部（避免与全局平滑滚动叠加，出现“从底部滑到顶部”的怪异动画）
 */
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, top: 72, behavior: 'smooth' }
    }
    return { top: 0, left: 0 }
  },
}
