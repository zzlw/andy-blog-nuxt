<template>
  <div class="category-page">
    <div class="page-banner module">
      <h1 class="banner-title">分类：{{ category?.name ?? `#${categoryId}` }}</h1>
      <p v-if="category?.description" class="banner-desc">{{ category.description }}</p>
    </div>
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
import { useCategoriesStore } from '/@/stores/meta'
import { useUniversalFetch } from '/@/app/universal'
import { pageTitle } from '/@/configs/app.config'
import { isClient } from '/@/configs/app.env'
import ArticleList from '/@/components/article/article-list.vue'

const route = useRoute()
const articleListStore = useArticleListStore()
const categoriesStore = useCategoriesStore()

const categoryId = computed(() => Number(route.params.id))
const category = computed(() => categoriesStore.data.find((item) => item.id === categoryId.value))

useHead(computed(() => ({ title: pageTitle(category.value ? `分类：${category.value.name}` : '分类') })))

const fetchAll = () => {
  return Promise.all([articleListStore.fetch({ category_id: categoryId.value }), categoriesStore.fetch()])
}

useUniversalFetch(fetchAll)

if (isClient) {
  watch(categoryId, (id) => {
    if (Number.isFinite(id) && route.name === 'category') {
      fetchAll()
    }
  })
}
</script>

<style lang="scss" scoped>
.category-page {
  display: flex;
  flex-direction: column;
  gap: $gap-lg;
}

.page-banner {
  padding: $gap-lg 1.5rem;
}

.banner-title {
  font-size: 1.3rem;
  color: var(--color-text-darker);
}

.banner-desc {
  margin-top: 0.4em;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}
</style>
