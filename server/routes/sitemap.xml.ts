/**
 * @file sitemap.xml（Nitro 路由，defineCachedEventHandler 缓存 1 小时）
 */

import { APP_META } from '#shared/meta'
import type { ArchiveYear, Category, Tag } from '#shared/types'

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

export default defineCachedEventHandler(
  async (event) => {
    const [archive, categories, tags] = await Promise.all([
      fetchBlogApi<ArchiveYear[]>('/articles/archive'),
      fetchBlogApi<Category[]>('/categories'),
      fetchBlogApi<Tag[]>('/tags')
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

    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    return buildSitemapXml(urls)
  },
  { maxAge: 60 * 60, name: 'sitemap', getKey: () => 'sitemap' }
)
