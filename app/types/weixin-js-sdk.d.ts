export interface WxShareData {
  title: string
  desc?: string
  link: string
  imgUrl: string
  success?: () => void
  cancel?: () => void
}

export interface WxConfig {
  debug?: boolean
  appId: string
  timestamp: number
  nonceStr: string
  signature: string
  jsApiList: string[]
  openTagList?: string[]
}

declare global {
  interface Wx {
    config: (cfg: WxConfig) => void
    ready: (cb: () => void) => void
    error: (cb: (res: { errMsg: string }) => void) => void
    updateAppMessageShareData: (cfg: WxShareData) => void
    updateTimelineShareData: (cfg: Omit<WxShareData, 'desc'>) => void
    /** 旧接口：部分客户端仍走这里，需与新接口同时注册 */
    onMenuShareAppMessage?: (cfg: WxShareData) => void
    onMenuShareTimeline?: (cfg: Omit<WxShareData, 'desc'>) => void
  }

  interface Window {
    wx?: Wx
    /** iOS 微信：首次进入 H5 的 URL（不含 hash），供 JS-SDK 签名使用 */
    __wx_entry_url?: string
  }
}

export {}
