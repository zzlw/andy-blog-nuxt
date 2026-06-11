<template>
  <Dialog v-model:open="open">
    <DialogContent class="top-[30%] sm:max-w-md">
      <DialogHeader>
        <DialogTitle>搜索文章</DialogTitle>
        <DialogDescription>输入关键词，回车搜索</DialogDescription>
      </DialogHeader>
      <form class="flex items-center gap-2" @submit.prevent="submit">
        <Input v-model="keyword" placeholder="关键词…" autofocus />
        <Button type="submit" :disabled="!keyword.trim()">
          <Search class="size-4" />
        </Button>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const open = defineModel<boolean>('open', { default: false })
const keyword = ref('')
const router = useRouter()

const submit = () => {
  const value = keyword.value.trim()
  if (!value) return
  open.value = false
  keyword.value = ''
  router.push(`/search/${encodeURIComponent(value)}`)
}
</script>
