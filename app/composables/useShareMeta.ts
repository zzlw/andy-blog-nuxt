/**
 * 未认证公众号无法用 JS-SDK 自定义分享，微信/QQ 会抓这些标签当缩略图。
 * 图片 URL 不能包含逗号（OSS process 参数会被截断成 400），必须是可公网访问的 HTTPS。
 */
import { APP_META } from '#shared/meta'

const wechatSafeImage = (url?: string) => {
  if (!url || url.includes(',') || url.includes('x-oss-process')) return APP_META.shareIcon
  return url
}

export const useShareMeta = (
  payload: MaybeRefOrGetter<{ image?: string; title?: string; description?: string }>
) => {
  const resolved = computed(() => {
    const value = toValue(payload)
    return {
      image: wechatSafeImage(value.image),
      title: value.title || APP_META.title,
      description: value.description || APP_META.description
    }
  })

  useHead({
    meta: [
      { key: 'og:image', property: 'og:image', content: () => resolved.value.image },
      { key: 'twitter:image', name: 'twitter:image', content: () => resolved.value.image },
      { key: 'itemprop:image', itemprop: 'image', content: () => resolved.value.image },
      { key: 'itemprop:name', itemprop: 'name', content: () => resolved.value.title },
      { key: 'itemprop:description', itemprop: 'description', content: () => resolved.value.description }
    ],
    link: [
      { key: 'image_src', rel: 'image_src', href: () => resolved.value.image },
      { key: 'apple-touch-icon', rel: 'apple-touch-icon', href: () => resolved.value.image }
    ]
  })
}
