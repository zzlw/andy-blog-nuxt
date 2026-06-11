import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-01',

  modules: ['@nuxtjs/color-mode', 'shadcn-nuxt'],

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
      staticPath: ''
    }
  },

  // SWR 页面缓存：替代自研 Redis/LRU SSR 缓存
  routeRules: {
    '/': { swr: 60 },
    '/article/**': { swr: 60 },
    '/category/**': { swr: 300 },
    '/tag/**': { swr: 300 },
    '/archive': { swr: 300 },
    '/about': { swr: 300 }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'Gavin' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  }
})
