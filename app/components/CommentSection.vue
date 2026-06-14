<template>
  <section>
    <h3 class="mb-6 font-display text-xl font-bold tracking-tight">
      评论 <span class="text-sm font-normal text-muted-foreground">({{ comments.length }})</span>
    </h3>

    <!-- 发表评论 -->
    <form class="flex flex-col gap-3" @submit.prevent="submit">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="flex flex-col gap-2">
          <label for="comment-nickname" class="text-sm font-medium">昵称</label>
          <Input id="comment-nickname" v-model="form.nickname" placeholder="如何称呼你" required />
        </div>
        <div class="flex flex-col gap-2">
          <label for="comment-email" class="text-sm font-medium">
            邮箱<span class="ml-1 text-xs font-normal text-muted-foreground">可选</span>
          </label>
          <Input id="comment-email" v-model="form.email" type="email" placeholder="name@example.com" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="comment-website" class="text-sm font-medium">
            网站<span class="ml-1 text-xs font-normal text-muted-foreground">可选</span>
          </label>
          <Input id="comment-website" v-model="form.website" type="url" placeholder="https://" />
        </div>
      </div>
      <div v-if="replyTo" class="flex items-center gap-2 text-sm text-muted-foreground">
        <span>回复 @{{ replyTo.nickname }}</span>
        <button type="button" class="cursor-pointer text-primary hover:underline" @click="replyTo = null">取消</button>
      </div>
      <div class="flex flex-col gap-2">
        <label for="comment-content" class="text-sm font-medium">评论内容</label>
        <Textarea id="comment-content" v-model="form.content" placeholder="说点什么…" rows="4" required />
      </div>
      <div class="text-right">
        <Button type="submit" :disabled="submitting || !form.nickname.trim() || !form.content.trim()">
          {{ submitting ? '提交中…' : '发表评论' }}
        </Button>
      </div>
    </form>

    <!-- 评论列表 -->
    <div v-if="topComments.length" class="mt-8 flex flex-col divide-y divide-border">
      <div v-for="comment in topComments" :key="comment.id" class="py-5 first:pt-0">
        <CommentItemView :comment="comment" @reply="setReply" @like="likeComment" />
        <div
          v-if="childrenOf(comment.id).length"
          class="mt-4 flex flex-col gap-4 border-l-2 border-border pl-4 sm:pl-6"
        >
          <CommentItemView
            v-for="child in childrenOf(comment.id)"
            :key="child.id"
            :comment="child"
            @reply="setReply"
            @like="likeComment"
          />
        </div>
      </div>
    </div>
    <p v-else class="mt-8 text-center text-sm text-muted-foreground">还没有评论，来抢沙发</p>
  </section>
</template>

<script setup lang="ts">
import type { Comment } from '#shared/types'

const props = defineProps<{ articleId: number }>()

const api = useBlogApi()
const identity = useIdentity()

const { data: comments, refresh } = await useAsyncData(
  `comments-${props.articleId}`,
  () => api.getComments(props.articleId),
  { default: () => [] }
)

const topComments = computed(() => comments.value.filter((comment) => !comment.parent_id))
const childrenOf = (id: number) => comments.value.filter((comment) => comment.parent_id === id)

const replyTo = ref<Comment | null>(null)
const setReply = (comment: Comment) => {
  replyTo.value = comment
}

const form = reactive({ nickname: '', email: '', website: '', content: '' })

// 记忆的访客资料回填
watch(
  identity.guestProfile,
  (profile) => {
    if (!form.nickname) form.nickname = profile.nickname
    if (!form.email) form.email = profile.email
    if (!form.website) form.website = profile.website
  },
  { immediate: true }
)

const submitting = ref(false)
const submit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    await api.createComment({
      article_id: props.articleId,
      parent_id: replyTo.value?.id,
      nickname: form.nickname.trim(),
      content: form.content.trim(),
      email: form.email.trim() || undefined,
      website: form.website.trim() || undefined
    })
    identity.saveGuestProfile({
      nickname: form.nickname.trim(),
      email: form.email.trim(),
      website: form.website.trim()
    })
    form.content = ''
    replyTo.value = null
    await refresh()
  } finally {
    submitting.value = false
  }
}

const likeComment = async (comment: Comment) => {
  if (identity.isCommentLiked(comment.id)) return
  await api.likeComment(comment.id)
  identity.markCommentLiked(comment.id)
  comment.like += 1
}
</script>
