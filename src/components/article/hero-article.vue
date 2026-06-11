<template>
  <router-link :to="`/article/${article.id}`" class="hero-article">
    <div v-if="article.cover" class="hero-cover">
      <img :src="coverUrl" :alt="article.title" />
      <span class="hero-badge">精选</span>
    </div>
    <div class="hero-body">
      <h2 class="hero-title">{{ article.title }}</h2>
      <p class="hero-description">{{ article.description }}</p>
      <div class="hero-meta">
        <span>{{ dateFormat(article.created_date) }}</span>
        <span v-if="article.category" class="dot">·</span>
        <span v-if="article.category">{{ article.category.name }}</span>
        <span class="dot">·</span>
        <span>{{ article.views }} 阅读</span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Article } from '/@/interfaces'
import { resolveThumbnailUrl } from '/@/transforms/url'
import { dateFormat } from '/@/transforms/date'

const props = defineProps<{ article: Article }>()

const coverUrl = computed(() => resolveThumbnailUrl(props.article.cover, 1200))
</script>

<style lang="scss" scoped>
.hero-article {
  display: block;

  &:hover {
    .hero-cover img {
      transform: scale(1.03);
    }

    .hero-title {
      color: var(--color-primary);
    }
  }
}

.hero-cover {
  position: relative;
  aspect-ratio: 21 / 9;
  border-radius: $radius-lg;
  overflow: hidden;
  background-color: var(--module-bg-darker-1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
}

.hero-badge {
  position: absolute;
  top: 0.9rem;
  left: 0.9rem;
  padding: 0.25em 0.8em;
  border-radius: 2em;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #fff;
  background-color: var(--color-primary);
}

.hero-body {
  padding: 1.1rem 0.2rem 0;
}

.hero-title {
  font-size: 1.55rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--color-text-darker);
  transition: color 0.2s;
  @include text-overflow(2);
}

.hero-description {
  margin-top: 0.5em;
  font-size: 0.98rem;
  color: var(--color-text-secondary);
  @include text-overflow(2);
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-top: 0.7em;
  font-size: 0.82rem;
  color: var(--color-text-disabled);

  .dot {
    color: var(--color-text-divider);
  }
}

@include mobile {
  .hero-cover {
    aspect-ratio: 16 / 9;
  }

  .hero-title {
    font-size: 1.25rem;
  }
}
</style>
