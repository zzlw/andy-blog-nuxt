/**
 * @file 通用 fetch store 封装（对齐 surmon.me createFetchStore）
 */

import { Ref, ref, shallowRef } from 'vue'

export interface FetchStoreOptions<Data> {
  data: Data
  fetcher(...args: any[]): Promise<Data>
  once?: boolean
  preclean?: boolean
  shallow?: boolean
}

export const createFetchStore = <Data>(options: FetchStoreOptions<Data>) => {
  const refWrapper = (options.shallow ?? true) ? shallowRef : ref
  const fetching = ref(false)
  const fetched = ref(false)
  const data: Ref<Data> = refWrapper<Data>(options.data) as any

  const fetch = async (...args: any[]) => {
    if (options.once && fetched.value) return
    fetching.value = true
    if (options.preclean) {
      data.value = options.data
    }
    try {
      data.value = await options.fetcher(...args)
      fetched.value = true
    } finally {
      fetching.value = false
    }
  }

  return { data, fetching, fetched, fetch }
}
