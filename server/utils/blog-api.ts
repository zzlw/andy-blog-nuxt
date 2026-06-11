/**
 * @file Nitro 侧调用后端 API（内网地址优先）
 */

interface ApiEnvelope<T> {
  status: 'success' | 'error'
  message: string
  result: T
}

export const fetchBlogApi = async <T>(path: string, query?: Record<string, any>): Promise<T> => {
  const config = useRuntimeConfig()
  const origin = config.apiBaseInternal || config.public.apiBase
  const payload = await $fetch<ApiEnvelope<T>>(path, {
    baseURL: `${origin.replace(/\/+$/, '')}/api`,
    timeout: 10_000,
    query
  })
  if (payload && payload.status === 'success') {
    return payload.result
  }
  throw new Error(payload?.message ?? '接口响应异常')
}
