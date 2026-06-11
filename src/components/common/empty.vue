<template>
  <div class="empty">
    <span class="icon">∅</span>
    <p class="text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ text?: string }>(), { text: '暂无数据' })
</script>

<style lang="scss" scoped>
.empty {
  padding: 3rem 0;
  text-align: center;
  color: var(--color-text-disabled);

  .icon {
    font-size: 2rem;
  }

  .text {
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
