<template>
  <div class="comment-section module">
    <h3 class="section-title">评论 ({{ comments.length }})</h3>

    <form class="comment-editor" @submit.prevent="submit">
      <div v-if="replyTarget" class="reply-tip">
        回复 @{{ replyTarget.nickname }}
        <button type="button" class="cancel-reply" @click="replyTarget = null">取消</button>
      </div>
      <div class="editor-fields">
        <input v-model="form.nickname" class="field" type="text" placeholder="昵称 *" maxlength="32" required />
        <input v-model="form.email" class="field" type="email" placeholder="邮箱（可选）" />
        <input v-model="form.website" class="field" type="url" placeholder="网站（可选）" />
      </div>
      <textarea
        v-model="form.content"
        class="field content-field"
        rows="4"
        placeholder="说点什么..."
        maxlength="1023"
        required
      ></textarea>
      <div class="editor-footer">
        <button class="submit-btn" type="submit" :disabled="posting">
          {{ posting ? '提交中...' : '发表评论' }}
        </button>
      </div>
    </form>

    <Loading v-if="fetching" />
    <Empty v-else-if="!topComments.length" text="还没有评论，来抢沙发" />
    <div v-else class="comment-list">
      <CommentItem
        v-for="comment in topComments"
        :key="comment.id"
        :comment="comment"
        :all-comments="comments"
        @like="onLike"
        @reply="onReply"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Comment } from '/@/interfaces'
import { useCommentsStore } from '/@/stores/article'
import { useIdentityStore } from '/@/stores/identity'
import CommentItem from './comment-item.vue'
import Loading from '/@/components/common/loading.vue'
import Empty from '/@/components/common/empty.vue'

const props = defineProps<{ articleId: number }>()

const commentsStore = useCommentsStore()
const identity = useIdentityStore()

const comments = computed(() => commentsStore.comments)
const fetching = computed(() => commentsStore.fetching)
const posting = computed(() => commentsStore.posting)
const topComments = computed(() => comments.value.filter((comment) => !comment.parent_id))

const replyTarget = ref<Comment | null>(null)
const form = reactive({
  nickname: identity.guestProfile.nickname,
  email: identity.guestProfile.email,
  website: identity.guestProfile.website,
  content: ''
})

watch(
  () => identity.guestProfile,
  (profile) => {
    if (!form.nickname) form.nickname = profile.nickname
    if (!form.email) form.email = profile.email
    if (!form.website) form.website = profile.website
  },
  { deep: true }
)

const onReply = (comment: Comment) => {
  replyTarget.value = comment
}

const onLike = async (commentId: number) => {
  if (identity.isCommentLiked(commentId)) return
  await commentsStore.like(commentId)
  identity.markCommentLiked(commentId)
}

const submit = async () => {
  const nickname = form.nickname.trim()
  const content = form.content.trim()
  if (!nickname || !content) return

  await commentsStore.post({
    article_id: props.articleId,
    parent_id: replyTarget.value?.id ?? 0,
    nickname,
    content,
    email: form.email.trim(),
    website: form.website.trim()
  })

  identity.saveGuestProfile({ nickname, email: form.email.trim(), website: form.website.trim() })
  form.content = ''
  replyTarget.value = null
}
</script>

<style lang="scss" scoped>
.comment-section {
  padding: $gap-lg;
}

.section-title {
  margin-bottom: $gap;
  font-size: 1rem;
  color: var(--color-text-darker);
  border-left: 3px solid var(--color-primary);
  padding-left: 0.5em;
  line-height: 1.2;
}

.comment-editor {
  margin-bottom: $gap-lg;
}

.reply-tip {
  margin-bottom: $gap-sm;
  font-size: 0.85rem;
  color: var(--color-primary);

  .cancel-reply {
    margin-left: 0.8em;
    font-size: 0.8rem;
    color: var(--color-text-secondary);

    &:hover {
      color: var(--color-primary);
    }
  }
}

.editor-fields {
  display: flex;
  gap: $gap-sm;
  margin-bottom: $gap-sm;

  @include mobile {
    flex-direction: column;
  }
}

.field {
  flex: 1;
  min-width: 0;
  padding: 0.5em 0.8em;
  border: 1px solid var(--color-text-divider);
  border-radius: $radius;
  outline: none;
  background-color: var(--module-bg-opaque);
  color: var(--color-text);
  transition: border-color 0.2s;

  &:focus {
    border-color: var(--color-primary);
  }
}

.content-field {
  width: 100%;
  resize: vertical;
}

.editor-footer {
  margin-top: $gap-sm;
  text-align: right;
}

.submit-btn {
  padding: 0.5em 1.5em;
  border-radius: $radius;
  color: var(--color-text-reversal);
  background-color: var(--color-primary);
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: var(--color-primary-lighter);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>
