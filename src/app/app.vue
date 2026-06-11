<template>
  <div class="app-root" :class="{ 'is-mobile': isMobile }">
    <AppHeader v-if="!isMobile" />
    <MobileHeader v-else />
    <main class="app-main">
      <div class="app-container">
        <div class="app-content">
          <ErrorPanel v-if="globalState.error.value" :error="globalState.error.value" />
          <router-view v-else />
        </div>
        <AppAside v-if="!isMobile" />
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
import { useDevice } from '/@/composables/device'
import AppHeader from '/@/components/layout/header.vue'
import MobileHeader from '/@/components/layout/mobile-header.vue'
import AppFooter from '/@/components/layout/footer.vue'
import AppAside from '/@/components/layout/aside.vue'
import SearchOverlay from '/@/components/layout/search-overlay.vue'
import MusicPlayer from '/@/components/music-player/index.vue'
import BackTop from '/@/components/common/back-top.vue'
import ErrorPanel from '/@/components/common/error-panel.vue'

const globalState = useGlobalState()
const { isMobile } = useDevice()
</script>

<style lang="scss" scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding-top: calc(#{$navbar-height} + #{$gap-lg});
  padding-bottom: $gap-lg;
}

.app-container {
  width: 100%;
  max-width: $container-width;
  margin: 0 auto;
  display: flex;
  gap: $gap-lg;
  padding: 0 $gap-lg;
}

.app-content {
  flex: 1;
  min-width: 0;
}

.is-mobile {
  .app-main {
    padding-top: calc(#{$navbar-height} + #{$gap-sm});
  }
  .app-container {
    padding: 0 $gap-sm;
  }
}
</style>
