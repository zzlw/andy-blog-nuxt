<template>
  <NuxtLink
    :to="`/article/${article.id}`"
    class="group relative block overflow-hidden rounded-xl border border-border"
  >
    <div class="relative aspect-[21/9] min-h-56 w-full overflow-hidden bg-muted">
      <img
        v-if="article.cover"
        :src="thumbnailUrl(article.cover, 1200)"
        :alt="article.title"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    </div>
    <div class="absolute inset-x-0 bottom-0 p-5 sm:p-7">
      <Badge class="mb-3 bg-primary text-primary-foreground">精选</Badge>
      <h2 class="line-clamp-2 text-xl font-bold text-white transition-colors group-hover:text-primary sm:text-2xl dark:group-hover:text-primary">
        {{ article.title }}
      </h2>
      <p class="mt-2 line-clamp-2 hidden text-sm text-white/75 sm:block">{{ article.description }}</p>
      <p class="mt-3 flex items-center gap-4 text-xs text-white/60">
        <span class="inline-flex items-center gap-1">
          <Calendar class="size-3.5" />{{ dateFormat(article.created_date) }}
        </span>
        <span v-if="article.category" class="inline-flex items-center gap-1">
          <Folder class="size-3.5" />{{ article.category.name }}
        </span>
        <span class="inline-flex items-center gap-1"><Eye class="size-3.5" />{{ article.views }}</span>
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { Calendar, Folder, Eye } from 'lucide-vue-next'
import type { Article } from '#shared/types'

defineProps<{ article: Article }>()

const { thumbnailUrl } = useStaticUrl()
</script>
