/**
 * 未认证公众号无法用 JS-SDK 自定义分享，微信/QQ 会抓这些标签当缩略图。
 * 图片必须是可公网访问的 HTTPS，建议 JPEG、边长 > 300、体积远小于 1MB。
 */
import { APP_META } from '#shared/meta'

export const useShareMeta = (
  payload: MaybeRefOrGetter<{ image?: string; title?: string; description?: string }>
) => {
  const resolved = computed(() => {
    const value = toValue(payload)
    return {
      image: value.image || APP_META.shareIcon,
      title: value.title || APP_META.title,
      description: value.description || APP_META.description
    }
  })

  useHead({
    meta: [
      { property: 'og:image', content: () => resolved.value.image },
      { name: 'twitter:image', content: () => resolved.value.image },
      { itemprop: 'image', content: () => resolved.value.image },
      { itemprop: 'name', content: () => resolved.value.title },
      { itemprop: 'description', content: () => resolved.value.description }
    ],
    link: [
      { rel: 'image_src', href: () => resolved.value.image },
      { rel: 'apple-touch-icon', href: () => resolved.value.image }
    ]
  })
}
