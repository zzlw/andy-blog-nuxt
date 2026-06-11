/**
 * @file 文章列表（首页/分类/标签/搜索通用，支持加载更多）
 */

import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'
import { blogApi, type ArticleListParams } from '/@/services/api'
import type { Article, Pagination } from '/@/interfaces'

export const useArticleListStore = defineStore('articleList', () => {
  const fetching = ref(false)
  const articles = shallowRef<Article[]>([])
  const pagination = shallowRef<Pagination | null>(null)
  const params = shallowRef<ArticleListParams>({})

  const hasMore = computed(() => {
    return pagination.value ? pagination.value.page < pagination.value.total_page : false
  })

  const fetch = async (newParams: ArticleListParams = {}) => {
    fetching.value = true
    params.value = { ...newParams, page: 1 }
    try {
      const result = await blogApi.getArticles(params.value)
      articles.value = result.data
      pagination.value = result.pagination
    } finally {
      fetching.value = false
    }
  }

  const fetchMore = async () => {
    if (fetching.value || !hasMore.value) return
    fetching.value = true
    try {
      const nextPage = (pagination.value?.page ?? 1) + 1
      const result = await blogApi.getArticles({ ...params.value, page: nextPage })
      articles.value = [...articles.value, ...result.data]
      pagination.value = result.pagination
    } finally {
      fetching.value = false
    }
  }

  // 首页 Hero：精选文章
  const featuredArticles = shallowRef<Article[]>([])
  const fetchFeatured = async () => {
    const result = await blogApi.getArticles({ star: 2, page_size: 1 })
    featuredArticles.value = result.data
  }

  return { fetching, articles, pagination, params, hasMore, fetch, fetchMore, featuredArticles, fetchFeatured }
})
