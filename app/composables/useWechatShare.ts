/**
 * 当前页的微信自定义分享内容。仅在微信内置浏览器中由 wechat-share 插件消费。
 * 用 path 绑定路由：离开页面后状态会因 path 不匹配而回落到站点默认分享。
 */

export interface WechatSharePayload {
  title: string
  desc?: string
  imgUrl?: string
  link?: string
}

export interface WechatShareState extends WechatSharePayload {
  path: string
}

export const useWechatShareState = () => useState<WechatShareState | null>('wechat-share', () => null)

export const useWechatShare = (payload: MaybeRefOrGetter<WechatSharePayload>) => {
  const state = useWechatShareState()
  const route = useRoute()

  watch(
    [() => route.fullPath, () => toValue(payload)],
    () => {
      state.value = { ...toValue(payload), path: route.fullPath }
    },
    { immediate: true, deep: true }
  )
}
