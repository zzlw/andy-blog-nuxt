# andy-blog-web

Gavin 的博客前端：**Vue 3 + Vite 自研 SSR + BFF 单进程**（架构对齐 [surmon.me](https://github.com/surmon-china/surmon.me)）。

> 仓库名仍为 `andy-blog-nuxt`（历史原因），实际已不再使用 Nuxt。

## 技术栈

- Vue 3.5 / Vite / vue-router / Pinia / @unhead/vue
- 自研 SSR：`renderToString` + 同构数据预取（`onServerPrefetch` + SSR 状态注水）
- BFF：单 Node 进程 `dist/bff.js`，承载静态资源（sirv）、SSR 渲染、`/rss.xml`、`/sitemap.xml`
- SSR 页面缓存：Redis 优先（`REDIS_URI`），失败回退内存 LRU，按 `route.meta.ssrCacheTTL` 缓存
- 暗色模式：`data-theme` + localStorage + FOUC 防护内联脚本
- 样式：SCSS + CSS 变量主题体系，单套代码响应式布局

## 目录结构

```
src/
├── bff.ts              # BFF server 入口
├── client-entry.ts     # 浏览器入口
├── server-entry.ts     # SSR 渲染入口（renderApp / renderError + 页面缓存）
├── app/                # 应用工厂、router、全局状态、universal fetch/注水
├── pages/              # index / article / category / tag / archive / guestbook / about / search
├── components/         # layout / article / comment / music-player / common
├── stores/             # pinia stores（_fetch 通用封装）
├── services/api.ts     # axios 对接 NestJS API（{status,result} 解包）
├── composables/        # theme / device
├── server/             # BFF http 框架、renderer(dev/prod)、cache、rss/sitemap getters
├── styles/             # SCSS：normalize、变量、:root[data-theme] 主题
├── configs/ constants/ transforms/ interfaces/
bundler/                # 三步构建：bff.js → client → server/ssr.js
```

## 开发

```bash
npm install
npm run dev      # tsx watch src/bff.ts（vite middleware 模式，热更新）
```

推荐通过 `andy-blog-deploy` 的 `make dev` 启动完整环境（api/mongo/redis/web/admin）。

## 构建与运行

```bash
npm run build    # node bundler/index.js → dist/
npm run start    # node dist/bff.js
```

## 运行时环境变量

| 变量 | 说明 |
| --- | --- |
| `PORT` | BFF 监听端口，默认 3000 |
| `API_BASE_URL` | 浏览器可达的 API 地址（如 `https://api.jiawen.live`） |
| `API_BASE_URL_INTERNAL` | SSR 数据预取内网地址（如 `http://api:3000`） |
| `STATIC_PATH` | 静态资源域名（支持逗号分隔多个） |
| `REDIS_URI` | SSR 页面缓存 Redis 地址（可选，连不上回退 LRU） |

客户端配置经 SSR 注入 `window.__INITIAL_SSR_STATE__.appConfig`，构建产物多环境通用。
