/**
 * @file sitemap.xml（BFF 调后端 API 生成）
 */

import axios from 'axios'
import { APP_META } from '@/configs/app.config'
import { getServerApiUrl } from '@/configs/app.runtime'
import type { CacheStore } from '@/server/services/cache'
import type { ArchiveYear, Category, Tag } from '@/interfaces'

const SITEMAP_CACHE_KEY = 'getter:sitemap'
const SITEMAP_CACHE_TTL = 60 * 60

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: string
}

const buildSitemapXml = (urls: SitemapUrl[]): string => {
  const items = urls
    .map((url) => {
      const fields = [
        `    <loc>${url.loc}</loc>`,
        url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>` : '',
        url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>` : '',
        url.priority ? `    <priority>${url.priority}</priority>` : ''
      ]
        .filter(Boolean)
        .join('\n')
      return `  <url>\n${fields}\n  </url>`
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    items,
    '</urlset>'
  ].join('\n')
}

export const getSitemapXml = async (cache: CacheStore): Promise<string> => {
  const cached = await cache.get<string>(SITEMAP_CACHE_KEY)
  if (cached) return cached

  const apiUrl = getServerApiUrl()
  const request = (path: string) =>
    axios.get(`${apiUrl}/api${path}`, { timeout: 10_000 }).then((response) => response.data.result)

  const [archive, categories, tags] = await Promise.all([
    request('/articles/archive') as Promise<ArchiveYear[]>,
    request('/categories') as Promise<Category[]>,
    request('/tags') as Promise<Tag[]>
  ])

  const urls: SitemapUrl[] = [
    { loc: APP_META.url, changefreq: 'daily', priority: '1.0' },
    { loc: `${APP_META.url}/archive`, changefreq: 'daily', priority: '0.8' },
    { loc: `${APP_META.url}/guestbook`, changefreq: 'weekly', priority: '0.5' },
    { loc: `${APP_META.url}/about`, changefreq: 'monthly', priority: '0.5' }
  ]

  for (const year of archive) {
    for (const article of year.articles) {
      urls.push({
        loc: `${APP_META.url}/article/${article.id}`,
        lastmod: new Date(article.created_date).toISOString(),
        changefreq: 'weekly',
        priority: '0.9'
      })
    }
  }
  for (const category of categories) {
    urls.push({ loc: `${APP_META.url}/category/${category.id}`, changefreq: 'weekly', priority: '0.6' })
  }
  for (const tag of tags) {
    urls.push({ loc: `${APP_META.url}/tag/${tag.id}`, changefreq: 'weekly', priority: '0.6' })
  }

  const xml = buildSitemapXml(urls)
  await cache.set(SITEMAP_CACHE_KEY, xml, SITEMAP_CACHE_TTL)
  return xml
}
