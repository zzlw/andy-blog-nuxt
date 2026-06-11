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

  // 列表行之间用分隔线（去卡片化；子组件根节点会带上父级 scope 属性）
  .article-item + .article-item {
    border-top: 1px solid var(--color-text-divider);
  }
}

.loadmore {
  align-self: center;
  margin-top: 1.2rem;
  padding: 0.55em 2.2em;
  border: 1px solid var(--color-text-divider);
  border-radius: 2em;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  transition: all 0.2s;

  &:hover:not(:disabled) {
    color: var(--color-primary);
    border-color: var(--color-primary-translucent);
  }

  &:disabled {
    cursor: not-allowed;
    color: var(--color-text-disabled);
  }
}
</style>
