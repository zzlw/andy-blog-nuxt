import {
  get
} from '@/services/http/axios'

class Category {
  // 获取所有分类
  getCategories() {
    return get('api/categories')
  }

  // 获取分类详情
  getCategory(id) {
    return get(`api/categories/${id}`)
  }
}

export default new Category()
