## andy-blog-nuxt (https://jiawen.live)

![GitHub action](https://github.com/zzlw/andy-blog-nuxt/workflows/docker%20image%20build%20and%20push/badge.svg)
[![GitHub issues](http://img.shields.io/github/issues/zzlw/andy-blog-nuxt.svg)](http://github.com/zzlw/andy-blog-nuxt/issues)
[![GitHub forks](http://img.shields.io/github/forks/zzlw/andy-blog-nuxt.svg)](http://github.com/zzlw/andy-blog-nuxt/network)
[![GitHub stars](http://img.shields.io/github/stars/zzlw/andy-blog-nuxt.svg)](http://github.com/zzlw/andy-blog-nuxt/stargazers)
[![GitHub license](https://img.shields.io/github/license/zzlw/andy-blog-nuxt.svg)](http://github.com/zzlw/andy-blog-nuxt/blob/master/LICENSE)

- 适配多分辨率
- 支持白昼黑夜主题切换
- 文章图片懒加载
- 评论、留言、搜索、点赞、多个作者
- SSR服务端渲染

该项目为前端展示部分，其它部分可点击下面的链接

- 展示前端 [andy-blog-nuxt](https://github.com/zzlw/andy-blog-nuxt)
- 管理后台 [andy-blog-admin](https://github.com/zzlw/andy-blog-admin)
- 服务端 [andy-blog-koa](https://github.com/zzlw/andy-blog-koa)

## Setup

该项目使用 RESTful API，要启动该项目要先启动服务端 [andy-blog-koa](https://github.com/zzlw/andy-blog-koa)

```bash
# install
npm install

# development
npm run dev

# production 
npm run build
npm start

# use pm2
npm run build
pm2 start npm --name nuxt -- start

# docker
docker container run -d --name andy-blog-nuxt -p 80:4000 zzlwte/andy-blog-nuxt
```
