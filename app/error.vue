<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-foreground">
    <h1 class="text-7xl font-black tracking-tight text-primary">{{ error.statusCode }}</h1>
    <p class="text-lg text-muted-foreground">
      {{ error.statusCode === 404 ? '页面不存在或已被移除' : error.message || '服务出了点小问题' }}
    </p>
    <Button size="lg" @click="handleError">返回首页</Button>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

const handleError = () => clearError({ redirect: '/' })
</script>
