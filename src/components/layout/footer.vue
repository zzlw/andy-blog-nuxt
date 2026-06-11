<template>
  <footer class="app-footer">
    <p>
      <span>© {{ year }} {{ APP_META.author }}</span>
      <span class="divider">|</span>
      <a href="/rss.xml" target="_blank">RSS</a>
      <span class="divider">|</span>
      <a href="/sitemap.xml" target="_blank">Sitemap</a>
    </p>
  </footer>
</template>

<script setup lang="ts">
import { APP_META } from '/@/configs/app.config'

const year = new Date().getFullYear()
</script>

<style lang="scss" scoped>
.app-footer {
  padding: $gap-lg 0;
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-text-secondary);

  a:hover {
    color: var(--color-primary);
  }

  .divider {
    margin: 0 0.6em;
    color: var(--color-text-divider);
  }
}
</style>
