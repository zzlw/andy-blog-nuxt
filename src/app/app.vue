<template>
  <div class="app-root">
    <AppHeader />
    <main class="app-main">
      <div class="app-container">
        <ErrorPanel v-if="globalState.error.value" :error="globalState.error.value" />
        <router-view v-else />
      </div>
    </main>
    <AppFooter />
    <SearchOverlay />
    <MusicPlayer />
    <BackTop />
  </div>
</template>

<script setup lang="ts">
import { useGlobalState } from './state'
import AppHeader from '/@/components/layout/header.vue'
import AppFooter from '/@/components/layout/footer.vue'
import SearchOverlay from '/@/components/layout/search-overlay.vue'
import MusicPlayer from '/@/components/music-player/index.vue'
import BackTop from '/@/components/common/back-top.vue'
import ErrorPanel from '/@/components/common/error-panel.vue'

const globalState = useGlobalState()
</script>

<style lang="scss" scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding-top: calc(#{$navbar-height} + 2.5rem);
  padding-bottom: 3rem;
}

.app-container {
  width: 100%;
  max-width: $container-width;
  margin: 0 auto;
  padding: 0 $gap-lg;
}

@include mobile {
  .app-main {
    padding-top: calc(#{$navbar-height} + #{$gap-lg});
    padding-bottom: 2rem;
  }
}
</style>
