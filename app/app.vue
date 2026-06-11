<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { APP_META, pageTitle } from '#shared/meta'

useHead({
  titleTemplate: (title) => (title ? `${title} | ${APP_META.titleSuffix}` : pageTitle()),
  meta: [
    { name: 'description', content: APP_META.description },
    { name: 'keywords', content: APP_META.keywords }
  ]
})

// 水合完成后读取 localStorage（点赞记录/访客资料），避免 SSR 不一致
const identity = useIdentity()
onMounted(() => identity.initOnClient())
</script>
