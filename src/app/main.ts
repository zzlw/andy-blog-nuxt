/**
 * @file 应用工厂（client/server 共用，对齐 surmon.me createMainApp）
 */

import { createSSRApp } from 'vue'
import type { RouterHistory } from 'vue-router'
import type { SerializableHead } from '@unhead/vue'
import { createUniversalStore } from '/@/stores'
import { createUniversalRouter } from './router'
import { createGlobalState, type AppErrorValue } from './state'
import { createTheme, Theme } from '/@/composables/theme'
import { APP_META } from '/@/configs/app.config'
import App from './app.vue'

export interface AppCreatorContext {
  theme: Theme
  error?: AppErrorValue
  routerHistoryCreator(base?: string): RouterHistory
}

export type MainApp = ReturnType<typeof createMainApp>

export const createMainApp = (context: AppCreatorContext) => {
  const app = createSSRApp(App)

  const globalState = createGlobalState({
    error: context.error ?? null
  })

  const store = createUniversalStore()

  const router = createUniversalRouter({
    history: context.routerHistoryCreator()
  })

  const theme = createTheme(context.theme)

  const getGlobalHead = (): SerializableHead => ({
    htmlAttrs: {
      lang: 'zh-CN',
      'data-theme': theme.theme.value
    },
    meta: [
      { name: 'description', content: APP_META.description },
      { name: 'keywords', content: APP_META.keywords },
      { name: 'author', content: APP_META.author }
    ]
  })

  // 全局错误捕获 → globalState.error（SSR 渲染后据此抛错）
  app.config.errorHandler = (error) => globalState.setError(error)
  router.onError((error) => globalState.setError(error))
  // 导航成功后清除上一次的错误状态
  router.afterEach(() => globalState.setError(null))

  app.use(router)
  app.use(store)
  app.use(globalState)
  app.use(theme)

  return { app, router, store, globalState, theme, getGlobalHead }
}
