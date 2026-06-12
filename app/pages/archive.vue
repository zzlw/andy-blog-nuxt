<template>
  <PageShell>
    <div class="flex flex-col gap-10">
      <header>
        <h1 class="font-display text-3xl font-bold tracking-tight">归档</h1>
        <p class="mt-2 text-sm text-muted-foreground">共 {{ totalCount }} 篇文章</p>
      </header>

      <section v-if="categories.length" class="lg:hidden">
        <h3 class="mb-4 font-display text-sm font-bold tracking-tight">分类</h3>
        <div class="flex flex-wrap gap-2">
          <NuxtLink v-for="category in categories" :key="category.id" :to="`/category/${category.id}`">
            <Badge variant="secondary" class="font-normal transition-colors hover:bg-primary hover:text-primary-foreground">
              {{ category.name }}
            </Badge>
          </NuxtLink>
        </div>
      </section>

      <section v-if="tags.length" class="lg:hidden">
        <h3 class="mb-4 font-display text-sm font-bold tracking-tight">标签</h3>
        <div class="flex flex-wrap gap-2">
          <NuxtLink v-for="tag in tags" :key="tag.id" :to="`/tag/${tag.id}`">
            <Badge variant="secondary" class="font-normal transition-colors hover:bg-primary hover:text-primary-foreground">
              {{ tag.name }}
            </Badge>
          </NuxtLink>
        </div>
      </section>

      <section v-for="group in archive" :key="group.year">
        <h2 class="font-display text-2xl font-bold tracking-tight text-primary">{{ group.year }}</h2>
        <ul class="mt-4 flex flex-col border-l-2 border-border">
          <li v-for="item in group.articles" :key="item.id">
            <NuxtLink
              :to="`/article/${item.id}`"
              class="group -ml-px flex items-baseline gap-4 border-l-2 border-transparent py-2 pl-5 transition-colors hover:border-primary"
            >
              <time class="shrink-0 font-mono text-[13px] text-muted-foreground">
                {{ dateFormat(item.created_date, 'MM-DD') }}
              </time>
              <span class="truncate transition-colors group-hover:text-primary">{{ item.title }}</span>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <p v-if="!archive.length" class="py-16 text-center text-muted-foreground">暂无文章</p>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
const api = useBlogApi()

const [{ data: archive }, { data: categories }, { data: tags }] = await Promise.all([
  useAsyncData('archive', () => api.getArchive(), { default: () => [] }),
  useCategoriesData(),
  useTagsData()
])

const totalCount = computed(() => archive.value.reduce((sum, group) => sum + group.articles.length, 0))

useSeoMeta({ title: '归档' })
</script>
