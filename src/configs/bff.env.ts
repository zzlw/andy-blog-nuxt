/**
 * @file BFF（Node 进程）环境，仅服务端引用
 */

import path from 'path'

export const NODE_ENV = process.env.NODE_ENV ?? 'development'
export const isNodeDev = NODE_ENV === 'development'
export const isNodeProd = NODE_ENV === 'production'

export const ROOT_PATH = process.cwd()
export const DIST_PATH = path.join(ROOT_PATH, 'dist')
export const PUBLIC_PATH = path.join(DIST_PATH, 'client')
export const PROD_SERVER_PATH = path.join(DIST_PATH, 'server')

export const BFF_SERVER_PORT = Number(process.env.PORT) || 3000
