<template>
  <PageShell>
    <div class="flex flex-col gap-6">
      <header v-if="category">
        <h1 class="text-2xl font-bold">{{ category.name }}</h1>
        <p v-if="category.description" class="mt-2 text-sm text-muted-foreground">{{ category.description }}</p>
      </header>
      <ArticleListView :data-key="`category-${categoryId}`" :params="{ category_id: categoryId }" />
    </div>
  </PageShell>
</template>

<script setup lang="ts">
const route = useRoute()
const categoryId = Number(route.params.id)
if (!Number.isInteger(categoryId) || categoryId <= 0) {
  throw createError({ statusCode: 404, message: '分类不存在', fatal: true })
}

const { data: categories } = await useCategoriesData()
const category = computed(() => categories.value.find((item) => item.id === categoryId))

useSeoMeta({
  title: () => category.value?.name ?? '分类',
  description: () => category.value?.description || undefined
})
</script>
