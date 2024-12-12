# 第一阶段（构建阶段）
FROM node:14-alpine as builder

WORKDIR /app

COPY . /app

# RUN npm i --registry=https://registry.npm.taobao.org
RUN npm i

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]