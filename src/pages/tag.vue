<template>
  <div class="tag-page">
    <header class="page-banner">
      <h1 class="banner-title"># {{ tag?.name ?? tagId }}</h1>
    </header>
    <ArticleList
      :articles="articleListStore.articles"
      :fetching="articleListStore.fetching"
      :has-more="articleListStore.hasMore"
      @loadmore="articleListStore.fetchMore"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useArticleListStore } from '/@/stores/articles'
import { useTagsStore } from '/@/stores/meta'
import { useUniversalFetch } from '/@/app/universal'
import { pageTitle } from '/@/configs/app.config'
import { isClient } from '/@/configs/app.env'
import ArticleList from '/@/components/article/article-list.vue'

const route = useRoute()
const articleListStore = useArticleListStore()
const tagsStore = useTagsStore()

const tagId = computed(() => Number(route.params.id))
const tag = computed(() => tagsStore.data.find((item) => item.id === tagId.value))

useHead(computed(() => ({ title: pageTitle(tag.value ? `标签：${tag.value.name}` : '标签') })))

const fetchAll = () => {
  return Promise.all([articleListStore.fetch({ tag_id: tagId.value }), tagsStore.fetch()])
}

useUniversalFetch(fetchAll)

if (isClient) {
  watch(tagId, (id) => {
    if (Number.isFinite(id) && route.name === 'tag') {
      fetchAll()
    }
  })
}
</script>

<style lang="scss" scoped>
.tag-page {
  display: flex;
  flex-direction: column;
  gap: $gap-sm;
}

.page-banner {
  padding-bottom: $gap;
  border-bottom: 1px solid var(--color-text-divider);
}

.banner-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--color-text-darker);
}
</style>
