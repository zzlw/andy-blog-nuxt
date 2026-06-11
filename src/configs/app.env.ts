/**
 * @file 同构环境标识（client + SSR bundle 均可用）
 */

// tsx（纯 Node）下 import.meta.env 不存在，此时必然运行于服务端
const viteEnv = (import.meta as any).env

export const isServer = viteEnv ? Boolean(viteEnv.SSR) : true
export const isClient = !isServer
export const isDev = viteEnv ? Boolean(viteEnv.DEV) : process.env.NODE_ENV !== 'production'
export const isProd = !isDev
