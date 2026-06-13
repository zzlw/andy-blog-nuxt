/**
 * @file API 数据模型（对齐 andy-blog-koa NestJS 后端，app 与 server 共用）
 */

export interface Pagination {
  page: number
  page_size: number
  total: number
  total_page: number
}

export interface PaginateResult<T> {
  data: T[]
  pagination: Pagination
}

export interface Category {
  id: number
  name: string
  description: string
  cover: string
}

export interface Tag {
  id: number
  name: string
  /** 已发布且公开的文章数（后端 /tags 附带，用于热门排序与隐藏空标签） */
  article_count?: number
}

export interface Author {
  id: number
  name: string
  avatar: string
  email: string
  description: string
}

export interface ArticleBrief {
  id: number
  title: string
  cover: string
  created_date: string
}

export interface Article {
  id: number
  title: string
  content?: string
  description: string
  cover: string
  created_date: string
  created_at?: string
  updated_at?: string
  category_id: number | null
  tag_ids: number[]
  author_ids: number[]
  star: number
  like: number
  views: number
  category: Category | null
  tags: Tag[]
  authors: Author[]
  related?: ArticleBrief[]
}

export interface Comment {
  id: number
  article_id: number
  /** 顶级评论为 0 */
  parent_id: number
  nickname: string
  content: string
  like: number
  email: string
  website: string
  created_at: string
}

export interface Message {
  id: number
  nickname: string
  content: string
  created_at: string
}

export interface Friend {
  id: number
  name: string
  link: string
  avatar: string
}

export interface ArchiveYear {
  year: number
  articles: ArticleBrief[]
}

export interface ArticleListParams {
  page?: number
  page_size?: number
  category_id?: number
  tag_id?: number
  keyword?: string
  star?: number
}
