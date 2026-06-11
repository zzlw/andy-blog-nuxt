<template>
  <div ref="containerRef" class="aplayer-host"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import songs from '/@/configs/music-list'
import { resolveStaticUrl } from '/@/transforms/url'

// APlayer 仅客户端运行（依赖 window/document），SSR 跳过
const containerRef = ref<HTMLElement>()
let aplayer: any = null

onMounted(async () => {
  const { default: APlayer } = await import('aplayer')
  await import('aplayer/dist/APlayer.min.css')

  // 音乐资源仅存相对路径，运行时拼接 STATIC_PATH（沿用旧播放器逻辑）
  const audio = songs.map((song) => ({
    artist: song.artist,
    name: song.name,
    url: resolveStaticUrl(song.url),
    cover: resolveStaticUrl(song.cover)
  }))

  aplayer = new APlayer({
    container: containerRef.value,
    fixed: true,
    theme: '#e9e9e9',
    audio
  })
})

onBeforeUnmount(() => {
  aplayer?.destroy()
  aplayer = null
})
</script>

<style lang="scss">
// APlayer 固定吸底栏的暗色适配
[data-theme='dark'] .aplayer {
  background: var(--module-bg-opaque);
  color: var(--color-text);

  .aplayer-info .aplayer-music .aplayer-title,
  .aplayer-info .aplayer-music .aplayer-author,
  .aplayer-list ol li .aplayer-list-index,
  .aplayer-list ol li .aplayer-list-author {
    color: var(--color-text);
  }

  .aplayer-list ol li {
    border-color: var(--color-text-divider);

    &:hover {
      background: var(--module-bg-darker-1);
    }

    &.aplayer-list-light {
      background: var(--module-bg-darker-2);
    }
  }

  .aplayer-miniswitcher {
    background: var(--module-bg-darker-2);
  }
}
</style>
