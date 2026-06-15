<template>
  <Transition
    enter-active-class="transition duration-200"
    enter-from-class="opacity-0 translate-y-2"
    leave-active-class="transition duration-200"
    leave-to-class="opacity-0 translate-y-2"
  >
    <Button
      v-if="visible"
      variant="outline"
      size="icon"
      :aria-label="t('backTop')"
      class="fixed right-5 bottom-24 z-40 rounded-full shadow-md"
      @click="scrollToTop"
    >
      <ArrowUp class="size-5" />
    </Button>
  </Transition>
</template>

<script setup lang="ts">
import { ArrowUp } from 'lucide-vue-next'

const { t } = useI18n()

const visible = ref(false)

const onScroll = () => {
  visible.value = window.scrollY > 600
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>
