/**
 * @file Markdown 渲染（marked + highlight.js，同构）
 * - 标题注入 id 并提取 TOC 目录树（文章页右侧栏滚动高亮用）
 * - 图片相对路径拼接 staticPath
 */

import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
// common 子集（~40 种常用语言），避免全量 highlight.js 体积
import hljs from 'highlight.js/lib/common'
import { resolveStaticUrl } from './static-url'

export interface TocItem {
  id: string
  text: string
  level: number
}

export interface RenderedMarkdown {
  html: string
  toc: TocItem[]
}

export const renderMarkdown = (
  markdown?: string | null,
  options: { staticPath?: string } = {}
): RenderedMarkdown => {
  if (!markdown) return { html: '', toc: [] }

  const staticPath = options.staticPath ?? ''
  const toc: TocItem[] = []
  let headingIndex = 0

  const marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
      }
    })
  )

  marked.use({
    gfm: true,
    breaks: true,
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens)
        const text = html.replace(/<[^>]+>/g, '').trim()
        const id = `heading-${++headingIndex}`
        if (depth >= 2 && depth <= 4) {
          toc.push({ id, text, level: depth })
        }
        return `<h${depth} id="${id}">${html}</h${depth}>\n`
      },
      image({ href, title, text }) {
        const src = resolveStaticUrl(staticPath, href)
        const titleAttr = title ? ` title="${title}"` : ''
        return `<img src="${src}" alt="${text ?? ''}"${titleAttr} loading="lazy" />`
      },
      link({ href, title, text }) {
        const titleAttr = title ? ` title="${title}"` : ''
        // 站内静态资源（相对路径，如 /blog/xxx.zip）视为附件：点击强制下载。
        // 仅靠 download 属性对跨域无效，故同时给对象存储 URL 附加
        // response-content-disposition=attachment，让 OSS/MinIO 直接以下载方式响应。
        if (href && href.startsWith('/') && !href.startsWith('//')) {
          const resolved = resolveStaticUrl(staticPath, href)
          const filename = (text || href.split('/').pop() || 'download').replace(/<[^>]+>/g, '')
          const disposition = `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
          const sep = resolved.includes('?') ? '&' : '?'
          const downloadUrl = `${resolved}${sep}response-content-disposition=${encodeURIComponent(disposition)}`
          return `<a href="${downloadUrl}"${titleAttr} download rel="noopener">${text}</a>`
        }
        return `<a href="${href}"${titleAttr} target="_blank" rel="external nofollow noopener">${text}</a>`
      }
    }
  })

  const html = marked.parse(markdown, { async: false }) as string
  return { html, toc }
}
