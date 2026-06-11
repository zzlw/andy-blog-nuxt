<template>
  <article class="group">
    <NuxtLink :to="`/article/${article.id}`" class="flex items-start gap-5 py-5">
      <div class="min-w-0 flex-1">
        <h2 class="line-clamp-2 text-base font-bold transition-colors group-hover:text-primary sm:text-lg">
          {{ article.title }}
        </h2>
        <p class="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{{ article.description }}</p>
        <p class="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <time class="inline-flex items-center gap-1">
            <Calendar class="size-3.5" />{{ dateFormat(article.created_date) }}
          </time>
          <span v-if="article.category" class="inline-flex items-center gap-1">
            <Folder class="size-3.5" />{{ article.category.name }}
          </span>
          <span class="inline-flex items-center gap-1"><Eye class="size-3.5" />{{ article.views }}</span>
          <span class="inline-flex items-center gap-1"><Heart class="size-3.5" />{{ article.like }}</span>
        </p>
      </div>
      <div
        v-if="article.cover"
        class="hidden h-24 w-36 shrink-0 overflow-hidden rounded-lg bg-muted sm:block"
      >
        <img
          :src="thumbnailUrl(article.cover, 400)"
          :alt="article.title"
          loading="lazy"
          class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import { Calendar, Folder, Eye, Heart } from 'lucide-vue-next'
import type { Article } from '#shared/types'

defineProps<{ article: Article }>()

const { thumbnailUrl } = useStaticUrl()
</script>
