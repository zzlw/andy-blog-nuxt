<template>
  <div class="search-page">
    <div class="page-banner module">
      <h1 class="banner-title">搜索：{{ keyword }}</h1>
      <p v-if="pagination" class="banner-desc">共 {{ pagination.total }} 条结果</p>
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
import { useUniversalFetch } from '/@/app/universal'
import { pageTitle } from '/@/configs/app.config'
import { isClient } from '/@/configs/app.env'
import ArticleList from '/@/components/article/article-list.vue'

const route = useRoute()
const articleListStore = useArticleListStore()

const keyword = computed(() => decodeURIComponent(String(route.params.keyword ?? '')))
const pagination = computed(() => articleListStore.pagination)

useHead(computed(() => ({ title: pageTitle(`搜索：${keyword.value}`) })))

const fetchAll = () => articleListStore.fetch({ keyword: keyword.value })

useUniversalFetch(fetchAll)

if (isClient) {
  watch(keyword, (value) => {
    if (value && route.name === 'search') {
      fetchAll()
    }
  })
}
</script>

<style lang="scss" scoped>
.search-page {
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
