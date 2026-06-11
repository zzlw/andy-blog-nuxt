<template>
  <PageShell>
    <div class="flex flex-col gap-6">
      <header v-if="tag">
        <h1 class="text-2xl font-bold"># {{ tag.name }}</h1>
      </header>
      <ArticleListView :data-key="`tag-${tagId}`" :params="{ tag_id: tagId }" />
    </div>
  </PageShell>
</template>

<script setup lang="ts">
const route = useRoute()
const tagId = Number(route.params.id)
if (!Number.isInteger(tagId) || tagId <= 0) {
  throw createError({ statusCode: 404, message: '标签不存在', fatal: true })
}

const { data: tags } = await useTagsData()
const tag = computed(() => tags.value.find((item) => item.id === tagId))

useSeoMeta({ title: () => (tag.value ? `标签：${tag.value.name}` : '标签') })
</script>
