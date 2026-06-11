/**
 * @file Markdown 渲染（marked + highlight.js，同构）
 */

import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
// common 子集（~40 种常用语言），避免全量 highlight.js 体积
import hljs from 'highlight.js/lib/common'
import { resolveStaticUrl } from './url'

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
    image({ href, title, text }) {
      const src = resolveStaticUrl(href)
      const titleAttr = title ? ` title="${title}"` : ''
      return `<img src="${src}" alt="${text ?? ''}"${titleAttr} loading="lazy" />`
    },
    link({ href, title, text }) {
      const titleAttr = title ? ` title="${title}"` : ''
      return `<a href="${href}"${titleAttr} target="_blank" rel="external nofollow noopener">${text}</a>`
    }
  }
})

export const renderMarkdown = (markdown?: string | null): string => {
  if (!markdown) return ''
  return marked.parse(markdown, { async: false }) as string
}
