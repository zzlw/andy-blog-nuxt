/**
 * @file 设备类型（SSR 用 UA 判定，桌面/移动布局切换）
 */

import { computed } from 'vue'
import { useGlobalState } from '/@/app/state'

export const useDevice = () => {
  const globalState = useGlobalState()
  const isMobile = computed(() => globalState.userAgent.isMobile)
  const isDesktop = computed(() => !globalState.userAgent.isMobile)
  return { isMobile, isDesktop }
}
