<template>
  <transition name="search-fade">
    <div v-if="visible" class="search-overlay" @click.self="close">
      <div class="search-box">
        <input
          ref="inputRef"
          v-model="keyword"
          class="search-input"
          type="search"
          placeholder="搜索文章..."
          @keyup.enter="submit"
          @keyup.esc="close"
        />
        <button class="search-btn" @click="submit">搜索</button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalState } from '/@/app/state'

const globalState = useGlobalState()
const visible = globalState.switcher.searchVisible
const router = useRouter()
const keyword = ref('')
const inputRef = ref<HTMLInputElement>()

watch(visible, async (value) => {
  if (value) {
    keyword.value = ''
    await nextTick()
    inputRef.value?.focus()
  }
})

const close = () => {
  visible.value = false
}

const submit = () => {
  const value = keyword.value.trim()
  if (!value) return
  close()
  router.push(`/search/${encodeURIComponent(value)}`)
}
</script>

<style lang="scss" scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  justify-content: center;
  padding-top: 20vh;
  background-color: rgba(0, 0, 0, 0.5);
  @include backdrop-blur(5px);
}

.search-box {
  display: flex;
  width: min(560px, 86vw);
  height: 3.2rem;
  border-radius: $radius;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.search-input {
  flex: 1;
  padding: 0 1.2em;
  border: 0;
  outline: none;
  font-size: 1.1rem;
  background-color: var(--module-bg-opaque);
  color: var(--color-text);
}

.search-btn {
  padding: 0 1.5em;
  font-size: 1rem;
  color: var(--color-text-reversal);
  background-color: var(--color-primary);

  &:hover {
    background-color: var(--color-primary-lighter);
  }
}

.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.2s;
}
.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}
</style>
