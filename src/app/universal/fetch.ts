/**
 * @file 同构数据预取（对齐 surmon.me useUniversalFetch）
 * - SSR：onServerPrefetch 注册，renderToString 时等待；失败标记 globalState.error
 * - CSR 首屏（hydration）：跳过请求，store 数据来自 SSR 注入
 * - CSR 后续导航：onBeforeMount 拉取
 */

import { onBeforeMount, onServerPrefetch } from 'vue'
import { isServer, isClient } from '/@/configs/app.env'
import { useGlobalState } from '/@/app/state'

export const useUniversalFetch = (fetcher: () => Promise<any>) => {
  const globalState = useGlobalState()

  if (isServer) {
    onServerPrefetch(() => {
      return fetcher().catch((error) => {
        // onServerPrefetch 的异常不会中断 renderToString，先标记，渲染后由 server-entry 抛出
        globalState.setError(error)
        return Promise.reject(error)
      })
    })
  }

  if (isClient) {
    if (globalState.isHydrated.value) {
      onBeforeMount(() => fetcher())
    }
  }
}
