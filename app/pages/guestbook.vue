<template>
  <PageShell>
    <div class="flex flex-col gap-8">
      <header>
        <h1 class="text-2xl font-bold">留言板</h1>
        <p class="mt-2 text-sm text-muted-foreground">说点什么吧，匿名也可以</p>
      </header>

      <form class="flex flex-col gap-3" @submit.prevent="submit">
        <Input v-model="form.nickname" placeholder="昵称（可选）" class="sm:max-w-60" />
        <Textarea v-model="form.content" placeholder="留言内容…" rows="4" required />
        <div class="text-right">
          <Button type="submit" :disabled="submitting || !form.content.trim()">
            {{ submitting ? '提交中…' : '留言' }}
          </Button>
        </div>
      </form>

      <div v-if="messages.length" class="flex flex-col divide-y divide-border">
        <div v-for="message in messages" :key="message.id" class="flex gap-3 py-5 first:pt-0">
          <div
            class="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary"
          >
            {{ (message.nickname || '匿').slice(0, 1).toUpperCase() }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="flex flex-wrap items-center gap-x-2 text-sm">
              <span class="font-medium">{{ message.nickname || '匿名' }}</span>
              <time class="text-xs text-muted-foreground">{{ dateTimeFormat(message.created_at) }}</time>
            </p>
            <p class="mt-1.5 text-sm leading-relaxed break-words whitespace-pre-wrap">{{ message.content }}</p>
          </div>
        </div>
      </div>
      <p v-else class="py-10 text-center text-sm text-muted-foreground">还没有留言</p>

      <div v-if="hasMore" class="text-center">
        <Button variant="outline" :disabled="loadingMore" @click="loadMore">
          {{ loadingMore ? '加载中…' : '加载更多' }}
        </Button>
      </div>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import type { Message, Pagination } from '#shared/types'

const PAGE_SIZE = 20

const api = useBlogApi()
const identity = useIdentity()

const { data, refresh } = await useAsyncData('guestbook', () =>
  api.getMessages({ page: 1, page_size: PAGE_SIZE })
)

const extraMessages = ref<Message[]>([])
const lastPagination = ref<Pagination | null>(null)
const messages = computed<Message[]>(() => [...(data.value?.data ?? []), ...extraMessages.value])
const pagination = computed(() => lastPagination.value ?? data.value?.pagination ?? null)
const hasMore = computed(() => {
  const p = pagination.value
  return !!p && p.page < p.total_page
})

const loadingMore = ref(false)
const loadMore = async () => {
  const p = pagination.value
  if (!p || loadingMore.value) return
  loadingMore.value = true
  try {
    const result = await api.getMessages({ page: p.page + 1, page_size: PAGE_SIZE })
    extraMessages.value.push(...result.data)
    lastPagination.value = result.pagination
  } finally {
    loadingMore.value = false
  }
}

const form = reactive({ nickname: '', content: '' })
watch(
  identity.guestProfile,
  (profile) => {
    if (!form.nickname) form.nickname = profile.nickname
  },
  { immediate: true }
)

const submitting = ref(false)
const submit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    await api.createMessage({
      nickname: form.nickname.trim() || undefined,
      content: form.content.trim()
    })
    form.content = ''
    extraMessages.value = []
    lastPagination.value = null
    await refresh()
  } finally {
    submitting.value = false
  }
}

useSeoMeta({ title: '留言板' })
</script>
