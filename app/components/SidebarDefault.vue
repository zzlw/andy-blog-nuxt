<template>
  <div class="flex flex-col gap-8">
    <section v-if="categories.length">
      <h3 class="mb-3 border-l-3 border-primary pl-2.5 text-sm leading-none font-bold">分类</h3>
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

    <section v-if="tags.length">
      <h3 class="mb-3 border-l-3 border-primary pl-2.5 text-sm leading-none font-bold">标签</h3>
      <div class="flex flex-wrap gap-2">
        <NuxtLink v-for="tag in tags" :key="tag.id" :to="`/tag/${tag.id}`">
          <Badge variant="secondary" class="font-normal transition-colors hover:bg-primary hover:text-primary-foreground">
            {{ tag.name }}
          </Badge>
        </NuxtLink>
      </div>
    </section>

    <section v-if="latest.length">
      <h3 class="mb-3 border-l-3 border-primary pl-2.5 text-sm leading-none font-bold">最新文章</h3>
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

const { data: categories } = useCategoriesData()
const { data: tags } = useTagsData()
const { data: latest } = useLatestArticlesData()
</script>
