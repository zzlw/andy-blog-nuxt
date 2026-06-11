# syntax=docker/dockerfile:1

# ---------- 基础层 ----------
# 样式编译已迁移到 dart-sass（纯 JS 实现），无原生模块编译负担，amd64/arm64 通用
FROM node:14-slim AS base
WORKDIR /app
COPY package.json package-lock.json* ./

# ---------- 开发层：热重载（docker-compose dev 使用 target: dev） ----------
FROM base AS dev
ENV NODE_ENV=development
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---------- 构建层：产出 .nuxt 构建产物 ----------
FROM base AS builder
RUN npm install
COPY . .
# 运行时配置通过 publicRuntimeConfig 注入，构建期不依赖任何环境变量
RUN npm run build

# ---------- 运行层：仅保留运行所需文件 ----------
FROM node:14-slim AS runner
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.nuxt ./.nuxt
COPY --from=builder /app/static ./static
COPY --from=builder /app/server ./server
COPY --from=builder /app/config ./config
COPY --from=builder /app/package.json /app/nuxt.config.js ./

USER node

EXPOSE 3000
CMD ["node", "server/index.js"]
