<template>
  <PageShell>
    <div class="flex flex-col gap-6">
      <header v-if="category">
        <h1 class="font-display text-3xl font-bold tracking-tight">{{ category.name }}</h1>
        <p v-if="category.description" class="mt-2 text-sm text-muted-foreground">{{ category.description }}</p>
      </header>
      <ArticleListView :data-key="`category-${categoryId}`" :params="{ category_id: categoryId }" />
    </div>
  </PageShell>
</template>

<script setup lang="ts">
const { t } = useI18n()

const route = useRoute()
const categoryId = Number(route.params.id)
if (!Number.isInteger(categoryId) || categoryId <= 0) {
  throw createError({ statusCode: 404, message: t('category.notFound'), fatal: true })
}

const { data: categories } = await useCategoriesData()
const category = computed(() => categories.value.find((item) => item.id === categoryId))

useSeoMeta({
  title: () => category.value?.name ?? t('category.fallback'),
  description: () => category.value?.description || undefined
})
</script>
