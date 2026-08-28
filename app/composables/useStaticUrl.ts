/**
 * @file 绑定 runtimeConfig.staticPath 的静态资源 URL 解析器
 */

export const useStaticUrl = () => {
  const { staticPath } = useRuntimeConfig().public

  return {
    staticUrl: (url?: string | null) => resolveStaticUrl(staticPath, url),
    thumbnailUrl: (url?: string | null, width = 800) => resolveThumbnailUrl(staticPath, url, width),
    shareImageUrl: (url?: string | null) => resolveShareImageUrl(staticPath, url)
  }
}
