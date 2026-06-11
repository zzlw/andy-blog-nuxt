// 域名/地址一律来自环境变量，禁止硬编码：
// - 真实值由 nuxt publicRuntimeConfig 在运行时注入（见 plugins/runtime-config.js）
// - 这里仅保留 process.env 兜底，便于非容器场景（如 npm run dev）从本地 .env 读取
// 这样同一份构建产物可以在 dev / staging / prod 多环境运行，无需重新构建
const Config = {
  baseUrl: process.env.API_BASE_URL || '',
  staticPath: process.env.STATIC_PATH || ''
}

// 取 STATIC_PATH 首个域名（支持逗号分隔多域名过渡），去掉尾部斜杠
const primaryStaticBase = () =>
  String(Config.staticPath || '').split(',')[0].trim().replace(/\/$/, '')

// 相对路径 → 绝对 URL；已是绝对地址 / 协议相对 / data: 则原样返回（幂等，兼容外链）
export const resolveStatic = (value) => {
  if (typeof value !== 'string' || !value) return value
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:')) return value
  const base = primaryStaticBase()
  if (!base) return value
  return value.charAt(0) === '/' ? `${base}${value}` : `${base}/${value}`
}

// 递归解析响应中的图片字段（cover / avatar），覆盖所有嵌套结构
export const resolveStaticDeep = (data) => {
  if (Array.isArray(data)) return data.map(resolveStaticDeep)
  if (data && typeof data === 'object') {
    const out = {}
    Object.keys(data).forEach((k) => {
      const v = data[k]
      out[k] = (k === 'cover' || k === 'avatar') && typeof v === 'string'
        ? resolveStatic(v)
        : resolveStaticDeep(v)
    })
    return out
  }
  return data
}

export default Config
