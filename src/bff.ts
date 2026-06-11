/**
 * @file BFF Server：静态资源 + SSR 渲染 + rss/sitemap（对齐 surmon.me bff）
 */

import { APP_META } from '@/configs/app.config'
import { BFF_SERVER_PORT, NODE_ENV, PUBLIC_PATH, isNodeProd } from '@/configs/bff.env'
import { INTERNAL_SERVER_ERROR } from '@/constants/http-code'
import { createBFFServerApp } from './server/main'
import { respond } from './server/main/responder'
import { createCacheStore } from './server/services/cache'
import { createDevRenderer } from './server/renderer/dev'
import { createProdRenderer } from './server/renderer/prod'
import { getRssXml } from './server/getters/rss'
import { getSitemapXml } from './server/getters/sitemap'
import { createLogger } from './utils/logger'

const logger = createLogger('BFF')

const cache = await createCacheStore({ namespace: 'blog_web' })

const app = createBFFServerApp({
  // HTTP header 仅允许 ASCII
  poweredBy: 'andy-blog-web',
  onError: (error, request) => {
    logger.error(`"${request.url}" >`, error instanceof Error ? error.message : error)
    return respond.error(error, INTERNAL_SERVER_ERROR)
  }
})

app.usePathRequest('/rss.xml', async () => {
  return respond.xml(await getRssXml(cache))
})

app.usePathRequest('/sitemap.xml', async () => {
  return respond.xml(await getSitemapXml(cache))
})

if (isNodeProd) {
  const { default: sirv } = await import('sirv')
  app.useConnectMiddleware(sirv(PUBLIC_PATH, { etag: true }))
  const { render } = await createProdRenderer(cache)
  app.useWildRequest((context) => render(context))
} else {
  const { render, viteServer } = await createDevRenderer(cache)
  app.useConnectMiddleware(viteServer.middlewares)
  app.useWildRequest((context) => render(context))
}

app.listen(BFF_SERVER_PORT, (addressInfo) => {
  logger.info(
    `${APP_META.title} app is running!`,
    `| env: ${NODE_ENV}`,
    `| port: ${addressInfo.port}`,
    `| ${new Date().toLocaleString()}`
  )
})
