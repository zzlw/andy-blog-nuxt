/**
 * @file 路由（含 SSR 页面缓存 TTL meta）
 */

import {
  createRouter,
  type Router,
  type RouterHistory,
  type RouteRecordRaw
} from 'vue-router'
import { createAppError } from './error'
import { NOT_FOUND, BAD_REQUEST } from '/@/constants/http-code'

import IndexPage from '/@/pages/index.vue'

declare module 'vue-router' {
  interface RouteMeta {
    /** SSR 页面缓存秒数；不设置则不缓存 */
    ssrCacheTTL?: number
  }
}

const validateNumberParam = (value: string | string[], name: string) => {
  const raw = Array.isArray(value) ? value[0] : value
  if (!/^\d+$/.test(raw)) {
    throw createAppError(`无效的 ${name}`, BAD_REQUEST)
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: IndexPage,
    meta: { ssrCacheTTL: 60 }
  },
  {
    path: '/article/:id',
    name: 'article-detail',
    component: () => import('/@/pages/article.vue'),
    meta: { ssrCacheTTL: 60 },
    beforeEnter: (to) => {
      validateNumberParam(to.params.id, '文章 ID')
    }
  },
  {
    path: '/category/:id',
    name: 'category',
    component: () => import('/@/pages/category.vue'),
    meta: { ssrCacheTTL: 300 },
    beforeEnter: (to) => {
      validateNumberParam(to.params.id, '分类 ID')
    }
  },
  {
    path: '/tag/:id',
    name: 'tag',
    component: () => import('/@/pages/tag.vue'),
    meta: { ssrCacheTTL: 300 },
    beforeEnter: (to) => {
      validateNumberParam(to.params.id, '标签 ID')
    }
  },
  {
    path: '/archive',
    name: 'archive',
    component: () => import('/@/pages/archive.vue'),
    meta: { ssrCacheTTL: 300 }
  },
  {
    path: '/guestbook',
    name: 'guestbook',
    component: () => import('/@/pages/guestbook.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('/@/pages/about.vue'),
    meta: { ssrCacheTTL: 3600 }
  },
  {
    path: '/search/:keyword',
    name: 'search',
    component: () => import('/@/pages/search.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('/@/pages/not-found.vue'),
    beforeEnter: () => {
      throw createAppError('页面不存在', NOT_FOUND)
    }
  }
]

export interface RouterCreatorOptions {
  history: RouterHistory
}

export const createUniversalRouter = (options: RouterCreatorOptions): Router => {
  return createRouter({
    routes,
    history: options.history,
    strict: true,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.path !== from.path) return { top: 0 }
      return {}
    }
  })
}
