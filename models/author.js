import {
  get
} from '@/services/http/axios'

class Author {
  // 获取所有作者
  getAuthors() {
    return get('api/authors')
  }

  getAuthorDetail(id) {
    return get(`api/authors/${id}`)
  }
}

export default new Author()
