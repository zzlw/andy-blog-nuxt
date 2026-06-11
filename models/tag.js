import {
  get
} from '@/services/http/axios'

class Tag {
  // 获取所有标签
  getTags() {
    return get('api/tags')
  }
}

export default new Tag()
