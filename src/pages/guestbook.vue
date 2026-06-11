<template>
  <div class="guestbook-page">
    <div class="module editor-module">
      <h1 class="page-title">留言板</h1>
      <form class="message-editor" @submit.prevent="submit">
        <input
          v-model="form.nickname"
          class="field"
          type="text"
          placeholder="昵称（可匿名）"
          maxlength="32"
        />
        <textarea
          v-model="form.content"
          class="field content-field"
          rows="4"
          placeholder="留下你想说的话..."
          maxlength="1023"
          required
        ></textarea>
        <div class="editor-footer">
          <button class="submit-btn" type="submit" :disabled="messagesStore.posting">
            {{ messagesStore.posting ? '提交中...' : '发表留言' }}
          </button>
        </div>
      </form>
    </div>

    <div class="module list-module">
      <Loading v-if="messagesStore.fetching && !messages.length" />
      <Empty v-else-if="!messages.length" text="还没有留言" />
      <ul v-else class="message-list">
        <li v-for="message in messages" :key="message.id" class="message-item">
          <div class="message-header">
            <span class="nickname">{{ message.nickname }}</span>
            <span class="time">{{ dateTimeFormat(message.created_at) }}</span>
          </div>
          <p class="message-content">{{ message.content }}</p>
        </li>
      </ul>
      <button
        v-if="messagesStore.hasMore"
        class="loadmore"
        :disabled="messagesStore.fetching"
        @click="messagesStore.fetchMore"
      >
        {{ messagesStore.fetching ? '加载中...' : '加载更多' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useHead } from '@unhead/vue'
import { useMessagesStore } from '/@/stores/messages'
import { useIdentityStore } from '/@/stores/identity'
import { useUniversalFetch } from '/@/app/universal'
import { pageTitle } from '/@/configs/app.config'
import { dateTimeFormat } from '/@/transforms/date'
import Loading from '/@/components/common/loading.vue'
import Empty from '/@/components/common/empty.vue'

const messagesStore = useMessagesStore()
const identity = useIdentityStore()
const messages = computed(() => messagesStore.messages)

const form = reactive({
  nickname: identity.guestProfile.nickname,
  content: ''
})

useHead({ title: pageTitle('留言板') })

useUniversalFetch(() => messagesStore.fetch())

const submit = async () => {
  const content = form.content.trim()
  if (!content) return
  await messagesStore.post({
    nickname: form.nickname.trim() || undefined,
    content
  })
  form.content = ''
}
</script>

<style lang="scss" scoped>
.guestbook-page {
  display: flex;
  flex-direction: column;
  gap: $gap-lg;
}

.editor-module,
.list-module {
  padding: $gap-lg 1.5rem;
}

.page-title {
  font-size: 1.3rem;
  color: var(--color-text-darker);
  margin-bottom: $gap;
}

.message-editor {
  display: flex;
  flex-direction: column;
  gap: $gap-sm;
}

.field {
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
  resize: vertical;
}

.editor-footer {
  text-align: right;
}

.submit-btn {
  padding: 0.5em 1.5em;
  border-radius: $radius;
  color: var(--color-text-reversal);
  background-color: var(--color-primary);

  &:hover:not(:disabled) {
    background-color: var(--color-primary-lighter);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.message-item {
  padding: $gap 0;

  & + .message-item {
    border-top: 1px dashed var(--color-text-divider);
  }
}

.message-header {
  display: flex;
  align-items: baseline;
  gap: 0.8em;

  .nickname {
    font-weight: 600;
    color: var(--color-text-darker);
  }

  .time {
    font-size: 0.78rem;
    color: var(--color-text-disabled);
  }
}

.message-content {
  margin-top: 0.3em;
  white-space: pre-wrap;
  word-break: break-word;
}

.loadmore {
  width: 100%;
  padding: 0.8em;
  color: var(--color-text-secondary);

  &:hover:not(:disabled) {
    color: var(--color-primary);
  }
}
</style>
