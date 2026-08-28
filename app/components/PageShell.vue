<template>
  <div class="flex items-start gap-8">
    <div class="min-w-0 flex-1">
      <slot />
    </div>
    <aside class="sticky top-18 hidden w-72 shrink-0 lg:block">
      <slot name="sidebar">
        <SidebarDefault />
      </slot>
    </aside>
  </div>
</template>
