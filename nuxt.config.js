
// 自有域名一律从环境变量读取（nuxt.config 在 SSR 服务启动时执行，process.env 可用）
const STATIC_PATH = (process.env.STATIC_PATH || '').replace(/\/$/, '')
const API_BASE_URL = process.env.API_BASE_URL || ''
// dns-prefetch 提示：仅在配置了对应域名时注入
const hostOf = (url) => {
  try { return '//' + new URL(url).host } catch (e) { return '' }
}
const dnsPrefetchLinks = [STATIC_PATH, API_BASE_URL]
  .map(hostOf)
  .filter(Boolean)
  .map((href) => ({ rel: 'dns-prefetch', href }))

module.exports = {
  mode: 'universal',

  server: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000,
  },

  // 运行时配置：浏览器端可见，构建一次即可多环境部署
  publicRuntimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL || '',
    staticPath: process.env.STATIC_PATH || ''
  },

  // 服务端专属配置：SSR 数据预取走容器内网，同 key 会覆盖 publicRuntimeConfig
  privateRuntimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL_INTERNAL || process.env.API_BASE_URL || ''
  },

  /*
  ** Headers of the page
  */
  head: {
    title: '冬季指南',
    titleTemplate: '%s | Gavin',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'cleartype', content: 'on' },
      { 'http-equiv': 'Cache-Control' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
      { hid: 'keywords', name: 'keywords', content: '前端，JavaScript，博客，Node，Vue' },
      { name: 'author', content: 'zzlwte@gmail.com' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ...dnsPrefetchLinks,
      { rel: 'stylesheet', href: 'https://cdn.bootcss.com/aplayer/1.10.1/APlayer.min.css'}
    ],
    script: [
      {
        async: 'async',
        type: 'text/javascript',
        src: `${STATIC_PATH}/intersection-polyfill.js`
      },
      // {
      //   async: 'async',
      //   type: 'text/javascript',
      //   src: 'https://www.googletagmanager.com/gtag/js?id=UA-160689475-1'
      // },
      // {
      //   // Global site tag (gtag.js) - Google Analytics
      //   type: 'text/javascript',
      //   innerHTML: `
      //     window.dataLayer = window.dataLayer || [];
      //     function gtag(){dataLayer.push(arguments);}
      //     gtag('js', new Date());
      //     gtag('config', 'UA-160689475-1');
      //   `
      // },
      {
        // async: 'async',
        type: 'text/javascript',
        src: 'https://cdn.bootcss.com/color-thief/2.3.0/color-thief.min.js'
      },
      {
        // async: 'async',
        type: 'text/javascript',
        src: 'https://cdn.bootcss.com/hls.js/8.0.0-beta.3/hls.min.js'
      },
      {
        // async: 'async',
        type: 'text/javascript',
        src: 'https://cdn.bootcss.com/aplayer/1.10.1/APlayer.min.js'
      }
    ],
    noscript: [
      {
        innerHTML: 'This website requires JavaScript.'
      }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    {
      src: './assets/scss/index.scss',
      lang: 'sass'
    },
    'highlight.js/styles/github.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      // 必须放在首位：优先注入运行时配置，后续插件/请求才能拿到正确的 API 地址
      src: '~/plugins/runtime-config.js'
    },
    {
      src: '~/plugins/marked.js'
    },
    {
      src: '~/plugins/highlight.js'
    },
    {
      src: '~/plugins/gravatar.js'
    },
    {
      src: '~/plugins/filter.js'
    },
    {
      src: '~/plugins/global-component.js'
    },
    {
      src: '~/plugins/copy.js',
      ssr: false
    }
  ],
  /**
   * router config
   */
  router: {
    scrollBehavior: function (to, from, savedPosition) {
      return { x: 0, y: 0 }
    }
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    [
      '@nuxtjs/component-cache',
      {
        max: 10000,
        maxAge: 1000 * 60 * 60
      }
    ],
  ],

  styleResources: {
    scss: ['./assets/scss/variables.scss', './assets/scss/mixin.scss']
  }
}
