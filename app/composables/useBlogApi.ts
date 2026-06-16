/**
 * @file Blog API composable
 * - 后端响应包装 { status, message, result }，此处自动解包
 * - SSR 走内网地址（runtimeConfig.apiBaseInternal），浏览器走公网地址（public.apiBase）
 */

import type {
  Article,
  ArticleBrief,
  ArticleListParams,
  ArchiveYear,
  Author,
  Category,
  Comment,
  Friend,
  Message,
  PaginateResult,
  Song,
  Tag
} from '#shared/types'

interface ApiEnvelope<T> {
  status: 'success' | 'error'
  message: string
  result: T
}

export const useBlogApi = () => {
  const config = useRuntimeConfig()
  const origin = import.meta.server
    ? config.apiBaseInternal || config.public.apiBase
    : config.public.apiBase
  const baseURL = `${origin.replace(/\/+$/, '')}/api`

  const request = async <T>(
    path: string,
    options: { method?: 'GET' | 'POST'; query?: Record<string, any>; body?: Record<string, any> } = {}
  ): Promise<T> => {
    let payload: ApiEnvelope<T>
    try {
      payload = await $fetch<ApiEnvelope<T>>(path, {
        baseURL,
        timeout: 10_000,
        ...options
      })
    } catch (error: any) {
      throw createError({
        statusCode: error?.statusCode ?? error?.response?.status ?? 500,
        statusMessage: 'API Error',
        message: error?.data?.message ?? error?.message ?? '网络异常'
      })
    }
    if (payload && payload.status === 'success') {
      return payload.result
    }
    throw createError({ statusCode: 500, message: payload?.message ?? '接口响应异常' })
  }

  return {
    getArticles: (params: ArticleListParams = {}) =>
      request<PaginateResult<Article>>('/articles', { query: params }),
    getArticle: (id: number) => request<Article>(`/articles/${id}`),
    likeArticle: (id: number) => request<{ like: number }>(`/articles/${id}/like`, { method: 'POST' }),
    getArchive: () => request<ArchiveYear[]>('/articles/archive'),
    getCategories: () => request<Category[]>('/categories'),
    getTags: () => request<Tag[]>('/tags'),
    getSongs: () => request<Song[]>('/music'),
    getAuthors: () => request<Author[]>('/authors'),
    getFriends: () => request<Friend[]>('/friends'),
    getComments: (articleId: number) => request<Comment[]>('/comments', { query: { article_id: articleId } }),
    createComment: (payload: {
      article_id: number
      parent_id?: number
      nickname: string
      content: string
      email?: string
      website?: string
    }) => request<Comment>('/comments', { method: 'POST', body: payload }),
    likeComment: (id: number) => request<{ like: number }>(`/comments/${id}/like`, { method: 'POST' }),
    getMessages: (params: { page?: number; page_size?: number } = {}) =>
      request<PaginateResult<Message>>('/messages', { query: params }),
    createMessage: (payload: { nickname?: string; content: string }) =>
      request<Message>('/messages', { method: 'POST', body: payload })
  }
}

export type BlogApi = ReturnType<typeof useBlogApi>
export type { ArticleBrief }
