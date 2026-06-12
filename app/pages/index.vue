<template>
  <PageShell>
    <div class="flex flex-col gap-12">
      <HeroArticle v-if="featured" :article="featured" />
      <div :class="featured ? 'border-t border-border' : ''">
        <ArticleListView data-key="home" />
      </div>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
const api = useBlogApi()

const { data: featured } = await useAsyncData('featured-article', () =>
  api.getArticles({ star: 1, page: 1, page_size: 1 }).then((result) => result.data[0] ?? null)
)
</script>
