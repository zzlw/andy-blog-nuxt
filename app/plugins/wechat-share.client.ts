/**
 * 微信内置浏览器自定义分享（聊天 + 朋友圈）。
 * - 仅 MicroMessenger UA 加载 JS-SDK，其它浏览器零开销
 * - 签名由后端 /api/wechat/signature 生成（access_token / jsapi_ticket 在 Redis 缓存）
 * - iOS 微信：SPA 改路由后 location.href 变了，签名仍须用首次进入的 URL
 * - Android 微信：每次路由用当前 URL 重新 wx.config
 * 调试：URL 加 ?wxdebug=1 开启 wx.config debug（真机 alert）
 */
import { APP_META } from '#shared/meta'

const WX_SDK_SRC = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
const JS_API_LIST = [
  'updateAppMessageShareData',
  'updateTimelineShareData',
  'onMenuShareAppMessage',
  'onMenuShareTimeline'
]

const isWeChat = () => /MicroMessenger/i.test(navigator.userAgent)
const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent)

const currentUrl = (): string => location.href.replace(/#.*$/, '')

const signUrl = (): string => {
  if (isIOS()) {
    const entry = window.__wx_entry_url ?? currentUrl()
    window.__wx_entry_url = entry
    return entry
  }
  return currentUrl()
}

const loadWxSdk = (): Promise<Wx> => {
  if (window.wx) return Promise.resolve(window.wx)
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = WX_SDK_SRC
    script.async = true
    script.onload = () => {
      if (window.wx) resolve(window.wx)
      else reject(new Error('微信 JS-SDK 未挂载'))
    }
    script.onerror = () => reject(new Error('微信 JS-SDK 加载失败'))
    document.head.appendChild(script)
  })
}

const toAbsoluteUrl = (url: string): string => {
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('//')) return `${location.protocol}${url}`
  if (url.startsWith('/')) return `${location.origin}${url}`
  return url
}

const defaultIcon = (configured: string) => configured || APP_META.shareIcon

const readMetaDescription = () =>
  document.querySelector('meta[name="description"]')?.getAttribute('content') || APP_META.description

export default defineNuxtPlugin((nuxtApp) => {
  if (!isWeChat()) return

  const api = useBlogApi()
  const shareState = useWechatShareState()
  const route = useRoute()
  const configuredIcon = (useRuntimeConfig().public.wechatShareIcon as string) || ''

  let lastSignedUrl = ''
  let configReady = false
  let generation = 0

  const resolveShare = () => {
    const custom = shareState.value
    const forThisRoute = custom && custom.path === route.fullPath ? custom : null
    return {
      title: forThisRoute?.title || document.title || APP_META.title,
      desc: forThisRoute?.desc || readMetaDescription(),
      link: forThisRoute?.link || currentUrl(),
      imgUrl: toAbsoluteUrl(forThisRoute?.imgUrl || defaultIcon(configuredIcon))
    }
  }

  const configWx = (wx: Wx, cfg: { appId: string; timestamp: number; nonceStr: string; signature: string }) =>
    new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error('wx.config 超时')), 8000)
      wx.config({
        debug: route.query.wxdebug === '1',
        appId: cfg.appId,
        timestamp: cfg.timestamp,
        nonceStr: cfg.nonceStr,
        signature: cfg.signature,
        jsApiList: JS_API_LIST
      })
      wx.ready(() => {
        window.clearTimeout(timer)
        resolve()
      })
      wx.error((res) => {
        window.clearTimeout(timer)
        reject(new Error(res.errMsg || 'wx.config 失败'))
      })
    })

  const applyShare = async () => {
    const gen = ++generation
    try {
      const wx = await loadWxSdk()
      const url = signUrl()
      if (!configReady || lastSignedUrl !== url) {
        const result = await api.getWechatSignature(url)
        if (gen !== generation) return
        if (!result.enabled) return
        await configWx(wx, result)
        if (gen !== generation) return
        configReady = true
        lastSignedUrl = url
      }

      const share = resolveShare()
      wx.ready(() => {
        if (gen !== generation) return
        const appMessage = {
          title: share.title,
          desc: share.desc,
          link: share.link,
          imgUrl: share.imgUrl
        }
        const timeline = {
          title: share.title,
          link: share.link,
          imgUrl: share.imgUrl
        }
        wx.updateAppMessageShareData(appMessage)
        wx.updateTimelineShareData(timeline)
        wx.onMenuShareAppMessage?.(appMessage)
        wx.onMenuShareTimeline?.(timeline)
      })
    } catch (error) {
      console.warn('[wechat-share]', error)
    }
  }

  const schedule = () => {
    void applyShare()
    requestAnimationFrame(() => void applyShare())
  }

  nuxtApp.hook('page:finish', () => schedule())
  watch(shareState, () => schedule())
})
