/**
 * @file 文章详情 + 评论
 */

import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { blogApi } from '/@/services/api'
import type { Article, Comment } from '/@/interfaces'

export const useArticleDetailStore = defineStore('articleDetail', () => {
  const fetching = ref(false)
  const article = shallowRef<Article | null>(null)

  const fetch = async (id: number) => {
    fetching.value = true
    // 切换文章时先清空，避免闪现旧内容
    if (article.value?.id !== id) {
      article.value = null
    }
    try {
      article.value = await blogApi.getArticle(id)
    } finally {
      fetching.value = false
    }
  }

  const like = async () => {
    if (!article.value) return
    const result = await blogApi.likeArticle(article.value.id)
    article.value = { ...article.value, like: result.like }
  }

  return { fetching, article, fetch, like }
})

export const useCommentsStore = defineStore('comments', () => {
  const fetching = ref(false)
  const posting = ref(false)
  const comments = shallowRef<Comment[]>([])

  const fetch = async (articleId: number) => {
    fetching.value = true
    try {
      comments.value = await blogApi.getComments(articleId)
    } finally {
      fetching.value = false
    }
  }

  const post = async (payload: Parameters<typeof blogApi.createComment>[0]) => {
    posting.value = true
    try {
      await blogApi.createComment(payload)
      await fetch(payload.article_id)
    } finally {
      posting.value = false
    }
  }

  const like = async (commentId: number) => {
    const result = await blogApi.likeComment(commentId)
    comments.value = comments.value.map((comment) =>
      comment.id === commentId ? { ...comment, like: result.like } : comment
    )
  }

  return { fetching, posting, comments, fetch, post, like }
})
