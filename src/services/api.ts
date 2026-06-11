/**
 * @file API service：axios 对接 NestJS 后端
 * - 响应包装 { status, message, result } 自动解包
 * - SSR 走内网地址，CSR 走公网地址（SSR 注入）
 */

import axios, { type AxiosInstance } from 'axios'
import { isServer } from '/@/configs/app.env'
import { getRuntimeConfig, getServerApiUrl } from '/@/configs/app.runtime'
import { createAppError } from '/@/app/error'
import type {
  Article,
  ArticleBrief,
  ArchiveYear,
  Author,
  Category,
  Comment,
  Friend,
  Message,
  PaginateResult,
  Tag
} from '/@/interfaces'

const resolveBaseURL = (): string => {
  const origin = isServer ? getServerApiUrl() : getRuntimeConfig().apiBaseUrl
  return `${origin.replace(/\/+$/, '')}/api`
}

let instance: AxiosInstance | null = null
const getClient = (): AxiosInstance => {
  if (!instance) {
    instance = axios.create({
      baseURL: resolveBaseURL(),
      timeout: 10_000
    })
    instance.interceptors.response.use(
      (response) => {
        const payload = response.data
        if (payload && payload.status === 'success') {
          return payload.result
        }
        return Promise.reject(createAppError(payload?.message ?? '接口响应异常', response.status))
      },
      (error) => {
        const status = error?.response?.status ?? 500
        const message = error?.response?.data?.message ?? error?.message ?? '网络异常'
        return Promise.reject(createAppError(message, status))
      }
    )
  }
  return instance
}

export interface ArticleListParams {
  page?: number
  page_size?: number
  category_id?: number
  tag_id?: number
  keyword?: string
  star?: number
}

export const blogApi = {
  getArticles(params: ArticleListParams = {}): Promise<PaginateResult<Article>> {
    return getClient().get('/articles', { params }) as any
  },
  getArticle(id: number): Promise<Article> {
    return getClient().get(`/articles/${id}`) as any
  },
  likeArticle(id: number): Promise<{ like: number }> {
    return getClient().post(`/articles/${id}/like`) as any
  },
  getArchive(): Promise<ArchiveYear[]> {
    return getClient().get('/articles/archive') as any
  },
  getCategories(): Promise<Category[]> {
    return getClient().get('/categories') as any
  },
  getTags(): Promise<Tag[]> {
    return getClient().get('/tags') as any
  },
  getAuthors(): Promise<Author[]> {
    return getClient().get('/authors') as any
  },
  getFriends(): Promise<Friend[]> {
    return getClient().get('/friends') as any
  },
  getComments(articleId: number): Promise<Comment[]> {
    return getClient().get('/comments', { params: { article_id: articleId } }) as any
  },
  createComment(payload: {
    article_id: number
    parent_id?: number
    nickname: string
    content: string
    email?: string
    website?: string
  }): Promise<Comment> {
    return getClient().post('/comments', payload) as any
  },
  likeComment(id: number): Promise<{ like: number }> {
    return getClient().post(`/comments/${id}/like`) as any
  },
  getMessages(params: { page?: number; page_size?: number } = {}): Promise<PaginateResult<Message>> {
    return getClient().get('/messages', { params }) as any
  },
  createMessage(payload: { nickname?: string; content: string }): Promise<Message> {
    return getClient().post('/messages', payload) as any
  }
}

export type BlogApi = typeof blogApi
export type { ArticleBrief }
