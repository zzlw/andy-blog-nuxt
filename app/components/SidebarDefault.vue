<template>
  <div class="flex flex-col gap-8">
    <section v-if="categories.length">
      <h3 class="mb-4 font-display text-sm font-bold tracking-tight">分类</h3>
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

    <section v-if="sortedTags.length">
      <h3 class="mb-4 font-display text-sm font-bold tracking-tight">标签</h3>
      <div class="flex flex-wrap gap-2">
        <NuxtLink v-for="tag in visibleTags" :key="tag.id" :to="`/tag/${tag.id}`">
          <Badge variant="secondary" class="font-normal transition-colors hover:bg-primary hover:text-primary-foreground">
            {{ tag.name }}
          </Badge>
        </NuxtLink>
      </div>
      <button
        v-if="sortedTags.length > TAG_LIMIT"
        type="button"
        class="mt-3 text-xs text-muted-foreground transition-colors hover:text-primary"
        @click="tagsExpanded = !tagsExpanded"
      >
        {{ tagsExpanded ? '收起' : `查看全部 ${sortedTags.length} 个标签` }}
      </button>
    </section>

    <section v-if="latest.length">
      <h3 class="mb-4 font-display text-sm font-bold tracking-tight">最新文章</h3>
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

const TAG_LIMIT = 24

const { data: categories } = useCategoriesData()
const { data: tags } = useTagsData()
const { data: latest } = useLatestArticlesData()

const tagsExpanded = ref(false)

// 后端是否返回了计数信息（向后兼容：老接口无 article_count 时不过滤，避免清空）
const hasCounts = computed(() => (tags.value ?? []).some((tag) => tag.article_count !== undefined))

// 仅保留有文章的标签，按文章数降序（热门优先），同数按名称稳定排序
const sortedTags = computed(() =>
  [...(tags.value ?? [])]
    .filter((tag) => !hasCounts.value || (tag.article_count ?? 0) > 0)
    .sort((a, b) => (b.article_count ?? 0) - (a.article_count ?? 0) || a.name.localeCompare(b.name))
)

// 默认只展示热门 TAG_LIMIT 个，其余折叠到「查看全部」之后
const visibleTags = computed(() =>
  tagsExpanded.value ? sortedTags.value : sortedTags.value.slice(0, TAG_LIMIT)
)
</script>
