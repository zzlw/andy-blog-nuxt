import {
  get,
  post
} from '@/services/http/axios'

// 写操作兼容层：页面通过 errorCode === 0 判断成功（沿用旧约定）
const toErrorCode = (promise) => promise
  .then(() => ({ errorCode: 0 }))
  .catch((e) => ({ errorCode: 1, msg: e && e.message }))

class Comment {
  // 获取这篇文章下的所有评论
  async getComments(query) {
    const comments = await get('api/comments', { article_id: query.articleId })
    // 字段兼容：评论组件展示时间用的是 created_date
    return comments.map(v => ({ ...v, created_date: v.created_at }))
  }

  // 点赞某条评论
  likeComment(id) {
    return toErrorCode(post(`api/comments/${id}/like`))
  }

  // 创建一条评论
  createComment(data) {
    return toErrorCode(post('api/comments', {
      article_id: data.articleId,
      nickname: data.nickname,
      content: data.content
    }))
  }

  // 回复评论
  replyComment(data) {
    return toErrorCode(post('api/comments', {
      article_id: data.articleId,
      parent_id: data.parentId,
      nickname: data.nickname,
      content: data.content
    }))
  }
}

export default new Comment()
