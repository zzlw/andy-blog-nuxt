# 第一阶段（构建阶段）
FROM node:12-alpine as builder

WORKDIR /app

COPY . /app

RUN npm i --registry=https://registry.npm.taobao.org

RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]