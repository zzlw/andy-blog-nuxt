/**
 * @file 全局元数据：分类 / 标签 / 作者 / 友链（布局侧栏与关于页使用）
 */

import { defineStore } from 'pinia'
import { blogApi } from '/@/services/api'
import type { Author, Category, Friend, Tag } from '/@/interfaces'
import { createFetchStore } from './_fetch'

export const useCategoriesStore = defineStore('categories', () => {
  return createFetchStore<Category[]>({
    data: [],
    once: true,
    fetcher: () => blogApi.getCategories()
  })
})

export const useTagsStore = defineStore('tags', () => {
  return createFetchStore<Tag[]>({
    data: [],
    once: true,
    fetcher: () => blogApi.getTags()
  })
})

export const useAuthorsStore = defineStore('authors', () => {
  return createFetchStore<Author[]>({
    data: [],
    once: true,
    fetcher: () => blogApi.getAuthors()
  })
})

export const useFriendsStore = defineStore('friends', () => {
  return createFetchStore<Friend[]>({
    data: [],
    once: true,
    fetcher: () => blogApi.getFriends()
  })
})
