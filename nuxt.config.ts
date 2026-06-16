import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-01',

  modules: ['@nuxtjs/color-mode', 'shadcn-nuxt', '@nuxtjs/i18n'],

  i18n: {
    // 文章内容由后端提供（统一中文），多语言仅作用于站点 UI；
    // 故采用 no_prefix 策略 + Cookie 持久化，避免相同内容产生重复 URL（SEO 友好）。
    strategy: 'no_prefix',
    defaultLocale: 'zh-Hans',
    vueI18n: 'i18n.config.ts',
    locales: [
      { code: 'zh-Hans', language: 'zh-CN', name: '简体中文', file: 'zh-Hans.json' },
      { code: 'zh-Hant', language: 'zh-TW', name: '繁體中文', file: 'zh-Hant.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      // no_prefix 下仅用于首访挑选语言并写入 Cookie
      redirectOn: 'root'
    }
  },

  shadcn: {
    prefix: '',
    componentDir: '~/components/ui'
  },

  css: ['~/assets/css/main.css', 'highlight.js/styles/atom-one-dark.css'],

  vite: {
    plugins: [tailwindcss()]
  },

  colorMode: {
    // class 直接为 .dark / .light，配合 Tailwind @custom-variant dark
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },

  runtimeConfig: {
    // SSR/Nitro 走内网地址（NUXT_API_BASE_INTERNAL）
    apiBaseInternal: '',
    public: {
      // 浏览器走公网地址（NUXT_PUBLIC_API_BASE）
      apiBase: 'http://localhost:9000',
      // 静态资源域名，支持逗号分隔多域名（NUXT_PUBLIC_STATIC_PATH）
      staticPath: '',
      // AI 对话助手服务地址（surmon.me.ai / Cloudflare Workers，NUXT_PUBLIC_AI_API_BASE）
      // 留空则不渲染 AI 助手浮窗，便于后端未就绪时安全降级
      aiApiBase: ''
    }
  },

  // SWR 页面缓存：替代自研 Redis/LRU SSR 缓存
  // 注意：列表页（/ 与 /archive）不叠加页面级 SWR。
  // 原因：SWR 会把 HTML 文档与 _payload.json 拆成两个独立缓存条目，各自独立到期/再验证，
  // 发布后短时间内二者可能不同步（HTML 新、payload 旧），客户端水合时用旧 payload 覆盖，
  // 表现为「新列表闪一下又回到旧列表」。这两个页面改为 SSR 直出，依赖后端按发布事件失效的
  // Redis 缓存即可保证实时且高效。内容稳定的详情/分类/标签/关于页保留 SWR。
  routeRules: {
    '/': {},
    '/archive': {},
    '/article/**': { swr: 60 },
    '/category/**': { swr: 300 },
    '/tag/**': { swr: 300 },
    '/about': { swr: 300 }
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'Gavin' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  }
})
