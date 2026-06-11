<template>
  <div class="index-page">
    <HeroArticle v-if="featured" :article="featured" />

    <nav v-if="categories.length" class="category-pills">
      <router-link
        v-for="category in categories"
        :key="category.id"
        :to="`/category/${category.id}`"
        class="pill"
      >
        {{ category.name }}
      </router-link>
    </nav>

    <ArticleList
      :articles="articleListStore.articles"
      :fetching="articleListStore.fetching"
      :has-more="articleListStore.hasMore"
      @loadmore="articleListStore.fetchMore"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useArticleListStore } from '/@/stores/articles'
import { useCategoriesStore } from '/@/stores/meta'
import { useUniversalFetch } from '/@/app/universal'
import { pageTitle } from '/@/configs/app.config'
import HeroArticle from '/@/components/article/hero-article.vue'
import ArticleList from '/@/components/article/article-list.vue'

const articleListStore = useArticleListStore()
const categoriesStore = useCategoriesStore()

const featured = computed(() => articleListStore.featuredArticles[0])
const categories = computed(() => categoriesStore.data)

useHead({ title: pageTitle() })

useUniversalFetch(() => {
  return Promise.all([articleListStore.fetch(), articleListStore.fetchFeatured()])
})
</script>

<style lang="scss" scoped>
.index-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.category-pills {
  display: flex;
  gap: $gap-sm;
  overflow-x: auto;
  padding-bottom: 2px;
  // 隐藏横向滚动条但保留滚动
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.pill {
  flex-shrink: 0;
  padding: 0.35em 1em;
  border-radius: 2em;
  font-size: 0.88rem;
  color: var(--color-text-secondary);
  background-color: var(--module-bg-darker-1);
  transition: all 0.2s;

  &:hover {
    color: var(--color-text-reversal);
    background-color: var(--color-primary);
  }
}

@include mobile {
  .index-page {
    gap: 1.4rem;
  }
}
</style>
