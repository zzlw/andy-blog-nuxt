<template>
  <div class="error-panel module">
    <h1 class="code">{{ error.code }}</h1>
    <p class="message">{{ error.message }}</p>
    <router-link to="/" class="home-link">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
import type { AppError } from '/@/app/error'

defineProps<{ error: AppError }>()
</script>

<style lang="scss" scoped>
.error-panel {
  padding: 4rem 2rem;
  text-align: center;

  .code {
    font-size: 4rem;
    color: var(--color-text-darker);
  }

  .message {
    margin: 1rem 0 2rem;
    color: var(--color-text-secondary);
  }

  .home-link {
    display: inline-block;
    padding: 0.5em 1.5em;
    border-radius: $radius;
    color: var(--color-text-reversal);
    background-color: var(--color-primary);

    &:hover {
      background-color: var(--color-primary-lighter);
    }
  }
}
</style>
