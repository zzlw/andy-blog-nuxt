<template>
  <div class="article-page">
    <Loading v-if="!article" />
    <template v-else>
      <article class="article-main">
        <header class="article-header">
          <h1 class="title">{{ article.title }}</h1>
          <div class="meta">
            <span>{{ dateFormat(article.created_date) }}</span>
            <template v-if="article.category">
              <span class="dot">·</span>
              <router-link :to="`/category/${article.category.id}`" class="link">
                {{ article.category.name }}
              </router-link>
            </template>
            <span class="dot">·</span>
            <span>{{ readingMinutes }} 分钟阅读</span>
            <span class="dot">·</span>
            <span>{{ article.views }} 阅读</span>
          </div>
        </header>
        <div class="markdown-html" v-html="contentHtml"></div>
        <div class="article-footer">
          <div class="tags">
            <router-link v-for="tag in article.tags" :key="tag.id" :to="`/tag/${tag.id}`" class="tag">
              # {{ tag.name }}
            </router-link>
          </div>
          <button class="like-btn" :class="{ liked }" :disabled="liked" @click="onLike">
            ♥ {{ article.like }}
          </button>
        </div>
      </article>

      <div v-if="article.related?.length" class="related module">
        <h3 class="section-title">相关文章</h3>
        <ul class="related-list">
          <li v-for="item in article.related" :key="item.id">
            <router-link :to="`/article/${item.id}`" class="related-item">
              <span class="related-title">{{ item.title }}</span>
              <span class="related-date">{{ dateFormat(item.created_date) }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <CommentSection :article-id="article.id" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useArticleDetailStore, useCommentsStore } from '/@/stores/article'
import { useIdentityStore } from '/@/stores/identity'
import { useUniversalFetch } from '/@/app/universal'
import { renderMarkdown } from '/@/transforms/markdown'
import { dateFormat } from '/@/transforms/date'
import { pageTitle } from '/@/configs/app.config'
import { isClient } from '/@/configs/app.env'
import Loading from '/@/components/common/loading.vue'
import CommentSection from '/@/components/comment/index.vue'

const route = useRoute()
const detailStore = useArticleDetailStore()
const commentsStore = useCommentsStore()
const identity = useIdentityStore()

const articleId = computed(() => Number(route.params.id))
const article = computed(() => detailStore.article)
const contentHtml = computed(() => renderMarkdown(article.value?.content))
const liked = computed(() => (article.value ? identity.isArticleLiked(article.value.id) : false))
// 中文约 400 字/分钟
const readingMinutes = computed(() => {
  const length = article.value?.content?.length ?? 0
  return Math.max(1, Math.round(length / 400))
})

useHead(
  computed(() => ({
    title: pageTitle(article.value?.title),
    meta: article.value?.description ? [{ name: 'description', content: article.value.description }] : []
  }))
)

const fetchAll = () => {
  return Promise.all([detailStore.fetch(articleId.value), commentsStore.fetch(articleId.value)])
}

useUniversalFetch(fetchAll)

// 同路由跳转其他文章（相关文章点击）
if (isClient) {
  watch(articleId, (id) => {
    if (Number.isFinite(id) && route.name === 'article-detail') {
      fetchAll()
    }
  })
}

const onLike = async () => {
  if (!article.value || liked.value) return
  await detailStore.like()
  identity.markArticleLiked(article.value.id)
}
</script>

<style lang="scss" scoped>
.article-page {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.article-header {
  margin-bottom: 2rem;
  text-align: center;
}

.title {
  font-size: 1.9rem;
  font-weight: 700;
  color: var(--color-text-darker);
  line-height: 1.45;
}

.meta {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5em;
  margin-top: 0.9em;
  font-size: 0.85rem;
  color: var(--color-text-secondary);

  .dot {
    color: var(--color-text-divider);
  }

  .link:hover {
    color: var(--color-primary);
  }
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.5rem;
  padding-top: 1.4rem;
  border-top: 1px solid var(--color-text-divider);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: $gap-sm;

  .tag {
    padding: 0.2em 0.7em;
    font-size: 0.85rem;
    border-radius: 2em;
    background-color: var(--module-bg-darker-1);

    &:hover {
      color: var(--color-text-reversal);
      background-color: var(--color-primary);
    }
  }
}

.like-btn {
  padding: 0.4em 1.2em;
  border-radius: 2em;
  font-size: 0.9rem;
  color: var(--color-text);
  background-color: var(--module-bg-darker-1);
  transition: all 0.2s;

  &:hover:not(:disabled),
  &.liked {
    color: #fff;
    background-color: #e74c3c;
  }

  &.liked {
    cursor: default;
  }
}

.section-title {
  margin-bottom: $gap;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text-darker);
  border-left: 3px solid var(--color-primary);
  padding-left: 0.55em;
  line-height: 1.2;
}

.related-list {
  display: flex;
  flex-direction: column;
}

.related-item {
  display: flex;
  justify-content: space-between;
  padding: 0.45em 0.5em;
  border-radius: $radius;

  &:hover {
    background-color: var(--module-bg-darker-1);

    .related-title {
      color: var(--color-primary);
    }
  }

  .related-title {
    @include text-overflow(1);
  }

  .related-date {
    flex-shrink: 0;
    margin-left: 1em;
    font-size: 0.8rem;
    color: var(--color-text-disabled);
  }
}

@include mobile {
  .article-page {
    gap: 1.8rem;
  }

  .title {
    font-size: 1.45rem;
  }

  .article-header {
    margin-bottom: 1.4rem;
  }
}
</style>
