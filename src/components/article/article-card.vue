<template>
  <div class="article-card module">
    <router-link v-if="article.cover" :to="detailRoute" class="cover">
      <img :src="coverUrl" :alt="article.title" loading="lazy" />
    </router-link>
    <div class="body">
      <h3 class="title">
        <router-link :to="detailRoute">{{ article.title }}</router-link>
      </h3>
      <p class="description">{{ article.description }}</p>
      <div class="meta">
        <span class="meta-item">{{ dateFormat(article.created_date) }}</span>
        <router-link v-if="article.category" :to="`/category/${article.category.id}`" class="meta-item link">
          {{ article.category.name }}
        </router-link>
        <span class="meta-item">{{ article.views }} 阅读</span>
        <span class="meta-item">{{ article.like }} 喜欢</span>
        <span class="tags">
          <router-link v-for="tag in article.tags" :key="tag.id" :to="`/tag/${tag.id}`" class="tag">
            # {{ tag.name }}
          </router-link>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Article } from '/@/interfaces'
import { resolveThumbnailUrl } from '/@/transforms/url'
import { dateFormat } from '/@/transforms/date'

const props = defineProps<{ article: Article }>()

const detailRoute = computed(() => `/article/${props.article.id}`)
const coverUrl = computed(() => resolveThumbnailUrl(props.article.cover, 600))
</script>

<style lang="scss" scoped>
.article-card {
  display: flex;
  overflow: hidden;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);

    .cover img {
      transform: scale(1.05);
    }
  }
}

.cover {
  flex-shrink: 0;
  width: 13rem;
  height: 9rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
}

.body {
  flex: 1;
  min-width: 0;
  padding: $gap-lg;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.1rem;
  @include text-overflow(1);

  a {
    color: var(--color-text-darker);

    &:hover {
      color: var(--color-primary);
    }
  }
}

.description {
  flex: 1;
  margin-top: 0.5em;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  @include text-overflow(2);
}

.meta {
  margin-top: 0.6em;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.9em;
  font-size: 0.8rem;
  color: var(--color-text-disabled);

  .link:hover {
    color: var(--color-primary);
  }

  .tags {
    display: inline-flex;
    gap: 0.6em;
  }

  .tag:hover {
    color: var(--color-primary);
  }
}

@include mobile {
  .article-card {
    flex-direction: column;
  }

  .cover {
    width: 100%;
    height: 11rem;
  }
}
</style>
