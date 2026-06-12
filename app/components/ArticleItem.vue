<template>
  <article class="group">
    <NuxtLink :to="`/article/${article.id}`" class="flex items-start gap-6 py-7">
      <div class="min-w-0 flex-1">
        <h2
          class="line-clamp-2 font-display text-lg leading-snug font-bold tracking-tight transition-colors duration-200 group-hover:text-primary sm:text-xl"
        >
          {{ article.title }}
        </h2>
        <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {{ article.description }}
        </p>
        <p class="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
          <time class="font-mono text-[12px]">{{ dateFormat(article.created_date) }}</time>
          <span v-if="article.category" class="inline-flex items-center gap-1.5">
            <Folder class="size-3.5" />{{ article.category.name }}
          </span>
          <span class="inline-flex items-center gap-1.5"><Eye class="size-3.5" />{{ article.views }}</span>
          <span class="inline-flex items-center gap-1.5"><Heart class="size-3.5" />{{ article.like }}</span>
        </p>
      </div>
      <div
        v-if="article.cover"
        class="hidden h-26 w-40 shrink-0 overflow-hidden rounded-lg bg-muted sm:block"
      >
        <img
          :src="thumbnailUrl(article.cover, 400)"
          :alt="article.title"
          loading="lazy"
          class="size-full object-cover transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
        />
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import { Folder, Eye, Heart } from 'lucide-vue-next'
import type { Article } from '#shared/types'

defineProps<{ article: Article }>()

const { thumbnailUrl } = useStaticUrl()
</script>
