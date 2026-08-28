<template>
  <div class="flex min-h-screen flex-col">
    <!--
      微信未认证服务号无法用 JS-SDK 自定义缩略图，会抓页面里第一张大于 300×300 的图。
      不能 display:none / 1px 隐藏，否则会被跳过。移出视口但仍保留真实尺寸。
    -->
    <img
      :src="APP_META.shareIcon"
      width="400"
      height="400"
      alt=""
      aria-hidden="true"
      class="pointer-events-none fixed top-0 -left-[9999px] -z-10 h-[400px] w-[400px] max-w-none"
    />
    <SiteHeader />
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 pt-28 pb-20 sm:px-6">
      <slot />
    </main>
    <SiteFooter />
    <MusicPlayer />
    <BackTop />
    <AiChatWidget />
  </div>
</template>

<script setup lang="ts">
import { APP_META } from '#shared/meta'
</script>
