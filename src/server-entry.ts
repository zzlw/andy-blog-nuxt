/**
 * @file SSR 渲染入口（对齐 surmon.me server-entry）
 */

import serialize from 'serialize-javascript'
import { toRaw } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory } from 'vue-router'
import { createHead, renderSSRHead } from '@unhead/vue/server'
import type { SSRHeadPayload, VueHeadClient } from '@unhead/vue/server'
import { createMainApp, type MainApp } from '/@/app/main'
import { type AppErrorValue } from '/@/app/state'
import { formatErrorToAppError } from '/@/app/error'
import { renderSSRStateScript, renderSSRContextScript } from '/@/app/universal'
import { Theme } from '/@/composables/theme'
import { getRuntimeConfig } from '/@/configs/app.runtime'
import { SUCCESS } from '/@/constants/http-code'
import type { RequestContext } from '/@/server/main'
import type { CacheStore } from '/@/server/services/cache'

export interface RenderResult {
  code: number
  appHTML: string
  headHTML: SSRHeadPayload
  stateScripts: string
  contextScripts: string
}

interface SSRContext {
  requestUrl: string
  userAgent?: string
  error: AppErrorValue
  cacheStatus?: 'hit' | 'miss'
}

const createSSRContext = (context: RequestContext, error: AppErrorValue = null): SSRContext => ({
  requestUrl: context.url,
  userAgent: context.headers['user-agent'],
  error
})

const createSSRMainApp = (ssrContext: SSRContext): [MainApp, VueHeadClient] => {
  const mainApp = createMainApp({
    routerHistoryCreator: createMemoryHistory,
    userAgent: ssrContext.userAgent,
    theme: Theme.Light, // 实际值由客户端 <head> 内联脚本决定
    error: ssrContext.error
  })
  const head = createHead({
    disableDefaults: true,
    disableCapoSorting: true,
    init: [mainApp.getGlobalHead()]
  })
  mainApp.app.use(head)
  return [mainApp, head]
}

const buildStateScripts = (storeState?: any) => {
  return renderSSRStateScript(
    serialize({
      appConfig: getRuntimeConfig(),
      store: storeState
    })
  )
}

/** 错误页渲染（服务端异常 / 数据预取失败 / 404） */
export const renderError = async (context: RequestContext, error: unknown): Promise<RenderResult> => {
  const appError = formatErrorToAppError(error, { code: 500, message: '未知渲染错误' })
  const ssrContext = createSSRContext(context, appError)
  const [{ app }, head] = createSSRMainApp(ssrContext)
  head.push({ title: `Error: ${appError.message}` })
  return {
    code: appError.code,
    appHTML: await renderToString(app, { ...ssrContext }),
    headHTML: await renderSSRHead(head),
    contextScripts: renderSSRContextScript(serialize(ssrContext)),
    stateScripts: buildStateScripts()
  }
}

/** 应用页渲染（含 Redis/LRU 页面缓存，按 route.meta.ssrCacheTTL） */
export const renderApp = async (context: RequestContext, cache: CacheStore): Promise<RenderResult> => {
  const ssrContext = createSSRContext(context)
  const [{ app, router, store, globalState }, head] = createSSRMainApp(ssrContext)

  const deviceType = globalState.userAgent.isMobile ? 'mobile' : 'desktop'
  const cacheKey = `ssr:${deviceType}_${ssrContext.requestUrl}`

  if (await cache.has(cacheKey)) {
    return {
      ...(await cache.get<Omit<RenderResult, 'code' | 'contextScripts'>>(cacheKey)),
      contextScripts: renderSSRContextScript(serialize({ ...ssrContext, cacheStatus: 'hit' })),
      code: SUCCESS
    }
  }

  try {
    await router.push(ssrContext.requestUrl)
    await router.isReady()

    await store.prefetchOnServer()

    const appHTML = await renderToString(app, { ...ssrContext })
    // onServerPrefetch 的异常不会中断 renderToString，此处补抛
    if (globalState.error.value) {
      throw toRaw(globalState.error.value)
    }

    const headHTML = await renderSSRHead(head)
    const contextScripts = renderSSRContextScript(serialize({ ...ssrContext, cacheStatus: 'miss' }))
    const stateScripts = buildStateScripts(store.state.value)

    const renderedForCache = { appHTML, headHTML, stateScripts }

    const cacheTTL = router.currentRoute.value.meta?.ssrCacheTTL
    if (typeof cacheTTL === 'number' && cacheTTL > 0) {
      await cache.set(cacheKey, renderedForCache, cacheTTL)
    }

    return { ...renderedForCache, contextScripts, code: SUCCESS }
  } catch (error: any) {
    return renderError(context, error)
  }
}
