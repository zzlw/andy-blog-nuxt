/**
 * @file RSS feed（BFF 调后端 API 生成 XML）
 */

import axios from 'axios'
import { APP_META } from '@/configs/app.config'
import { getServerApiUrl } from '@/configs/app.runtime'
import type { CacheStore } from '@/server/services/cache'
import type { Article, PaginateResult } from '@/interfaces'

const RSS_CACHE_KEY = 'getter:rss'
const RSS_CACHE_TTL = 60 * 30

const escapeXml = (text: string) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const buildRssXml = (articles: Article[]): string => {
  const items = articles
    .map((article) => {
      const link = `${APP_META.url}/article/${article.id}`
      return [
        '    <item>',
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <description>${escapeXml(article.description || '')}</description>`,
        `      <pubDate>${new Date(article.created_date).toUTCString()}</pubDate>`,
        '    </item>'
      ].join('\n')
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(APP_META.title)}</title>`,
    `    <link>${APP_META.url}</link>`,
    `    <description>${escapeXml(APP_META.description)}</description>`,
    '    <language>zh-CN</language>',
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    items,
    '  </channel>',
    '</rss>'
  ].join('\n')
}

export const getRssXml = async (cache: CacheStore): Promise<string> => {
  const cached = await cache.get<string>(RSS_CACHE_KEY)
  if (cached) return cached

  const response = await axios.get(`${getServerApiUrl()}/api/articles`, {
    params: { page: 1, page_size: 50 },
    timeout: 10_000
  })
  const result: PaginateResult<Article> = response.data.result
  const xml = buildRssXml(result.data)
  await cache.set(RSS_CACHE_KEY, xml, RSS_CACHE_TTL)
  return xml
}
