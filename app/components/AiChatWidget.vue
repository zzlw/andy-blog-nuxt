<template>
  <ClientOnly>
    <template v-if="enabled">
      <!-- 启动按钮：开合面板 -->
      <Transition
        enter-active-class="transition duration-200 ease-[var(--ease-out-expo)]"
        enter-from-class="opacity-0 scale-90"
        leave-active-class="transition duration-150"
        leave-to-class="opacity-0 scale-90"
      >
        <button
          v-if="!open"
          type="button"
          :aria-label="t('ai.open')"
          class="ai-fab fixed right-5 bottom-40 z-50 flex size-12 cursor-pointer items-center justify-center rounded-full text-white transition-transform ease-[var(--ease-out-expo)] hover:scale-105 active:scale-95"
          @click="toggle"
        >
          <Sparkles class="size-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
        </button>
      </Transition>

      <!-- 对话面板 -->
      <Transition
        enter-active-class="transition duration-300 ease-[var(--ease-out-expo)]"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        leave-active-class="transition duration-200 ease-[var(--ease-out-expo)]"
        leave-to-class="opacity-0 translate-y-4 scale-95"
      >
        <section
          v-if="open"
          class="fixed right-5 bottom-5 z-50 flex h-[min(620px,calc(100dvh-2.5rem))] w-[min(400px,calc(100vw-2.5rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
          role="dialog"
          :aria-label="t('ai.title')"
        >
          <!-- 头部 -->
          <header class="flex items-center gap-3 border-b border-border px-4 py-3">
            <span class="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles class="size-4" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="font-display text-sm font-semibold tracking-tight">{{ t('ai.title') }}</p>
              <p class="truncate text-xs text-muted-foreground">{{ t('ai.subtitle', { site: siteTitle }) }}</p>
            </div>
            <button
              type="button"
              :aria-label="t('ai.close')"
              class="flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              @click="toggle"
            >
              <X class="size-4" />
            </button>
          </header>

          <!-- 消息区 -->
          <div ref="scrollRef" class="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            <!-- 空态欢迎 + 推荐问题 -->
            <div v-if="!messages.length" class="flex flex-col gap-4 pt-2">
              <div class="flex flex-col items-center gap-3 text-center">
                <span class="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles class="size-6" />
                </span>
                <p class="text-sm text-muted-foreground">
                  {{ t('ai.welcome') }}
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <button
                  v-for="prompt in suggestedPrompts"
                  :key="prompt"
                  type="button"
                  class="cursor-pointer rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:border-primary hover:text-primary"
                  @click="send(prompt)"
                >
                  {{ prompt }}
                </button>
              </div>
            </div>

            <!-- 对话气泡 -->
            <div
              v-for="message in messages"
              :key="message.localId"
              class="flex"
              :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
            >
              <div
                v-if="message.role === 'user'"
                class="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm whitespace-pre-wrap text-primary-foreground"
              >
                {{ message.content }}
              </div>
              <div v-else class="max-w-[90%] rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2">
                <div
                  v-if="message.content"
                  class="prose prose-sm prose-zinc dark:prose-invert max-w-none break-words [&_p]:my-1.5 [&_pre]:my-2"
                  v-html="renderReply(message.content)"
                />
                <!-- 工具调用 / 思考中提示 -->
                <p
                  v-if="message.pending"
                  class="flex items-center gap-1.5 text-xs text-muted-foreground"
                  :class="message.content && 'mt-1.5'"
                >
                  <Loader2 class="size-3.5 animate-spin" />
                  {{ activeTool ? t('ai.calling', { tool: toolLabel(activeTool) }) : t('ai.thinking') }}
                </p>
              </div>
            </div>
          </div>

          <!-- 错误提示 -->
          <p v-if="error" class="border-t border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive">
            {{ error }}
          </p>

          <!-- 输入区 -->
          <form class="border-t border-border p-3" @submit.prevent="onSubmit">
            <div class="flex items-end gap-2">
              <Textarea
                v-model="draft"
                :maxlength="AI_MESSAGE_MAX_LENGTH"
                rows="1"
                :placeholder="t('ai.inputPlaceholder')"
                class="max-h-32 min-h-9 resize-none"
                @keydown="onKeydown"
              />
              <Button
                v-if="status === 'streaming'"
                type="button"
                size="icon"
                variant="outline"
                :aria-label="t('ai.stop')"
                @click="stop"
              >
                <Square class="size-4" />
              </Button>
              <Button v-else type="submit" size="icon" :aria-label="t('ai.send')" :disabled="!draft.trim()">
                <ArrowUp class="size-4" />
              </Button>
            </div>
          </form>
        </section>
      </Transition>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ArrowUp, Loader2, Sparkles, Square, X } from 'lucide-vue-next'

const { t } = useI18n()

const { enabled, messages, status, error, activeTool, loadHistory, send, stop } = useAiChat()
const { staticPath } = useRuntimeConfig().public

const open = ref(false)
const draft = ref('')
const scrollRef = ref<HTMLElement>()

const siteTitle = computed(() => t('site.title'))

const suggestedPrompts = computed(() => [t('ai.prompt1'), t('ai.prompt2'), t('ai.prompt3')])

const toolLabel = (name: string) => {
  const key = `ai.tool.${name}`
  const label = t(key)
  return label === key ? name : label
}

// AI 回复内容为可信度未知的模型输出，复用站点 markdown 渲染（与文章页一致）
const renderReply = (content: string) => renderMarkdown(content, { staticPath }).html

const toggle = () => {
  open.value = !open.value
  if (open.value) loadHistory()
}

const scrollToBottom = () => {
  nextTick(() => {
    const el = scrollRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

const onSubmit = () => {
  const text = draft.value.trim()
  if (!text || status.value === 'streaming') return
  draft.value = ''
  send(text)
}

// 回车发送，Shift+Enter 换行；输入法组合中不拦截
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault()
    onSubmit()
  }
}

// 新消息或流式增量时自动滚到底部
watch(() => [messages.value.length, messages.value.at(-1)?.content, open.value], scrollToBottom)
</script>
