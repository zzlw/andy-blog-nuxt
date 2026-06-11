/**
 * @file 运行时配置（环境变量注入，构建产物多环境通用）
 * - SSR/BFF：直接读 process.env
 * - 浏览器：读 SSR 注入的 window.__INITIAL_SSR_STATE__.appConfig
 */

import { isServer } from './app.env'
import { getSSRStateValue } from '@/app/universal/script'

export interface AppRuntimeConfig {
  /** 浏览器可达的 API 地址（含协议，不含 /api 前缀） */
  apiBaseUrl: string
  /** 静态资源域名，支持逗号分隔多个，首个为主域 */
  staticPath: string
}

/** 服务端专用：SSR 数据预取走内网地址 */
export const getServerApiUrl = (): string => {
  return process.env.API_BASE_URL_INTERNAL || process.env.API_BASE_URL || 'http://localhost:3000'
}

export const getRuntimeConfig = (): AppRuntimeConfig => {
  if (isServer) {
    return {
      apiBaseUrl: process.env.API_BASE_URL || '',
      staticPath: process.env.STATIC_PATH || ''
    }
  }
  return (
    getSSRStateValue<AppRuntimeConfig>('appConfig') ?? {
      apiBaseUrl: '',
      staticPath: ''
    }
  )
}
