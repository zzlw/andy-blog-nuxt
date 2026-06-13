# syntax=docker/dockerfile:1

# ---------- 基础层 ----------
FROM node:22-slim AS base
WORKDIR /app
RUN npm install -g pnpm@11.1.3
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# ---------- 开发层：nuxt dev 热更新（docker-compose dev 使用 target: dev） ----------
FROM base AS dev
ENV NODE_ENV=development
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---------- 构建层：nuxt build 产出自包含的 .output/ ----------
FROM base AS builder
RUN pnpm install --frozen-lockfile
COPY . .
# 运行时配置经 NUXT_* 环境变量注入（runtimeConfig），构建期不依赖任何环境变量
RUN pnpm run build

# ---------- 运行层：Nitro 产物自包含依赖，无需 node_modules ----------
FROM node:22-slim AS runner
ENV NODE_ENV=production \
    PORT=3000
WORKDIR /app

COPY --from=builder /app/.output ./.output

USER node

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
