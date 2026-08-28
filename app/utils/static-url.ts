/**
 * @file 静态资源 URL 绝对化（数据库内允许存相对路径，运行时拼 staticPath）
 * 纯函数版本；组件内请使用 useStaticUrl composable
 */

const pickStaticHost = (staticPath: string, seed = 0): string => {
  const hosts = staticPath
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean)
  if (!hosts.length) return ''
  return hosts[seed % hosts.length]!
}

export const resolveStaticUrl = (staticPath: string, url?: string | null): string => {
  if (!url) return ''
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) return url
  const host = pickStaticHost(staticPath, url.length)
  if (!host) return url
  return `${host.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
}

/** OSS 图片处理：缩略图（阿里云 x-oss-process） */
export const resolveThumbnailUrl = (staticPath: string, url?: string | null, width = 800): string => {
  const resolved = resolveStaticUrl(staticPath, url)
  if (!resolved || !/aliyuncs\.com|jiawen\.live/.test(resolved)) return resolved
  const sep = resolved.includes('?') ? '&' : '?'
  return `${resolved}${sep}x-oss-process=image/resize,w_${width}/interlace,1/quality,q_80`
}

/** 微信分享缩略图：正方形裁切，便于朋友圈卡片展示 */
export const resolveShareImageUrl = (staticPath: string, url?: string | null): string => {
  const resolved = resolveStaticUrl(staticPath, url)
  if (!resolved || !/aliyuncs\.com|jiawen\.live/.test(resolved)) return resolved
  const sep = resolved.includes('?') ? '&' : '?'
  return `${resolved}${sep}x-oss-process=image/resize,m_fill,w_300,h_300/quality,q_80`
}
