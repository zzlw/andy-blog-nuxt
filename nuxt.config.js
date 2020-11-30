
module.exports = {
  mode: 'universal',

  server: {
    host: '0.0.0.0',
    port: 5000, // default: 5000
  },

  /*
  ** Headers of the page
  */
  head: {
    title: '夏季指南啊',
    titleTemplate: '%s | Andy',
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
      { rel: 'dns-prefetch', href: '//cdn.fxq.design' },
      { rel: 'dns-prefetch', href: '//api.fxq.design' },
      { rel: 'stylesheet', href:   'https://cdn.bootcss.com/aplayer/1.10.1/APlayer.min.css'}
    ],
    script: [
      {
        async: 'async',
        type: 'text/javascript',
        src: 'https://cdn.fxq.design/intersection-polyfill.js'
      },
      {
        async: 'async',
        type: 'text/javascript',
        src: 'https://www.googletagmanager.com/gtag/js?id=UA-160689475-1'
      },
      {
        // Global site tag (gtag.js) - Google Analytics
        type: 'text/javascript',
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-160689475-1');
        `
      },
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
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
