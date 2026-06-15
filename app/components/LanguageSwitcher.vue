<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" :aria-label="t('header.language')">
        <Languages class="size-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="min-w-36">
      <DropdownMenuItem
        v-for="item in locales"
        :key="item.code"
        class="cursor-pointer"
        :class="item.code === locale ? 'font-medium text-primary' : ''"
        @click="switchTo(item.code)"
      >
        {{ item.name }}
        <Check v-if="item.code === locale" class="ml-auto size-4" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Languages, Check } from 'lucide-vue-next'
import type { Locale } from 'vue-i18n'

const { t, locale, locales, setLocale } = useI18n()

const switchTo = (code: Locale) => {
  if (code !== locale.value) setLocale(code)
}
</script>
