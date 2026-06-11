import fs from 'fs'
import path from 'path'
import type { RequestContext } from '@/server/main'
import type { RequestResult } from '@/server/main/responder'
import type { CacheStore } from '@/server/services/cache'
import type { RenderResult } from '@/server-entry'
import { MIME_TYPES } from '@/constants/mime-type'
import { DIST_PATH, PROD_SERVER_PATH } from '@/configs/bff.env'
import { resolveTemplate } from './_template'

export const createProdRenderer = async (cache: CacheStore) => {
  const template = fs.readFileSync(path.resolve(DIST_PATH, 'template.html'), 'utf-8')
  const { renderApp, renderError } = await import(path.resolve(PROD_SERVER_PATH, 'ssr.js'))

  const resolveRendered = (rendered: RenderResult): RequestResult => ({
    contentType: MIME_TYPES.html,
    status: rendered.code,
    body: resolveTemplate({
      template,
      appHTML: rendered.appHTML,
      headHTML: rendered.headHTML,
      bodyScripts: `${rendered.stateScripts}\n${rendered.contextScripts}`
    })
  })

  const render = async (context: RequestContext): Promise<RequestResult> => {
    try {
      return resolveRendered(await renderApp(context, cache))
    } catch (error: unknown) {
      return resolveRendered(await renderError(context, error))
    }
  }

  return { render }
}
