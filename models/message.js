import {
  get,
  post
} from '@/services/http/axios'

class Message {
  // 获取所有留言（页面侧 page 从 0 开始，新 API 从 1 开始）
  async getMessages(params = {}) {
    const { data, pagination } = await get('api/messages', {
      page: (params.page || 0) + 1
    })
    // 字段兼容：旧响应为 { collection, total }
    return { collection: data, total: pagination.total }
  }

  // 新增一条留言（页面通过 errorCode === 0 判断成功）
  createMessage(message) {
    return post('api/messages', message)
      .then(() => ({ errorCode: 0 }))
      .catch((e) => ({ errorCode: 1, msg: e && e.message }))
  }
}

export default new Message()
