<template>
  <div class="flex gap-3">
    <div
      class="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary"
    >
      {{ comment.nickname.slice(0, 1).toUpperCase() }}
    </div>
    <div class="min-w-0 flex-1">
      <p class="flex flex-wrap items-center gap-x-2 text-sm">
        <a
          v-if="comment.website"
          :href="comment.website"
          target="_blank"
          rel="external nofollow noopener"
          class="font-medium text-primary hover:underline"
        >
          {{ comment.nickname }}
        </a>
        <span v-else class="font-medium">{{ comment.nickname }}</span>
        <time class="text-xs text-muted-foreground">{{ dateTimeFormat(comment.created_at) }}</time>
      </p>
      <p class="mt-1.5 text-sm leading-relaxed break-words whitespace-pre-wrap">{{ comment.content }}</p>
      <p class="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1 transition-colors hover:text-primary disabled:cursor-default"
          :class="{ 'text-primary': liked }"
          :disabled="liked"
          @click="emit('like', comment)"
        >
          <Heart class="size-3.5" :class="{ 'fill-current': liked }" />{{ comment.like }}
        </button>
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1 transition-colors hover:text-primary"
          @click="emit('reply', comment)"
        >
          <MessageSquare class="size-3.5" />回复
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Heart, MessageSquare } from 'lucide-vue-next'
import type { Comment } from '#shared/types'

const props = defineProps<{ comment: Comment }>()
const emit = defineEmits<{ reply: [comment: Comment]; like: [comment: Comment] }>()

const identity = useIdentity()
const liked = computed(() => identity.isCommentLiked(props.comment.id))
</script>
