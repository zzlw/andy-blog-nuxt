<template>
  <aside class="app-aside">
    <div class="aside-module module">
      <h3 class="module-title">分类</h3>
      <ul class="category-list">
        <li v-for="category in categories" :key="category.id">
          <router-link :to="`/category/${category.id}`" class="category-item">
            <span class="name">{{ category.name }}</span>
            <span class="desc">{{ category.description }}</span>
          </router-link>
        </li>
        <li v-if="!categories.length" class="empty">暂无分类</li>
      </ul>
    </div>
    <div class="aside-module module">
      <h3 class="module-title">标签</h3>
      <div class="tag-cloud">
        <router-link v-for="tag in tags" :key="tag.id" :to="`/tag/${tag.id}`" class="tag-item">
          {{ tag.name }}
        </router-link>
        <span v-if="!tags.length" class="empty">暂无标签</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCategoriesStore, useTagsStore } from '/@/stores/meta'

const categoriesStore = useCategoriesStore()
const tagsStore = useTagsStore()
const categories = computed(() => categoriesStore.data)
const tags = computed(() => tagsStore.data)
</script>

<style lang="scss" scoped>
.app-aside {
  width: $aside-width;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: $gap-lg;
  align-self: flex-start;
  position: sticky;
  top: calc(#{$navbar-height} + #{$gap-lg});
}

.aside-module {
  padding: $gap-lg;
}

.module-title {
  margin-bottom: $gap;
  font-size: 1rem;
  color: var(--color-text-darker);
  border-left: 3px solid var(--color-primary);
  padding-left: 0.5em;
  line-height: 1.2;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.4em 0.5em;
  border-radius: $radius;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--module-bg-darker-1);

    .name {
      color: var(--color-primary);
    }
  }

  .name {
    color: var(--color-link);
  }

  .desc {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    @include text-overflow(1);
    max-width: 55%;
  }
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: $gap-sm;
}

.tag-item {
  padding: 0.2em 0.7em;
  font-size: 0.85rem;
  border-radius: 2em;
  color: var(--color-text);
  background-color: var(--module-bg-darker-1);
  transition: all 0.2s;

  &:hover {
    color: var(--color-text-reversal);
    background-color: var(--color-primary);
  }
}

.empty {
  color: var(--color-text-disabled);
  font-size: 0.85rem;
  padding: 0.4em 0.5em;
}
</style>
