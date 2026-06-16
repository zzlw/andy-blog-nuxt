/**
 * 自托管 Umami 访客统计埋点（仅客户端 + 仅生产 + 配置齐全时启用）。
 * - Umami tracker 默认自动跟踪 history 路由变化，SPA 路由切换无需手动上报
 * - 未配置 scriptUrl / websiteId 时整体降级为 no-op，便于安全部署
 */
export default defineNuxtPlugin(() => {
  const { umamiScriptUrl, umamiWebsiteId } = useRuntimeConfig().public
  if (!umamiScriptUrl || !umamiWebsiteId || import.meta.dev) return

  useHead({
    script: [
      {
        src: umamiScriptUrl as string,
        defer: true,
        'data-website-id': umamiWebsiteId as string,
      },
    ],
  })
})
