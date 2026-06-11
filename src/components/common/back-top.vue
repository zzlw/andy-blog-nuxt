<template>
  <transition name="backtop-fade">
    <button v-if="visible" class="back-top" title="回到顶部" @click="scrollToTop">↑</button>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { isClient } from '/@/configs/app.env'

const visible = ref(false)

const onScroll = () => {
  visible.value = window.scrollY > 600
}

onMounted(() => {
  if (isClient) window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  if (isClient) window.removeEventListener('scroll', onScroll)
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
.back-top {
  position: fixed;
  right: 1.5rem;
  bottom: 2rem;
  z-index: 99;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  font-size: 1.2rem;
  color: var(--color-text);
  background-color: var(--module-bg-opaque);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;

  &:hover {
    color: var(--color-text-reversal);
    background-color: var(--color-primary);
  }
}

.backtop-fade-enter-active,
.backtop-fade-leave-active {
  transition: opacity 0.25s;
}
.backtop-fade-enter-from,
.backtop-fade-leave-to {
  opacity: 0;
}
</style>
