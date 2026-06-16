<template>
  <ClientOnly>
    <div ref="containerRef"></div>
  </ClientOnly>
</template>

<script setup lang="ts">
// APlayer 依赖 window/document，仅客户端初始化
const containerRef = ref<HTMLElement>()
let aplayer: any = null

const { staticUrl } = useStaticUrl()

// 歌单改由后台维护：SSR 预取 /api/music，去重共享，失败降级为空歌单。
// 不在此处 await，避免布局子组件因顶层 await 触发 Suspense 边界问题；
// Nuxt 会在 SSR 序列化前自动等待 useAsyncData 完成，客户端 onMounted 时已有数据。
const api = useBlogApi()
const { data: songs } = useAsyncData('songs', () => api.getSongs(), { default: () => [] })

onMounted(async () => {
  if (!songs.value.length) return

  const { default: APlayer } = await import('aplayer')
  await import('aplayer/dist/APlayer.min.css')

  // 音乐资源仅存相对路径，运行时拼接 staticPath
  const audio = songs.value.map((song) => ({
    artist: song.artist,
    name: song.name,
    url: staticUrl(song.url),
    cover: staticUrl(song.cover)
  }))

  aplayer = new APlayer({
    container: containerRef.value,
    fixed: true,
    theme: '#2821fc',
    audio
  })
})

onBeforeUnmount(() => {
  aplayer?.destroy()
  aplayer = null
})
</script>

<style>
/*
 * APlayer fixed 模式默认 z-index:99，会盖住本站统一用 z-50 的浮层
 * （站点头部、对话框、抽屉、AI 助手），在移动端尤为明显。
 * 将持久型迷你播放器下调到「内容之上、浮层之下」，使模态类 UI 始终位于其上。
 * 用 !important 是因为 APlayer 的 CSS 在 onMounted 时动态注入、可能晚于本组件样式。
 */
.aplayer.aplayer-fixed,
.aplayer.aplayer-fixed .aplayer-body {
  z-index: 30 !important;
}
.aplayer.aplayer-fixed .aplayer-list {
  z-index: 30 !important;
}
.aplayer.aplayer-fixed .aplayer-lrc {
  z-index: 29 !important;
}
</style>
