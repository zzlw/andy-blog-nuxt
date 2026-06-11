/**
 * @file 客户端入口
 */

import { createWebHistory } from 'vue-router'
import { createHead } from '@unhead/vue/client'
import { createMainApp } from '/@/app/main'
import { Theme } from '/@/composables/theme'
import { useIdentityStore } from '/@/stores/identity'
import { getSSRContextValue } from '/@/app/universal'

import 'highlight.js/styles/atom-one-dark.css'
import '/@/styles/app.scss'

declare global {
  interface Window {
    initialTheme?: string
  }
}

const { app, router, store, globalState, getGlobalHead } = createMainApp({
  routerHistoryCreator: createWebHistory,
  userAgent: navigator.userAgent,
  theme: (window.initialTheme as Theme) ?? Theme.Light,
  error: getSSRContextValue('error') ?? null
})

const head = createHead({
  disableCapoSorting: true,
  init: [getGlobalHead()]
})
app.use(head)

// 用 SSR 注入状态还原 pinia
store.hydrateOnClient()

router.isReady().finally(() => {
  app.mount('#app', true).$nextTick(() => {
    globalState.setHydrate()
    useIdentityStore(store.pinia).initOnClient()
  })
})
