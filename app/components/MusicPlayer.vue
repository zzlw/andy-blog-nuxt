<template>
  <ClientOnly>
    <div ref="containerRef"></div>
  </ClientOnly>
</template>

<script setup lang="ts">
import songs from '~/configs/music-list'

// APlayer 依赖 window/document，仅客户端初始化
const containerRef = ref<HTMLElement>()
let aplayer: any = null

const { staticUrl } = useStaticUrl()

onMounted(async () => {
  const { default: APlayer } = await import('aplayer')
  await import('aplayer/dist/APlayer.min.css')

  // 音乐资源仅存相对路径，运行时拼接 staticPath
  const audio = songs.map((song) => ({
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
