/**
 * @file BFF Server 极简 HTTP 框架（对齐 surmon.me server/main）
 * - usePathRequest：精确路径路由（rss/sitemap 等）
 * - useConnectMiddleware：connect 风格中间件（sirv / vite dev middleware）
 * - useWildRequest：兜底通配路由（SSR 渲染）
 */

import http from 'http'
import type { AddressInfo } from 'net'
import type { Server, IncomingMessage, ServerResponse } from 'http'
import { MIME_TYPES } from '@/constants/mime-type'
import * as HTTP_CODES from '@/constants/http-code'
import { type RequestResult, respondWith } from './responder'

export interface RequestContext {
  readonly url: string
  readonly path: string
  readonly query: Record<string, string>
  readonly headers: Record<string, string | undefined>
  request: IncomingMessage
  response: ServerResponse
}

export type RequestHandler = (context: RequestContext) => RequestResult | Promise<RequestResult>

export type ConnectMiddleware = (
  request: IncomingMessage,
  response: ServerResponse,
  next?: (error?: any) => void | Promise<void>
) => void

export interface ServerAppOptions {
  poweredBy?: string
  onError?: (error: unknown, request: IncomingMessage) => RequestResult
}

export const createBFFServerApp = (options: ServerAppOptions = {}) => {
  const middlewares: ConnectMiddleware[] = []
  const pathRoutes = new Map<string, RequestHandler>()
  let wildRouteHandler: RequestHandler | null = null

  const server = http.createServer(async (request: IncomingMessage, response: ServerResponse) => {
    response.setHeader('X-Powered-By', options.poweredBy ?? 'Node')

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return respondWith(response, {
        status: HTTP_CODES.METHOD_NOT_ALLOWED,
        body: 'Only GET and HEAD methods are allowed',
        contentType: MIME_TYPES.text
      })
    }
    if (!request.url) {
      return respondWith(response, {
        status: HTTP_CODES.BAD_REQUEST,
        body: 'URL is required',
        contentType: MIME_TYPES.text
      })
    }

    try {
      const { pathname, searchParams } = new URL(request.url, 'http://localhost')
      const context: RequestContext = {
        url: request.url,
        path: pathname,
        query: Object.fromEntries(searchParams.entries()),
        headers: request.headers as Record<string, string | undefined>,
        request,
        response
      }

      // 中间件（静态资源命中时会直接 end response）
      for (const middleware of middlewares) {
        await new Promise<void>((resolve, reject) => {
          try {
            middleware(request, response, (error?: any) => (error ? reject(error) : resolve()))
          } catch (err) {
            reject(err)
          }
        })
        if (response.writableEnded) return
      }

      const handler = pathRoutes.get(context.path) ?? wildRouteHandler
      return handler
        ? respondWith(response, await handler(context))
        : respondWith(response, {
            status: HTTP_CODES.NOT_FOUND,
            body: 'Not Found',
            contentType: MIME_TYPES.text
          })
    } catch (error) {
      respondWith(
        response,
        options.onError?.(error, request) ?? {
          status: HTTP_CODES.INTERNAL_SERVER_ERROR,
          body: 'Internal Server Error',
          contentType: MIME_TYPES.text
        }
      )
    }
  })

  return {
    useConnectMiddleware: (middleware: ConnectMiddleware) => middlewares.push(middleware),
    usePathRequest: (path: string, handler: RequestHandler) => pathRoutes.set(path, handler),
    useWildRequest: (handler: RequestHandler) => (wildRouteHandler = handler),
    listen: (port: number, listener: (info: AddressInfo) => void): Server => {
      return server.listen(port, () => listener(server.address() as AddressInfo))
    }
  }
}
