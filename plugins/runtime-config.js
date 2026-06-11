import Config from '@/config'

/**
 * 运行时配置注入：
 * - 服务端：读取容器环境变量（API_BASE_URL_INTERNAL，走 Docker 内网，如 http://api:3000）
 * - 客户端：读取 publicRuntimeConfig（API_BASE_URL，浏览器可达地址）
 * publicRuntimeConfig 会被序列化进 __NUXT__ payload，因此构建产物与环境彻底解耦
 */
export default ({ $config }) => {
  if ($config.apiBaseUrl) {
    Config.baseUrl = $config.apiBaseUrl
  }
  if ($config.staticPath) {
    Config.staticPath = $config.staticPath
  }
}
