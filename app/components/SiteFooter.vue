<template>
  <footer class="border-t border-border py-6 text-center text-sm text-muted-foreground">
    <p class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
      <span>© {{ year }} {{ APP_META.author }}</span>
      <span class="text-border">|</span>
      <a
        :href="APP_META.github"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 transition-colors hover:text-primary"
      >
        <Github class="size-4" />GitHub
      </a>
      <span class="text-border">|</span>
      <a href="/rss.xml" target="_blank" class="transition-colors hover:text-primary">RSS</a>
      <span class="text-border">|</span>
      <a href="/sitemap.xml" target="_blank" class="transition-colors hover:text-primary">Sitemap</a>
      <span class="text-border">|</span>
      <a
        href="https://beian.miit.gov.cn"
        target="_blank"
        rel="noopener noreferrer"
        class="transition-colors hover:text-primary"
      >
        {{ APP_META.icp }}
      </a>
    </p>
  </footer>
</template>

<script setup lang="ts">
import { Github } from 'lucide-vue-next'
import { APP_META } from '#shared/meta'

const year = new Date().getFullYear()
</script>
