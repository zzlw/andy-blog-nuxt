import type { SSRHeadPayload } from '@unhead/vue/server'

export interface TemplateInput {
  template: string
  appHTML: string
  headHTML: SSRHeadPayload
  bodyScripts: string
}

export const resolveTemplate = ({ template, appHTML, headHTML, bodyScripts }: TemplateInput) => {
  return template
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace('<html>', () => `<html${headHTML.htmlAttrs}>`)
    .replace('<body>', () => `<body${headHTML.bodyAttrs}>`)
    .replace('</head>', () => `${headHTML.headTags}\n</head>`)
    .replace('</body>', () => `${headHTML.bodyTags}\n${bodyScripts}\n</body>`)
    .replace(`<!--app-html-->`, () => appHTML)
}
