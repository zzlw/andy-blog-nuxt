<template>
  <header class="fixed inset-x-0 top-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur-md">
    <div class="mx-auto flex h-full max-w-6xl items-center px-4 sm:px-6">
      <!-- 窄屏抽屉导航 -->
      <Sheet v-model:open="drawerOpen">
        <SheetTrigger as-child>
          <Button variant="ghost" size="icon" :aria-label="t('header.menu')" class="mr-1 md:hidden">
            <Menu class="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" class="w-72 gap-0">
          <SheetHeader>
            <SheetTitle class="text-left">{{ t('site.title') }}</SheetTitle>
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
              {{ t(item.key) }}
            </NuxtLink>
          </nav>
          <template v-if="categories.length">
            <Separator class="my-4" />
            <p class="px-7 pb-2 text-xs font-medium tracking-wider text-muted-foreground">{{ t('common.category') }}</p>
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

      <NuxtLink
        to="/"
        class="flex items-center gap-2 font-display text-lg font-bold tracking-tight transition-colors duration-200 hover:text-primary"
      >
        <img
          :src="APP_META.shareIcon"
          :alt="t('site.title')"
          width="400"
          height="400"
          class="size-8 rounded-md"
        />
        {{ t('site.title') }}
      </NuxtLink>

      <nav class="ml-8 hidden items-center gap-1 md:flex">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-foreground"
          :class="isActive(item.path) ? 'font-medium text-primary' : 'text-muted-foreground'"
        >
          {{ t(item.key) }}
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" :aria-label="t('header.search')" @click="searchOpen = true">
          <Search class="size-5" />
        </Button>
        <Button as-child variant="ghost" size="icon" aria-label="GitHub">
          <a :href="APP_META.github" target="_blank" rel="noopener noreferrer">
            <Github class="size-5" />
          </a>
        </Button>
        <LanguageSwitcher />
        <ClientOnly>
          <Button
            variant="ghost"
            size="icon"
            :aria-label="isDark ? t('header.toLight') : t('header.toDark')"
            @click="toggleTheme"
          >
            <Sun v-if="isDark" class="size-5" />
            <Moon v-else class="size-5" />
          </Button>
          <template #fallback>
            <Button variant="ghost" size="icon" :aria-label="t('header.toggleTheme')">
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
import { Menu, Search, Sun, Moon, Github } from 'lucide-vue-next'
import { APP_META } from '#shared/meta'

const { t } = useI18n()

const navItems = [
  { path: '/', key: 'nav.home' },
  { path: '/archive', key: 'nav.archive' },
  { path: '/guestbook', key: 'nav.guestbook' },
  { path: '/about', key: 'nav.about' }
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
