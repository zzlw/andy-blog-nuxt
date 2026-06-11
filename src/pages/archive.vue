<template>
  <div class="archive-page module">
    <h1 class="page-title">归档</h1>
    <Loading v-if="archiveStore.fetching && !archive.length" />
    <Empty v-else-if="!archive.length" text="暂无文章" />
    <div v-else class="timeline">
      <section v-for="year in archive" :key="year.year" class="year-section">
        <h2 class="year-title">{{ year.year }}</h2>
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useArchiveStore } from '/@/stores/archive'
import { useUniversalFetch } from '/@/app/universal'
import { pageTitle } from '/@/configs/app.config'
import { dateFormat } from '/@/transforms/date'
import Loading from '/@/components/common/loading.vue'
import Empty from '/@/components/common/empty.vue'

const archiveStore = useArchiveStore()
const archive = computed(() => archiveStore.data)

useHead({ title: pageTitle('归档') })

useUniversalFetch(() => archiveStore.fetch())
</script>

<style lang="scss" scoped>
.archive-page {
  padding: $gap-lg 1.5rem;
}

.page-title {
  font-size: 1.3rem;
  color: var(--color-text-darker);
  margin-bottom: $gap-lg;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: $gap-lg;
}

.year-title {
  font-size: 1.15rem;
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
  padding: 0.35em 0.5em;
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
