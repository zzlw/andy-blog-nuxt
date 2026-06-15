<template>
  <PageShell>
    <div class="flex flex-col gap-6">
      <header>
        <h1 class="font-display text-3xl font-bold tracking-tight">{{ t('search.title', { keyword }) }}</h1>
      </header>
      <ArticleListView :data-key="`search-${keyword}`" :params="{ keyword }" />
    </div>
  </PageShell>
</template>

<script setup lang="ts">
const { t } = useI18n()

const route = useRoute()
const keyword = decodeURIComponent(String(route.params.keyword ?? '')).trim()
if (!keyword) {
  throw createError({ statusCode: 404, message: t('search.missingKeyword'), fatal: true })
}

useSeoMeta({ title: () => t('search.title', { keyword }) })
</script>
