/**
 * 自建访客统计埋点（仅客户端 + 仅生产）。
 * - 每次路由切换向后端上报一次 PV；IP/UA 由服务端解析，前端只传路径
 * - path 走 query 且不带自定义请求头/请求体，规避跨域预检（sendBeacon 友好）
 * - 优先 navigator.sendBeacon（不阻塞、卸载可靠），降级 fetch keepalive
 */
export default defineNuxtPlugin(() => {
  if (import.meta.dev) return
  const apiBase = (useRuntimeConfig().public.apiBase as string)?.replace(/\/+$/, '')
  if (!apiBase) return
  const endpoint = `${apiBase}/api/analytics/collect`

  const report = (path: string) => {
    const url = `${endpoint}?path=${encodeURIComponent(path)}`
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(url)) return
    } catch {
      // 忽略，走 fetch 兜底
    }
    fetch(url, { method: 'POST', keepalive: true }).catch(() => {})
  }

  // afterEach 首次（hydration）导航即触发，初始与后续 PV 都由此上报
  useRouter().afterEach((to) => report(to.fullPath))
})
