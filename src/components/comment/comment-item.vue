<template>
  <div class="comment-item">
    <div class="comment-main">
      <div class="comment-header">
        <a v-if="comment.website" class="nickname link" :href="comment.website" target="_blank" rel="nofollow noopener">
          {{ comment.nickname }}
        </a>
        <span v-else class="nickname">{{ comment.nickname }}</span>
        <span class="time">{{ dateTimeFormat(comment.created_at) }}</span>
      </div>
      <p class="comment-content">{{ comment.content }}</p>
      <div class="comment-actions">
        <button class="action" :class="{ liked }" :disabled="liked" @click="$emit('like', comment.id)">
          ♥ {{ comment.like }}
        </button>
        <button class="action" @click="$emit('reply', comment)">回复</button>
      </div>
    </div>
    <div v-if="children.length" class="comment-children">
      <CommentItem
        v-for="child in children"
        :key="child.id"
        :comment="child"
        :all-comments="allComments"
        @like="$emit('like', $event)"
        @reply="$emit('reply', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Comment } from '/@/interfaces'
import { dateTimeFormat } from '/@/transforms/date'
import { useIdentityStore } from '/@/stores/identity'

const props = defineProps<{
  comment: Comment
  allComments: Comment[]
}>()

defineEmits<{
  like: [id: number]
  reply: [comment: Comment]
}>()

const identity = useIdentityStore()
const liked = computed(() => identity.isCommentLiked(props.comment.id))
const children = computed(() => props.allComments.filter((item) => item.parent_id === props.comment.id))
</script>

<style lang="scss" scoped>
.comment-main {
  padding: $gap 0;
  border-bottom: 1px dashed var(--color-text-divider);
}

.comment-header {
  display: flex;
  align-items: baseline;
  gap: 0.8em;

  .nickname {
    font-weight: 600;
    color: var(--color-text-darker);

    &.link:hover {
      color: var(--color-primary);
    }
  }

  .time {
    font-size: 0.78rem;
    color: var(--color-text-disabled);
  }
}

.comment-content {
  margin: 0.4em 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.comment-actions {
  display: flex;
  gap: 1em;

  .action {
    font-size: 0.8rem;
    color: var(--color-text-secondary);

    &:hover:not(:disabled) {
      color: var(--color-primary);
    }

    &.liked {
      color: var(--color-primary);
      cursor: default;
    }
  }
}

.comment-children {
  padding-left: 1.5rem;
  border-left: 2px solid var(--color-text-divider);
}
</style>
