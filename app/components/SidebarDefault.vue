<template>
  <div class="flex flex-col gap-8">
    <section v-if="categories.length">
      <h3 class="mb-4 font-display text-sm font-bold tracking-tight">{{ t('sidebar.categories') }}</h3>
      <nav class="flex flex-col">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/category/${category.id}`"
          class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Folder class="size-3.5" />
          {{ category.name }}
        </NuxtLink>
      </nav>
    </section>

    <section v-if="popularTags.length">
      <h3 class="mb-4 font-display text-sm font-bold tracking-tight">{{ t('sidebar.popularTags') }}</h3>
      <div class="flex flex-wrap gap-2">
        <NuxtLink v-for="tag in popularTags" :key="tag.id" :to="`/tag/${tag.id}`">
          <Badge variant="secondary" class="font-normal transition-colors hover:bg-primary hover:text-primary-foreground">
            {{ tag.name }}
          </Badge>
        </NuxtLink>
      </div>
    </section>

    <section v-if="latest.length">
      <h3 class="mb-4 font-display text-sm font-bold tracking-tight">{{ t('sidebar.latestArticles') }}</h3>
      <nav class="flex flex-col gap-3">
        <NuxtLink
          v-for="article in latest"
          :key="article.id"
          :to="`/article/${article.id}`"
          class="group text-sm"
        >
          <p class="line-clamp-2 text-foreground transition-colors group-hover:text-primary">
            {{ article.title }}
          </p>
          <time class="text-xs text-muted-foreground">{{ dateFormat(article.created_date) }}</time>
        </NuxtLink>
      </nav>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Folder } from 'lucide-vue-next'

const { t } = useI18n()

const { data: categories } = useCategoriesData()
const { data: tags } = useTagsData()
const { data: latest } = useLatestArticlesData()

// 侧栏只展示热门标签：按文章数降序取前 N，隐藏空标签，避免长尾标签把侧栏撑得过长（业内常见做法）
const MAX_SIDEBAR_TAGS = 20
const popularTags = computed(() => {
  const list = tags.value ?? []
  // 后端会返回 article_count；优先取有文章的标签，缺失计数时降级展示全部
  const withArticles = list.filter((tag) => (tag.article_count ?? 0) > 0)
  const base = withArticles.length ? withArticles : list
  return [...base]
    .sort((a, b) => (b.article_count ?? 0) - (a.article_count ?? 0))
    .slice(0, MAX_SIDEBAR_TAGS)
})
</script>
