/**
 * @file 访客身份：点赞防重（localStorage）+ 评论者资料记忆
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { isClient } from '/@/configs/app.env'

const LIKED_ARTICLES_KEY = 'liked_articles'
const LIKED_COMMENTS_KEY = 'liked_comments'
const GUEST_PROFILE_KEY = 'guest_profile'

const readJSON = <T>(key: string, fallback: T): T => {
  if (!isClient) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const writeJSON = (key: string, value: any) => {
  if (!isClient) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota error
  }
}

export interface GuestProfile {
  nickname: string
  email: string
  website: string
}

export const useIdentityStore = defineStore('identity', () => {
  const likedArticles = ref<number[]>([])
  const likedComments = ref<number[]>([])
  const guestProfile = ref<GuestProfile>({ nickname: '', email: '', website: '' })

  const initOnClient = () => {
    likedArticles.value = readJSON(LIKED_ARTICLES_KEY, [])
    likedComments.value = readJSON(LIKED_COMMENTS_KEY, [])
    guestProfile.value = readJSON(GUEST_PROFILE_KEY, { nickname: '', email: '', website: '' })
  }

  const isArticleLiked = (id: number) => likedArticles.value.includes(id)
  const isCommentLiked = (id: number) => likedComments.value.includes(id)

  const markArticleLiked = (id: number) => {
    if (isArticleLiked(id)) return
    likedArticles.value = [...likedArticles.value, id]
    writeJSON(LIKED_ARTICLES_KEY, likedArticles.value)
  }

  const markCommentLiked = (id: number) => {
    if (isCommentLiked(id)) return
    likedComments.value = [...likedComments.value, id]
    writeJSON(LIKED_COMMENTS_KEY, likedComments.value)
  }

  const saveGuestProfile = (profile: GuestProfile) => {
    guestProfile.value = profile
    writeJSON(GUEST_PROFILE_KEY, profile)
  }

  return {
    likedArticles,
    likedComments,
    guestProfile,
    initOnClient,
    isArticleLiked,
    isCommentLiked,
    markArticleLiked,
    markCommentLiked,
    saveGuestProfile
  }
})
