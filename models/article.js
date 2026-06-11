import {
  get,
  post
} from '../services/http/axios'

// 写操作兼容层：页面通过 errorCode === 0 判断成功（沿用旧约定）
const toErrorCode = (promise) => promise
  .then(() => ({ errorCode: 0 }))
  .catch((e) => ({ errorCode: 1, msg: e && e.message }))

// 页面直接渲染 article.category.name，无分类时兜底
const withCategoryFallback = (article) => ({
  ...article,
  category: article.category || { id: 0, name: '未分类' }
})

class Article {
  // 获取所有文章（页面侧 page 从 0 开始，新 API 从 1 开始）
  async getArticles(params = {}) {
    const query = {
      page: (params.page || 0) + 1
    }
    if (params.categoryId) query.category_id = params.categoryId
    if (params.authorId) query.author_id = params.authorId
    if (params.tagId) query.tag_id = params.tagId
    if (params.search) query.keyword = params.search

    const { data, pagination } = await get('api/articles', query)
    return { articles: data.map(withCategoryFallback), total: pagination.total }
  }

  // 获取所有精选文章
  async getStarArticles() {
    const { data } = await get('api/articles', { star: 2, page_size: 20 })
    return data.map(withCategoryFallback)
  }

  // 获取历史归档（页面期望按时间倒序的扁平文章数组）
  async getArchive() {
    const years = await get('api/articles/archive')
    return years.reduce((list, year) => list.concat(year.articles), [])
  }

  // 获取某篇文章详情
  async getArticleDetail(query) {
    const article = await get(`api/articles/${query.id}`)
    // 字段兼容：相关推荐旧字段名为 categoryArticles
    article.categoryArticles = article.related || []
    return withCategoryFallback(article)
  }

  // 获取这篇文章下的所有评论
  async getComments(query) {
    const comments = await get('api/comments', { article_id: query.articleId })
    // 字段兼容：评论组件展示时间用的是 created_date
    return comments.map(v => ({ ...v, created_date: v.created_at }))
  }

  // 点赞文章
  likeArticle(id) {
    return toErrorCode(post(`api/articles/${id}/like`))
  }

  // 搜索文章
  async searchArticles(params) {
    const { data, pagination } = await get('api/articles', {
      page: (params.page || 0) + 1,
      keyword: params.search
    })
    return { articles: data.map(withCategoryFallback), total: pagination.total }
  }
}

export default new Article()
