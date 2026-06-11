/**
 * @file BFF 响应器
 */

import type { ServerResponse } from 'http'
import { MIME_TYPES } from '@/constants/mime-type'
import { SUCCESS, INTERNAL_SERVER_ERROR } from '@/constants/http-code'

export interface RequestResult {
  status: number
  body: any
  contentType?: string
  headers?: Record<string, string>
}

export const respondWith = (response: ServerResponse, result: RequestResult) => {
  const headers: Record<string, string | undefined> = {
    'Content-Type': result.contentType,
    ...result.headers
  }
  const body =
    result.body == null
      ? ''
      : Buffer.isBuffer(result.body)
        ? result.body
        : typeof result.body === 'object' && headers['Content-Type']?.includes(MIME_TYPES.json)
          ? JSON.stringify(result.body)
          : String(result.body)

  if (!response.headersSent) {
    response.writeHead(result.status, headers as Record<string, string>)
  }
  if (!response.writableEnded) {
    response.end(body)
  }
}

export const respond = {
  json: (body: any, status = SUCCESS): RequestResult => ({ body, status, contentType: MIME_TYPES.json }),
  text: (body: string, status = SUCCESS): RequestResult => ({ body, status, contentType: MIME_TYPES.text }),
  html: (body: string, status = SUCCESS): RequestResult => ({ body, status, contentType: MIME_TYPES.html }),
  xml: (body: string, status = SUCCESS): RequestResult => ({ body, status, contentType: MIME_TYPES.xml }),
  error: (error: unknown, status = INTERNAL_SERVER_ERROR): RequestResult => ({
    status,
    body: error instanceof Error ? error.message : String(error),
    contentType: MIME_TYPES.text
  })
}
