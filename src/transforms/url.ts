/**
 * @file 静态资源 URL 绝对化（数据库内允许存相对路径，运行时拼 STATIC_PATH）
 */

import { getRuntimeConfig } from '/@/configs/app.runtime'

const pickStaticHost = (staticPath: string, seed = 0): string => {
  const hosts = staticPath
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean)
  if (!hosts.length) return ''
  return hosts[seed % hosts.length]
}

export const resolveStaticUrl = (url?: string | null): string => {
  if (!url) return ''
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) return url
  const host = pickStaticHost(getRuntimeConfig().staticPath, url.length)
  if (!host) return url
  return `${host.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
}

/** OSS 图片处理：缩略图（阿里云 x-oss-process） */
export const resolveThumbnailUrl = (url?: string | null, width = 800): string => {
  const resolved = resolveStaticUrl(url)
  if (!resolved || !/aliyuncs\.com|jiawen\.live/.test(resolved)) return resolved
  const sep = resolved.includes('?') ? '&' : '?'
  return `${resolved}${sep}x-oss-process=image/resize,w_${width}/interlace,1/quality,q_80`
}
