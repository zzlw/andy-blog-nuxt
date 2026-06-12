<template>
  <PageShell>
    <div class="flex flex-col gap-6">
      <header>
        <h1 class="font-display text-3xl font-bold tracking-tight">搜索：{{ keyword }}</h1>
      </header>
      <ArticleListView :data-key="`search-${keyword}`" :params="{ keyword }" />
    </div>
  </PageShell>
</template>

<script setup lang="ts">
const route = useRoute()
const keyword = decodeURIComponent(String(route.params.keyword ?? '')).trim()
if (!keyword) {
  throw createError({ statusCode: 404, message: '缺少搜索关键词', fatal: true })
}

useSeoMeta({ title: `搜索：${keyword}` })
</script>
