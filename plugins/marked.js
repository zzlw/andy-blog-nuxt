import marked from 'marked'
import highlight from './highlight'
import Config from '../config'
import DOMPurify from 'dompurify'

const languages = [
  'cpp',
  'xml',
  'bash',
  'coffeescript',
  'css',
  'markdown',
  'http',
  'java',
  'javascript',
  'json',
  'less',
  'makefile',
  'nginx',
  'php',
  'python',
  'scss',
  'sql',
  'stylus'
];

const renderer = new marked.Renderer();

marked.setOptions({
  renderer,
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: (code, lang) => {
    if (languages.includes(lang)) {
      return highlight.highlight(lang, code).value
    }
    return highlight.highlightAuto(code).value
  },
})

// 阿里云 OSS 图片处理样式（默认访问规则：域名/key?x-oss-process=style/样式名）
// 样式在 OSS 控制台「数据处理 → 图片处理」中维护：thumbnail（低清占位）/ progressive（渐进式）
const ossStyle = (src, style) => `${src}?x-oss-process=style/${style}`

// STATIC_PATH 支持逗号分隔多个域名（如新 OSS 域名 + 旧图床域名共存的过渡期）
const isStaticHost = (src) =>
  String(Config.staticPath || '')
    .split(',')
    .filter(Boolean)
    .some((host) => src.includes(host.trim()))

const imageParse = (src, title, alt) => {
  if (!isStaticHost(src)) {
    return `
      <figure class="image-wrapper">
        <div class="progress-image">
          <img
            src="${src}" title="${title || alt || 'Gavin'}" />
        </div>
        <div class="image-caption">
          <span>${title || alt || ''}</span>
        </div>
      </figure>
    `
  }
  return `
    <figure class="image-wrapper">
      <div class="progress-image">
        <img src="${ossStyle(src, 'thumbnail')}" title="${title || alt || 'Gavin'}"
          class="thumbnail"/>
        <img
          data-origin="${src}"
          data-src="${ossStyle(src, 'progressive')}" title="${title || alt || 'Gavin'}"
          class="image-popper real-image"/>
      </div>
      <div class="image-caption">
        <span>${title || alt || ''}</span>
      </div>
    </figure>
  `
}

const linkParser = (href, title, text) => {
  const self = href.substr(0, 1) === '#'
  return `<a href="${href}" target="${self ? '_self' : '_blank'}">${text}</a>`
}

renderer.image = imageParse
renderer.link = linkParser

export default (content) => {
  if (typeof content !== 'string') {
    return ''
  }
  let html = marked(content, { renderer })
  if (DOMPurify.sanitize) {
    html = DOMPurify.sanitize(html)
  }
  return html
}
