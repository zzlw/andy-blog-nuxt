<template>
  <div class="index-page">
    <Carousel :articles="articleListStore.carouselArticles" />
    <ArticleList
      :articles="articleListStore.articles"
      :fetching="articleListStore.fetching"
      :has-more="articleListStore.hasMore"
      @loadmore="articleListStore.fetchMore"
    />
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useArticleListStore } from '/@/stores/articles'
import { useUniversalFetch } from '/@/app/universal'
import { pageTitle } from '/@/configs/app.config'
import Carousel from '/@/components/article/carousel.vue'
import ArticleList from '/@/components/article/article-list.vue'

const articleListStore = useArticleListStore()

useHead({ title: pageTitle() })

useUniversalFetch(() => {
  return Promise.all([articleListStore.fetch(), articleListStore.fetchCarousel()])
})
</script>

<style lang="scss" scoped>
.index-page {
  display: flex;
  flex-direction: column;
  gap: $gap-lg;
}
</style>
