<template>
  <PageShell>
    <div class="flex flex-col gap-6">
      <header v-if="tag">
        <h1 class="font-display text-3xl font-bold tracking-tight"># {{ tag.name }}</h1>
      </header>
      <ArticleListView :data-key="`tag-${tagId}`" :params="{ tag_id: tagId }" />
    </div>
  </PageShell>
</template>

<script setup lang="ts">
const { t } = useI18n()

const route = useRoute()
const tagId = Number(route.params.id)
if (!Number.isInteger(tagId) || tagId <= 0) {
  throw createError({ statusCode: 404, message: t('tag.notFound'), fatal: true })
}

const { data: tags } = await useTagsData()
const tag = computed(() => tags.value.find((item) => item.id === tagId))

useSeoMeta({ title: () => (tag.value ? t('tag.title', { name: tag.value.name }) : t('tag.fallback')) })
</script>
