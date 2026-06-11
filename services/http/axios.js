import Vue from 'vue'
import axios from 'axios'
import Config, { resolveStaticDeep } from '@/config'

const config = {
  baseURL: Config.baseUrl,
  timeout: 5 * 1000,
  crossDomain: true,
  validateStatus(status) {
    return status >= 200 && status < 500
  }
}

const _axios = axios.create(config)

_axios.interceptors.request.use(originConfig => {
  const reqConfig = { ...originConfig }

  // 每次请求时动态读取 baseURL（运行时配置可能在实例创建后才注入）
  reqConfig.baseURL = Config.baseUrl

  // step1: 容错处理
  if (!reqConfig.url) {
    throw new Error({
      source: 'axiosInterceptors',
      message: 'request need url'
    })
  }

  // 默认使用 get 请求
  if (!reqConfig.method) {
    reqConfig.method = 'get'
  }

  // 大小写
  reqConfig.method = reqConfig.method.toLowerCase()

  if (reqConfig.method === 'get') {
    if (!reqConfig.params) {  // 防止字段用错
      reqConfig.params = reqConfig.data || {}
    }
  } else if (reqConfig.method === 'post') {
    if (!reqConfig.data) {
      reqConfig.data = reqConfig.params || {}
    }

    let hasFile = false
    Object.keys(reqConfig.data).forEach(key => {
      if (typeof reqConfig.data[key] === 'object') {
        if (reqConfig.data[key] instanceof FileList || reqConfig.data[key] instanceof File || reqConfig.data[key] instanceof Blob) {
          hasFile = true
        } else if (reqConfig.data[key].constructor === Object) {
          reqConfig.data[key] = JSON.stringify(reqConfig.data[key])
        }
      }
    })

    if (hasFile) {
      const formData = new FormData()
      Object.keys(reqConfig.data).forEach(key => {
        formData.append(key, reqConfig.data[key])
      })
      reqConfig.data = formData
    }
  }

  return reqConfig
}, error => {
  Promise.reject(error)
})

// 新版后端统一响应 { status: 'success' | 'error', message, result }
// 成功直接解包 result；失败抛出响应体（含 message / error 错误码）供调用方捕获
_axios.interceptors.response.use(async (res) => {
  const body = res.data
  if (res.status.toString().charAt(0) === '2' && body && body.status === 'success') {
    // 统一把相对图片路径（cover/avatar）拼成绝对 URL，域名来自 STATIC_PATH
    return resolveStaticDeep(body.result)
  }
  return Promise.reject(body || new Error(`request failed with status ${res.status}`))
}, error => {
  // eslint-disable-next-line no-console
  console.log(error)
  return Promise.reject(error)
})

const Plugin = {}

Plugin.install = function (Vue) {
  Vue.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios
      }
    },
    $axios: {
      get() {
        return _axios
      }
    }
  })
}

if (!Vue.axios) {
  Vue.use(Plugin)
}

// 导出常用函数

export function post(url, data = {}, params = {}) {
  return _axios({
    method: 'post',
    url,
    data,
    params
  })
}

export function get(url, params = {}) {
  return _axios({
    method: 'get',
    url,
    params
  })
}

export function put(url, data = {}, params = {}) {
  return _axios({
    method: 'put',
    url,
    params,
    data
  })
}

export function _delete(url, params = {}) {
  return _axios({
    method: 'delete',
    url,
    params
  })
}

export default _axios
