<template>
  <div>
    <div v-if="!articles.length && !loading" class="py-16 text-center text-muted-foreground">
      暂无文章
    </div>

    <div class="divide-y divide-border">
      <ArticleItem v-for="article in articles" :key="article.id" :article="article" />
    </div>

    <div v-if="hasMore" class="mt-6 text-center">
      <Button variant="outline" :disabled="loading" @click="loadMore">
        {{ loading ? '加载中…' : '加载更多' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article, ArticleListParams, Pagination } from '#shared/types'

const props = withDefaults(
  defineProps<{
    dataKey: string
    params?: ArticleListParams
    pageSize?: number
  }>(),
  { params: () => ({}), pageSize: 12 }
)

const api = useBlogApi()

const { data, pending } = await useAsyncData(`articles-${props.dataKey}`, () =>
  api.getArticles({ ...props.params, page: 1, page_size: props.pageSize })
)

// 后续分页在客户端追加，首屏数据走 SSR + SWR 缓存
const extraArticles = ref<Article[]>([])
const extraLoading = ref(false)
const lastPagination = ref<Pagination | null>(null)

const articles = computed<Article[]>(() => [...(data.value?.data ?? []), ...extraArticles.value])
const loading = computed(() => pending.value || extraLoading.value)

const pagination = computed(() => lastPagination.value ?? data.value?.pagination ?? null)
const hasMore = computed(() => {
  const p = pagination.value
  return !!p && p.page < p.total_page
})

const loadMore = async () => {
  const p = pagination.value
  if (!p || extraLoading.value) return
  extraLoading.value = true
  try {
    const result = await api.getArticles({ ...props.params, page: p.page + 1, page_size: props.pageSize })
    extraArticles.value.push(...result.data)
    lastPagination.value = result.pagination
  } finally {
    extraLoading.value = false
  }
}
</script>
