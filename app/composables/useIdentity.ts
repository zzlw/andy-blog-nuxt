/**
 * @file 访客身份：点赞防重（localStorage）+ 评论者资料记忆
 * 状态挂在 useState 上；客户端水合完成后由 app.vue 调用 initOnClient 读取 localStorage，避免水合不一致
 */

const LIKED_ARTICLES_KEY = 'liked_articles'
const LIKED_COMMENTS_KEY = 'liked_comments'
const GUEST_PROFILE_KEY = 'guest_profile'

export interface GuestProfile {
  nickname: string
  email: string
  website: string
}

const readJSON = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const writeJSON = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota error
  }
}

export const useIdentity = () => {
  const likedArticles = useState<number[]>('identity-liked-articles', () => [])
  const likedComments = useState<number[]>('identity-liked-comments', () => [])
  const guestProfile = useState<GuestProfile>('identity-guest-profile', () => ({
    nickname: '',
    email: '',
    website: ''
  }))

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
}
