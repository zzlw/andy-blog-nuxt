export default defineI18nConfig(() => ({
  legacy: false,
  // 英文/繁体缺词时回退到简体中文
  fallbackLocale: 'zh-Hans',
  fallbackWarn: false,
  missingWarn: false
}))
