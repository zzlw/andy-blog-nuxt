/**
 * @file 全站复用的基础数据（分类/标签/最新文章），useAsyncData 按 key 去重共享
 */

export const useCategoriesData = () => {
  const api = useBlogApi()
  return useAsyncData('categories', () => api.getCategories(), { default: () => [] })
}

export const useTagsData = () => {
  const api = useBlogApi()
  return useAsyncData('tags', () => api.getTags(), { default: () => [] })
}

export const useLatestArticlesData = () => {
  const api = useBlogApi()
  return useAsyncData(
    'latest-articles',
    () => api.getArticles({ page: 1, page_size: 6 }).then((result) => result.data),
    { default: () => [] }
  )
}
