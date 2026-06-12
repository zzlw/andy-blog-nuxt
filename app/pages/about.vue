<template>
  <PageShell>
    <div class="flex flex-col gap-10">
      <section>
        <h1 class="font-display text-3xl font-bold tracking-tight">关于</h1>
        <div class="mt-6 flex flex-col gap-6">
          <div v-for="author in authors" :key="author.id" class="flex items-center gap-5">
            <img
              v-if="author.avatar"
              :src="staticUrl(author.avatar)"
              :alt="author.name"
              class="size-20 rounded-full object-cover"
            />
            <div class="min-w-0">
              <h2 class="text-lg font-bold">{{ author.name }}</h2>
              <p class="mt-1 text-sm text-muted-foreground">{{ author.description || APP_META.description }}</p>
              <a
                v-if="author.email"
                :href="`mailto:${author.email}`"
                class="mt-1 inline-block text-sm text-primary hover:underline"
              >
                {{ author.email }}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section v-if="friends.length">
        <h3 class="mb-6 font-display text-xl font-bold tracking-tight">友情链接</h3>
        <div class="flex flex-wrap gap-3">
          <a
            v-for="friend in friends"
            :key="friend.id"
            :href="friend.link"
            target="_blank"
            rel="external nofollow noopener"
            class="flex items-center gap-2 rounded-full border border-border py-1.5 pr-4 pl-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
          >
            <img
              v-if="friend.avatar"
              :src="staticUrl(friend.avatar)"
              :alt="friend.name"
              class="size-6 rounded-full object-cover"
            />
            {{ friend.name }}
          </a>
        </div>
      </section>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import { APP_META } from '#shared/meta'

const api = useBlogApi()
const { staticUrl } = useStaticUrl()

const [{ data: authors }, { data: friends }] = await Promise.all([
  useAsyncData('authors', () => api.getAuthors(), { default: () => [] }),
  useAsyncData('friends', () => api.getFriends(), { default: () => [] })
])

useSeoMeta({ title: '关于' })
</script>
