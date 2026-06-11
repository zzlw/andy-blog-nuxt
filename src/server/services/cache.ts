/**
 * @file BFF 缓存：Redis 优先，连接失败回退内存 LRU
 */

import { LRUCache } from 'lru-cache'
import { createClient as createRedisClient } from 'redis'
import { createLogger } from '@/utils/logger'

const logger = createLogger('BFF:Cache')

export type Seconds = number

export interface CacheStore {
  set(key: string, value: any, ttl?: Seconds): Promise<void>
  get<T = any>(key: string): Promise<T>
  has(key: string): Promise<boolean>
  del(key: string): Promise<any>
  clear(): Promise<void>
}

const createLRUStore = (): CacheStore => {
  const lru = new LRUCache<string, any>({ max: 500 })
  return {
    set: async (key, value, ttl) => {
      lru.set(key, value, ttl ? { ttl: ttl * 1000 } : undefined)
    },
    get: async (key) => lru.get(key),
    has: async (key) => lru.has(key),
    del: async (key) => lru.delete(key),
    clear: async () => lru.clear()
  }
}

const createRedisStore = async (namespace: string): Promise<CacheStore> => {
  const client = createRedisClient({
    url: process.env.REDIS_URI || 'redis://localhost:6379',
    socket: { reconnectStrategy: (retries) => Math.min(retries * 200, 5000) }
  })
  client.on('error', (error) => logger.error('Redis client error!', error?.message || error))
  await client.connect()

  const cacheKey = (key: string) => `${namespace}:${key}`
  return {
    set: async (key, value, ttl) => {
      const raw = value === undefined ? '' : JSON.stringify(value)
      if (ttl) {
        await client.set(cacheKey(key), raw, { EX: ttl })
      } else {
        await client.set(cacheKey(key), raw)
      }
    },
    get: async (key) => {
      const value = await client.get(cacheKey(key))
      return value ? JSON.parse(value) : value
    },
    has: async (key) => Boolean(await client.exists(cacheKey(key))),
    del: (key) => client.del(cacheKey(key)),
    clear: async () => {
      const keys = await client.keys(cacheKey('*'))
      if (keys.length) await client.del(keys)
    }
  }
}

export const createCacheStore = async (options: { namespace: string }): Promise<CacheStore> => {
  try {
    const store = await createRedisStore(options.namespace)
    logger.info('Redis store readied.')
    await store.clear()
    return store
  } catch (error) {
    logger.warn('Redis unavailable, fallback to LRU store.')
    return createLRUStore()
  }
}
