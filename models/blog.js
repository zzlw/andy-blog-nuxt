import {
  get
} from '@/services/http/axios'

class Blog {
  // 获取所有友情链接
  getFriends() {
    return get('api/friends')
  }
}

export default new Blog()
