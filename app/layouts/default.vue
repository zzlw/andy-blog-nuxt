<template>
  <div class="flex min-h-screen flex-col">
    <SiteHeader />
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 pt-22 pb-12 sm:px-6">
      <slot />
    </main>
    <SiteFooter />
    <MusicPlayer />
    <BackTop />
  </div>
</template>
