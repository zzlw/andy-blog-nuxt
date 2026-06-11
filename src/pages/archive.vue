<template>
  <div class="archive-page">
    <h1 class="page-title">归档</h1>

    <section v-if="categories.length" class="meta-section">
      <h2 class="section-title">分类</h2>
      <div class="pill-cloud">
        <router-link
          v-for="category in categories"
          :key="category.id"
          :to="`/category/${category.id}`"
          class="pill"
        >
          {{ category.name }}
        </router-link>
      </div>
    </section>

    <section v-if="tags.length" class="meta-section">
      <h2 class="section-title">标签</h2>
      <div class="pill-cloud">
        <router-link v-for="tag in tags" :key="tag.id" :to="`/tag/${tag.id}`" class="pill">
          # {{ tag.name }}
        </router-link>
      </div>
    </section>

    <section class="meta-section">
      <h2 class="section-title">时间线</h2>
      <Loading v-if="archiveStore.fetching && !archive.length" />
      <Empty v-else-if="!archive.length" text="暂无文章" />
      <div v-else class="timeline">
        <section v-for="year in archive" :key="year.year" class="year-section">
          <h3 class="year-title">{{ year.year }}</h3>
          <ul class="year-articles">
            <li v-for="article in year.articles" :key="article.id">
              <router-link :to="`/article/${article.id}`" class="archive-item">
                <span class="date">{{ dateFormat(article.created_date, 'MM-DD') }}</span>
                <span class="title">{{ article.title }}</span>
              </router-link>
            </li>
          </ul>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useArchiveStore } from '/@/stores/archive'
import { useCategoriesStore, useTagsStore } from '/@/stores/meta'
import { useUniversalFetch } from '/@/app/universal'
import { pageTitle } from '/@/configs/app.config'
import { dateFormat } from '/@/transforms/date'
import Loading from '/@/components/common/loading.vue'
import Empty from '/@/components/common/empty.vue'

const archiveStore = useArchiveStore()
const categoriesStore = useCategoriesStore()
const tagsStore = useTagsStore()

const archive = computed(() => archiveStore.data)
const categories = computed(() => categoriesStore.data)
const tags = computed(() => tagsStore.data)

useHead({ title: pageTitle('归档') })

useUniversalFetch(() => archiveStore.fetch())
</script>

<style lang="scss" scoped>
.archive-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--color-text-darker);
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

.pill-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: $gap-sm;
}

.pill {
  padding: 0.3em 0.95em;
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

.timeline {
  display: flex;
  flex-direction: column;
  gap: $gap-lg;
}

.year-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: $gap-sm;
}

.year-articles {
  border-left: 2px solid var(--color-text-divider);
  padding-left: 1rem;
}

.archive-item {
  display: flex;
  align-items: baseline;
  gap: 1em;
  padding: 0.4em 0.5em;
  border-radius: $radius;

  &:hover {
    background-color: var(--module-bg-darker-1);

    .title {
      color: var(--color-primary);
    }
  }

  .date {
    flex-shrink: 0;
    font-size: 0.8rem;
    font-family: $font-family-mono;
    color: var(--color-text-disabled);
  }

  .title {
    @include text-overflow(1);
  }
}
</style>
