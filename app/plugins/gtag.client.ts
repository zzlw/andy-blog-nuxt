/**
 * Google Analytics 4 埋点（仅客户端 + 仅生产 + 配置了 Measurement ID 时启用）。
 * - 关闭 config 的自动 page_view，统一由 router.afterEach 上报，正确覆盖 SPA 路由切换
 * - 未配置 gaMeasurementId 时整体降级为 no-op，便于安全部署
 */
declare global {
  interface Window {
    dataLayer: unknown[]
  }
}

export default defineNuxtPlugin(() => {
  const measurementId = useRuntimeConfig().public.gaMeasurementId as string
  if (!measurementId || import.meta.dev) return

  useHead({
    script: [{ src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`, async: true }],
  })

  window.dataLayer = window.dataLayer || []
  const gtag = (...args: unknown[]) => {
    window.dataLayer.push(args)
  }

  gtag('js', new Date())
  gtag('config', measurementId, { send_page_view: false })

  // afterEach 在首次（hydration）导航即触发一次，故初始与后续 PV 都由此上报，无需额外初始上报
  useRouter().afterEach((to) => {
    // 延后到下一 tick，确保 useHead 已更新 document.title
    nextTick(() => {
      gtag('event', 'page_view', {
        page_path: to.fullPath,
        page_location: window.location.href,
        page_title: document.title,
      })
    })
  })
})
