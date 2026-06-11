/**
 * @file 应用静态元信息（不含环境相关值，环境值见 app.runtime.ts）
 */

export const APP_META = {
  title: '冬季指南',
  author: 'Gavin',
  /** 标题模板：%s | Gavin */
  title_suffix: 'Gavin',
  description: '前端开发工程师 Gavin 的个人博客：JavaScript / Vue / React / Node.js',
  keywords: '前端,JavaScript,博客,Node,Vue,React',
  email: 'zzlwte@gmail.com',
  url: 'https://jiawen.live'
}

export const pageTitle = (title?: string) => {
  return title ? `${title} | ${APP_META.title_suffix}` : `${APP_META.title} | ${APP_META.title_suffix}`
}
