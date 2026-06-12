<template>
  <NuxtLink
    :to="`/article/${article.id}`"
    class="group grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-10"
  >
    <div v-if="article.cover" class="overflow-hidden rounded-xl bg-muted lg:order-2 lg:col-span-5">
      <img
        :src="thumbnailUrl(article.cover, 400)"
        :alt="article.title"
        class="aspect-[4/3] size-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
      />
    </div>

    <div class="lg:order-1" :class="article.cover ? 'lg:col-span-7' : 'lg:col-span-12'">
      <p class="font-mono text-xs tracking-[0.18em] text-primary uppercase">精选</p>
      <h2
        class="mt-4 line-clamp-3 font-display text-3xl leading-[1.15] font-bold tracking-tight transition-colors duration-200 group-hover:text-primary sm:text-4xl"
      >
        {{ article.title }}
      </h2>
      <p class="mt-4 line-clamp-2 max-w-[60ch] leading-relaxed text-muted-foreground">
        {{ article.description }}
      </p>
      <p class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
        <time class="font-mono text-[13px]">{{ dateFormat(article.created_date) }}</time>
        <span v-if="article.category" class="inline-flex items-center gap-1.5">
          <Folder class="size-3.5" />{{ article.category.name }}
        </span>
        <span class="inline-flex items-center gap-1.5"><Eye class="size-3.5" />{{ article.views }}</span>
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { Folder, Eye } from 'lucide-vue-next'
import type { Article } from '#shared/types'

defineProps<{ article: Article }>()

const { thumbnailUrl } = useStaticUrl()
</script>
