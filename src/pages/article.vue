<template>
  <div class="article-page">
    <Loading v-if="!article" />
    <template v-else>
      <article class="article-main module">
        <h1 class="title">{{ article.title }}</h1>
        <div class="meta">
          <span>{{ dateFormat(article.created_date) }}</span>
          <router-link v-if="article.category" :to="`/category/${article.category.id}`" class="link">
            {{ article.category.name }}
          </router-link>
          <span>{{ article.views }} 阅读</span>
          <span v-for="author in article.authors" :key="author.id">{{ author.name }}</span>
        </div>
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
  gap: $gap-lg;
}

.article-main {
  padding: $gap-lg 1.5rem;
}

.title {
  font-size: 1.5rem;
  color: var(--color-text-darker);
  line-height: 1.4;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  margin: 0.8em 0 1.2em;
  padding-bottom: 0.8em;
  border-bottom: 1px solid var(--color-text-divider);
  font-size: 0.82rem;
  color: var(--color-text-secondary);

  .link:hover {
    color: var(--color-primary);
  }
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
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

.related {
  padding: $gap-lg;
}

.section-title {
  margin-bottom: $gap;
  font-size: 1rem;
  color: var(--color-text-darker);
  border-left: 3px solid var(--color-primary);
  padding-left: 0.5em;
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
</style>
