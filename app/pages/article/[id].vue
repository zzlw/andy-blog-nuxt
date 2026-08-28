<template>
  <PageShell>
    <template #sidebar>
      <ArticleToc :toc="rendered.toc" />
    </template>

    <article v-if="article">
      <header>
        <h1 class="font-display text-3xl leading-[1.15] font-bold tracking-tight sm:text-4xl">{{ article.title }}</h1>
        <p class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <time class="inline-flex items-center gap-1.5 font-mono text-[13px]">
            <Calendar class="size-4" />{{ dateFormat(article.created_date) }}
          </time>
          <NuxtLink
            v-if="article.category"
            :to="`/category/${article.category.id}`"
            class="inline-flex items-center gap-1 transition-colors hover:text-primary"
          >
            <Folder class="size-4" />{{ article.category.name }}
          </NuxtLink>
          <span class="inline-flex items-center gap-1"><Eye class="size-4" />{{ t('article.views', { count: article.views }) }}</span>
          <span class="inline-flex items-center gap-1"><Clock class="size-4" />{{ t('article.readingTime', { minutes: readingMinutes }) }}</span>
        </p>
      </header>

      <div class="prose prose-zinc dark:prose-invert mt-8 max-w-none" v-html="rendered.html" />

      <div v-if="article.tags.length" class="mt-8 flex flex-wrap items-center gap-2">
        <NuxtLink v-for="tag in article.tags" :key="tag.id" :to="`/tag/${tag.id}`">
          <Badge variant="secondary" class="font-normal transition-colors hover:bg-primary hover:text-primary-foreground">
            # {{ tag.name }}
          </Badge>
        </NuxtLink>
      </div>

      <div class="mt-10 text-center">
        <Button :variant="liked ? 'default' : 'outline'" size="lg" :disabled="liked" @click="likeArticle">
          <Heart class="size-4" :class="{ 'fill-current': liked }" />
          {{ liked ? t('article.liked') : t('article.like') }} {{ likeCount }}
        </Button>
      </div>

      <template v-if="article.related?.length">
        <Separator class="my-10" />
        <section>
          <h3 class="mb-6 font-display text-xl font-bold tracking-tight">{{ t('article.related') }}</h3>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <NuxtLink
              v-for="item in article.related"
              :key="item.id"
              :to="`/article/${item.id}`"
              class="group overflow-hidden rounded-lg border border-border transition-colors hover:border-primary/50"
            >
              <div v-if="item.cover" class="aspect-[2/1] overflow-hidden bg-muted">
                <img
                  :src="thumbnailUrl(item.cover, 400)"
                  :alt="item.title"
                  loading="lazy"
                  class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div class="p-3">
                <p class="line-clamp-2 text-sm font-medium transition-colors group-hover:text-primary">
                  {{ item.title }}
                </p>
                <time class="mt-1 block text-xs text-muted-foreground">{{ dateFormat(item.created_date) }}</time>
              </div>
            </NuxtLink>
          </div>
        </section>
      </template>

      <Separator class="my-10" />
      <CommentSection :article-id="article.id" />
    </article>
  </PageShell>
</template>

<script setup lang="ts">
import { Calendar, Folder, Eye, Clock, Heart } from 'lucide-vue-next'
import { APP_META } from '#shared/meta'

const { t } = useI18n()

const route = useRoute()
const articleId = Number(route.params.id)
if (!Number.isInteger(articleId) || articleId <= 0) {
  throw createError({ statusCode: 404, message: t('article.notFound'), fatal: true })
}

const api = useBlogApi()
const { thumbnailUrl, shareImageUrl } = useStaticUrl()
const { staticPath } = useRuntimeConfig().public

const { data: article, error } = await useAsyncData(`article-${articleId}`, () => api.getArticle(articleId))
if (error.value || !article.value) {
  throw createError({ statusCode: error.value?.statusCode === 404 ? 404 : 500, message: t('article.notFound'), fatal: true })
}

const rendered = computed(() => renderMarkdown(article.value?.content, { staticPath }))

const readingMinutes = computed(() => {
  const length = article.value?.content?.length ?? 0
  return Math.max(1, Math.round(length / 400))
})

// 点赞
const identity = useIdentity()
const liked = computed(() => identity.isArticleLiked(articleId))
const likeCount = ref(article.value.like)
const likeArticle = async () => {
  if (liked.value) return
  const result = await api.likeArticle(articleId)
  identity.markArticleLiked(articleId)
  likeCount.value = result.like ?? likeCount.value + 1
}

useSeoMeta({
  title: article.value.title,
  description: article.value.description,
  ogTitle: article.value.title,
  ogDescription: article.value.description,
  ogImage: article.value.cover ? resolveStaticUrl(staticPath, article.value.cover) : APP_META.shareIcon
})

useWechatShare(() => ({
  title: article.value?.title ?? '',
  desc: article.value?.description || APP_META.description,
  imgUrl: shareImageUrl(article.value?.cover) || undefined
}))
</script>
