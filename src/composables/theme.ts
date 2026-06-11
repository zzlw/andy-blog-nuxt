/**
 * @file 主题（light/dark，data-theme + localStorage）
 */

import { App, Plugin, inject, ref, computed } from 'vue'
import { isClient } from '/@/configs/app.env'

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

const THEME_STORAGE_KEY = 'theme'
const ThemeSymbol = Symbol('theme')

export type ThemeContext = ReturnType<typeof createThemeInstance>

const createThemeInstance = (initTheme: Theme) => {
  const theme = ref<Theme>(initTheme)
  const isDark = computed(() => theme.value === Theme.Dark)

  const set = (value: Theme) => {
    theme.value = value
    if (isClient) {
      document.documentElement.dataset.theme = value
      localStorage.setItem(THEME_STORAGE_KEY, value)
    }
  }

  const toggle = () => set(isDark.value ? Theme.Light : Theme.Dark)

  return { theme, isDark, set, toggle }
}

export const createTheme = (initTheme: Theme): ThemeContext & Plugin => {
  const instance = createThemeInstance(initTheme)
  return {
    ...instance,
    install(app: App) {
      app.provide(ThemeSymbol, instance)
    }
  }
}

export const useTheme = (): ThemeContext => {
  return inject<ThemeContext>(ThemeSymbol)!
}
