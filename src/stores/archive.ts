/**
 * @file 归档（按年份分组）
 */

import { defineStore } from 'pinia'
import { blogApi } from '/@/services/api'
import type { ArchiveYear } from '/@/interfaces'
import { createFetchStore } from './_fetch'

export const useArchiveStore = defineStore('archive', () => {
  return createFetchStore<ArchiveYear[]>({
    data: [],
    fetcher: () => blogApi.getArchive()
  })
})
