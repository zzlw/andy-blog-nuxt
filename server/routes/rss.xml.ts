/**
 * @file RSS feed（Nitro 路由，defineCachedEventHandler 缓存 30 分钟）
 */

import { APP_META } from '#shared/meta'
import type { Article, PaginateResult } from '#shared/types'

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

export default defineCachedEventHandler(
  async (event) => {
    const result = await fetchBlogApi<PaginateResult<Article>>('/articles', { page: 1, page_size: 50 })
    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    return buildRssXml(result.data)
  },
  { maxAge: 60 * 30, name: 'rss', getKey: () => 'rss' }
)
