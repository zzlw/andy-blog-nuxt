/**
 * @file 全局状态（错误 / hydration / UI 开关）
 */

import { App, Plugin, inject, ref, computed } from 'vue'
import type { AppError } from './error'
import { formatErrorToAppError } from './error'

export type AppErrorValue = AppError | null

export interface GlobalStateConfig {
  error?: AppErrorValue
}

const GlobalStateSymbol = Symbol('globalState')

export type GlobalState = ReturnType<typeof createGlobalStateInstance>

const createGlobalStateInstance = (config: GlobalStateConfig) => {
  // hydration 状态
  const hydrated = ref(false)
  const isHydrated = computed(() => hydrated.value)
  const setHydrate = () => {
    hydrated.value = true
  }

  // 渲染错误
  const error = ref<AppErrorValue>(config.error ?? null)
  const setError = (value: unknown) => {
    error.value = value == null ? null : formatErrorToAppError(value, { code: 500, message: '未知错误' })
  }

  // 全局 UI 开关
  const switcher = {
    searchVisible: ref(false),
    drawerVisible: ref(false)
  }

  return {
    isHydrated,
    setHydrate,
    error,
    setError,
    switcher
  }
}

export const createGlobalState = (config: GlobalStateConfig): GlobalState & Plugin => {
  const state = createGlobalStateInstance(config)
  return {
    ...state,
    install(app: App) {
      app.provide(GlobalStateSymbol, state)
    }
  }
}

export const useGlobalState = (): GlobalState => {
  return inject<GlobalState>(GlobalStateSymbol)!
}
