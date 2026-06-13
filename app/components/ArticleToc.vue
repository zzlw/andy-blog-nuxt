<template>
  <div v-if="toc.length" class="flex flex-col gap-8">
    <section>
      <h3 class="mb-4 font-display text-sm font-bold tracking-tight">目录</h3>
      <nav class="flex max-h-[60vh] flex-col gap-0.5 overflow-y-auto text-sm">
        <a
          v-for="item in toc"
          :key="item.id"
          :href="`#${item.id}`"
          class="rounded-md py-1.5 pr-2 transition-colors hover:text-primary"
          :class="[
            item.level === 2 ? 'pl-2' : item.level === 3 ? 'pl-6' : 'pl-10',
            activeId === item.id ? 'font-medium text-primary' : 'text-muted-foreground'
          ]"
          @click.prevent="scrollToHeading(item.id)"
        >
          {{ item.text }}
        </a>
      </nav>
    </section>
  </div>
  <SidebarDefault v-else />
</template>

<script setup lang="ts">
import type { TocItem } from '~/utils/markdown'

const props = defineProps<{ toc: TocItem[] }>()

const activeId = ref('')

// 全局已移除 CSS 平滑滚动，这里用 JS 平滑滚动到锚点（留出顶部导航高度）
const scrollToHeading = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 72
  window.scrollTo({ top, behavior: 'smooth' })
  history.replaceState(history.state, '', `#${id}`)
}
let observer: IntersectionObserver | null = null

const observe = () => {
  observer?.disconnect()
  if (!props.toc.length) return
  // 取视口上半部分最先出现的标题作为当前章节
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
          break
        }
      }
    },
    { rootMargin: '-56px 0px -70% 0px', threshold: 0 }
  )
  for (const item of props.toc) {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  }
}

onMounted(observe)
watch(() => props.toc, () => nextTick(observe))
onBeforeUnmount(() => observer?.disconnect())
</script>
