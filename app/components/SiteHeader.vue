<template>
  <header class="fixed inset-x-0 top-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur-md">
    <div class="mx-auto flex h-full max-w-6xl items-center px-4 sm:px-6">
      <!-- 窄屏抽屉导航 -->
      <Sheet v-model:open="drawerOpen">
        <SheetTrigger as-child>
          <Button variant="ghost" size="icon" aria-label="菜单" class="mr-1 md:hidden">
            <Menu class="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" class="w-72 gap-0">
          <SheetHeader>
            <SheetTitle class="text-left">{{ APP_META.title }}</SheetTitle>
          </SheetHeader>
          <nav class="flex flex-col gap-1 px-4">
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
              :class="isActive(item.path) ? 'font-medium text-primary' : 'text-foreground'"
              @click="drawerOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
          <template v-if="categories.length">
            <Separator class="my-4" />
            <p class="px-7 pb-2 text-xs font-medium tracking-wider text-muted-foreground">分类</p>
            <nav class="flex flex-col gap-1 px-4">
              <NuxtLink
                v-for="category in categories"
                :key="category.id"
                :to="`/category/${category.id}`"
                class="rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                @click="drawerOpen = false"
              >
                {{ category.name }}
              </NuxtLink>
            </nav>
          </template>
        </SheetContent>
      </Sheet>

      <NuxtLink to="/" class="text-lg font-bold tracking-wide transition-colors hover:text-primary">
        {{ APP_META.title }}
      </NuxtLink>

      <nav class="ml-8 hidden items-center gap-1 md:flex">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-foreground"
          :class="isActive(item.path) ? 'font-medium text-primary' : 'text-muted-foreground'"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="搜索" @click="searchOpen = true">
          <Search class="size-5" />
        </Button>
        <ClientOnly>
          <Button
            variant="ghost"
            size="icon"
            :aria-label="isDark ? '切换到亮色' : '切换到暗色'"
            @click="toggleTheme"
          >
            <Sun v-if="isDark" class="size-5" />
            <Moon v-else class="size-5" />
          </Button>
          <template #fallback>
            <Button variant="ghost" size="icon" aria-label="切换主题">
              <Sun class="size-5 opacity-0" />
            </Button>
          </template>
        </ClientOnly>
      </div>
    </div>
  </header>

  <SearchDialog v-model:open="searchOpen" />
</template>

<script setup lang="ts">
import { Menu, Search, Sun, Moon } from 'lucide-vue-next'
import { APP_META } from '#shared/meta'

const navItems = [
  { path: '/', label: '首页' },
  { path: '/archive', label: '归档' },
  { path: '/guestbook', label: '留言' },
  { path: '/about', label: '关于' }
]

const route = useRoute()
const isActive = (path: string) => (path === '/' ? route.path === '/' : route.path.startsWith(path))

const drawerOpen = ref(false)
const searchOpen = ref(false)

const { data: categories } = useCategoriesData()

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>
