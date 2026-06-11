<template>
  <div class="article-list">
    <template v-if="articles.length">
      <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
    </template>
    <Loading v-if="fetching && !articles.length" />
    <Empty v-else-if="!fetching && !articles.length" text="暂无文章" />
    <button v-if="hasMore" class="loadmore module" :disabled="fetching" @click="$emit('loadmore')">
      {{ fetching ? '加载中...' : '加载更多' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '/@/interfaces'
import ArticleCard from './article-card.vue'
import Loading from '/@/components/common/loading.vue'
import Empty from '/@/components/common/empty.vue'

defineProps<{
  articles: Article[]
  fetching: boolean
  hasMore: boolean
}>()

defineEmits<{ loadmore: [] }>()
</script>

<style lang="scss" scoped>
.article-list {
  display: flex;
  flex-direction: column;
  gap: $gap-lg;
}

.loadmore {
  padding: 0.8em;
  color: var(--color-text-secondary);
  transition: all 0.2s;

  &:hover:not(:disabled) {
    color: var(--color-primary);
  }

  &:disabled {
    cursor: not-allowed;
    color: var(--color-text-disabled);
  }
}
</style>
