<template>
  <footer class="border-t border-border py-6 text-center text-sm text-muted-foreground">
    <p class="flex items-center justify-center gap-3">
      <span>© {{ year }} {{ APP_META.author }}</span>
      <span class="text-border">|</span>
      <a href="/rss.xml" target="_blank" class="transition-colors hover:text-primary">RSS</a>
      <span class="text-border">|</span>
      <a href="/sitemap.xml" target="_blank" class="transition-colors hover:text-primary">Sitemap</a>
    </p>
  </footer>
</template>

<script setup lang="ts">
import { APP_META } from '#shared/meta'

const year = new Date().getFullYear()
</script>
