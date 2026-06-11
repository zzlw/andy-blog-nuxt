# syntax=docker/dockerfile:1

# ---------- 基础层 ----------
FROM node:22-slim AS base
WORKDIR /app
COPY package.json package-lock.json* ./

# ---------- 开发层：vite middleware 热更新（docker-compose dev 使用 target: dev） ----------
FROM base AS dev
ENV NODE_ENV=development
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---------- 构建层：三步构建产出 dist/（bff.js + client/ + server/ssr.js） ----------
FROM base AS builder
RUN npm install
COPY . .
# 运行时配置经环境变量注入（SSR 时写入 window.__INITIAL_SSR_STATE__），构建期不依赖任何环境变量
RUN npm run build && npm prune --omit=dev

# ---------- 运行层：仅保留运行所需文件 ----------
FROM node:22-slim AS runner
ENV NODE_ENV=production \
    PORT=3000
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

USER node

EXPOSE 3000
CMD ["node", "dist/bff.js"]
