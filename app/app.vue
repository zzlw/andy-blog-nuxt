<template>
  <!-- 必须是 DOM 里第一张图：同域、无逗号、baseline JPEG、CSS 尺寸大于 300。微信不认 OG 时会抓这张。 -->
  <img
    :src="APP_META.shareIcon"
    alt=""
    width="400"
    height="400"
    class="pointer-events-none fixed top-0 left-0 -z-10 h-[400px] w-[400px] max-w-none opacity-[0.01]"
  />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { APP_META } from '#shared/meta'

const { t, locale, locales } = useI18n()

// 随当前语言切换 <html lang>，利于无障碍与 SEO
const htmlLang = computed(
  () => locales.value.find((item) => item.code === locale.value)?.language ?? 'zh-CN'
)

useHead({
  htmlAttrs: { lang: htmlLang },
  titleTemplate: (title) =>
    title ? `${title} | ${APP_META.titleSuffix}` : `${t('site.title')} | ${APP_META.titleSuffix}`,
  meta: [
    { name: 'description', content: () => t('site.description') },
    { name: 'keywords', content: APP_META.keywords },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: APP_META.title },
    { property: 'og:url', content: APP_META.url },
    { name: 'twitter:card', content: 'summary' }
  ]
})

useShareMeta({})

// 水合完成后读取 localStorage（点赞记录/访客资料），避免 SSR 不一致
const identity = useIdentity()
onMounted(() => identity.initOnClient())
</script>
