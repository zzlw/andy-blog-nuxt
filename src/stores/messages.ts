/**
 * @file 留言板
 */

import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'
import { blogApi } from '/@/services/api'
import type { Message, Pagination } from '/@/interfaces'

export const useMessagesStore = defineStore('messages', () => {
  const fetching = ref(false)
  const posting = ref(false)
  const messages = shallowRef<Message[]>([])
  const pagination = shallowRef<Pagination | null>(null)

  const hasMore = computed(() => {
    return pagination.value ? pagination.value.page < pagination.value.total_page : false
  })

  const fetch = async () => {
    fetching.value = true
    try {
      const result = await blogApi.getMessages({ page: 1, page_size: 20 })
      messages.value = result.data
      pagination.value = result.pagination
    } finally {
      fetching.value = false
    }
  }

  const fetchMore = async () => {
    if (fetching.value || !hasMore.value) return
    fetching.value = true
    try {
      const nextPage = (pagination.value?.page ?? 1) + 1
      const result = await blogApi.getMessages({ page: nextPage, page_size: 20 })
      messages.value = [...messages.value, ...result.data]
      pagination.value = result.pagination
    } finally {
      fetching.value = false
    }
  }

  const post = async (payload: { nickname?: string; content: string }) => {
    posting.value = true
    try {
      await blogApi.createMessage(payload)
      await fetch()
    } finally {
      posting.value = false
    }
  }

  return { fetching, posting, messages, pagination, hasMore, fetch, fetchMore, post }
})
