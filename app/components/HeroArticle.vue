<template>
  <!-- 有封面：整图沉浸式 Hero，渐变压暗保证文字对比度 -->
  <NuxtLink
    v-if="article.cover"
    :to="`/article/${article.id}`"
    class="group relative block overflow-hidden rounded-xl bg-muted"
  >
    <img
      :src="thumbnailUrl(article.cover, 800)"
      :alt="article.title"
      class="aspect-[16/9] size-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04] lg:aspect-[21/9]"
    />
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
      aria-hidden="true"
    ></div>
    <div class="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
      <p class="font-mono text-xs tracking-[0.18em] text-white/80 uppercase">精选</p>
      <h2
        class="mt-3 line-clamp-2 max-w-[24ch] font-display text-2xl leading-[1.15] font-bold tracking-tight text-white sm:text-3xl lg:text-4xl"
      >
        {{ article.title }}
      </h2>
      <p class="mt-3 line-clamp-2 hidden max-w-[56ch] leading-relaxed text-white/85 sm:block">
        {{ article.description }}
      </p>
      <p class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/75">
        <time class="font-mono text-[13px]">{{ dateFormat(article.created_date) }}</time>
        <span v-if="article.category" class="inline-flex items-center gap-1.5">
          <Folder class="size-3.5" />{{ article.category.name }}
        </span>
        <span class="inline-flex items-center gap-1.5"><Eye class="size-3.5" />{{ article.views }}</span>
      </p>
    </div>
  </NuxtLink>

  <!-- 无封面：纯文字排版 -->
  <NuxtLink v-else :to="`/article/${article.id}`" class="group block">
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
  </NuxtLink>
</template>

<script setup lang="ts">
import { Folder, Eye } from 'lucide-vue-next'
import type { Article } from '#shared/types'

defineProps<{ article: Article }>()

const { thumbnailUrl } = useStaticUrl()
</script>
