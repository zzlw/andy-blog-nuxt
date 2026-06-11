<template>
  <article class="article-item">
    <div class="body">
      <h3 class="title">
        <router-link :to="detailRoute">{{ article.title }}</router-link>
      </h3>
      <p class="description">{{ article.description }}</p>
      <div class="meta">
        <span>{{ dateFormat(article.created_date) }}</span>
        <template v-if="article.category">
          <span class="dot">·</span>
          <router-link :to="`/category/${article.category.id}`" class="link">
            {{ article.category.name }}
          </router-link>
        </template>
        <span class="dot">·</span>
        <span>{{ article.views }} 阅读</span>
        <span class="tags">
          <router-link v-for="tag in article.tags" :key="tag.id" :to="`/tag/${tag.id}`" class="tag">
            # {{ tag.name }}
          </router-link>
        </span>
      </div>
    </div>
    <router-link v-if="article.cover" :to="detailRoute" class="cover">
      <img :src="coverUrl" :alt="article.title" loading="lazy" />
    </router-link>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Article } from '/@/interfaces'
import { resolveThumbnailUrl } from '/@/transforms/url'
import { dateFormat } from '/@/transforms/date'

const props = defineProps<{ article: Article }>()

const detailRoute = computed(() => `/article/${props.article.id}`)
const coverUrl = computed(() => resolveThumbnailUrl(props.article.cover, 480))
</script>

<style lang="scss" scoped>
.article-item {
  display: flex;
  align-items: flex-start;
  gap: 1.4rem;
  padding: 1.5rem 0;

  &:hover {
    .title a {
      color: var(--color-primary);
    }

    .cover img {
      transform: scale(1.05);
    }
  }
}

.body {
  flex: 1;
  min-width: 0;
}

.title {
  font-size: 1.18rem;
  font-weight: 700;
  line-height: 1.5;
  @include text-overflow(2);

  a {
    color: var(--color-text-darker);
    transition: color 0.2s;
  }
}

.description {
  margin-top: 0.45em;
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  @include text-overflow(2);
}

.meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-top: 0.7em;
  font-size: 0.8rem;
  color: var(--color-text-disabled);

  .dot {
    color: var(--color-text-divider);
  }

  .link:hover,
  .tag:hover {
    color: var(--color-primary);
  }

  .tags {
    display: inline-flex;
    gap: 0.6em;
    margin-left: 0.4em;
  }
}

.cover {
  flex-shrink: 0;
  width: 11rem;
  aspect-ratio: 8 / 5;
  border-radius: $radius;
  overflow: hidden;
  background-color: var(--module-bg-darker-1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
}

@include mobile {
  .article-item {
    gap: 0.9rem;
    padding: 1.1rem 0;
  }

  .title {
    font-size: 1.05rem;
  }

  .description {
    @include text-overflow(2);
    font-size: 0.88rem;
  }

  .cover {
    width: 7rem;
  }

  .meta .tags {
    display: none;
  }
}
</style>
