/**
 * @file Universal store（pinia + SSR 状态注水）
 */

import { createPinia, type Pinia } from 'pinia'
import type { App } from 'vue'
import { getSSRStateValue } from '/@/app/universal/script'
import { useCategoriesStore, useTagsStore } from './meta'

export type UniversalStore = ReturnType<typeof createUniversalStore>

export const createUniversalStore = () => {
  const pinia = createPinia()

  /** SSR：全局数据预取（导航抽屉/首页胶囊条/归档页依赖分类与标签） */
  const prefetchOnServer = async () => {
    await Promise.all([useCategoriesStore(pinia).fetch(), useTagsStore(pinia).fetch()])
  }

  /** CSR：用 SSR 注入的状态还原 pinia */
  const hydrateOnClient = () => {
    const ssrStoreState = getSSRStateValue('store')
    if (ssrStoreState) {
      pinia.state.value = ssrStoreState
    }
  }

  return {
    pinia,
    get state() {
      return pinia.state
    },
    prefetchOnServer,
    hydrateOnClient,
    install(app: App) {
      app.use(pinia)
    }
  }
}
