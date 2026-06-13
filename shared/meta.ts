/**
 * @file 站点元信息（app 与 server 共用）
 */

export const APP_META = {
  title: '夏季指南',
  author: 'Gavin',
  /** 标题模板：%s | Gavin */
  titleSuffix: 'Gavin',
  description: '前端开发工程师 Gavin 的个人博客：JavaScript / Vue / React / Node.js',
  keywords: '前端,JavaScript,博客,Node,Vue,React',
  email: 'zzlwte@gmail.com',
  url: 'https://jiawen.live',
  /** GitHub 主页 */
  github: 'https://github.com/zzlw',
  /** 工信部 ICP 备案号（要求展示在全站底部并链接到备案管理系统） */
  icp: '豫ICP备2022002177号-1'
} as const

export const pageTitle = (title?: string) => {
  return title ? `${title} | ${APP_META.titleSuffix}` : `${APP_META.title} | ${APP_META.titleSuffix}`
}
