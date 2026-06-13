/**
 * @file AI 对话助手客户端（对接 surmon.me.ai / Cloudflare Workers）
 *
 * 服务契约（详见 surmon.me.ai/ARCHITECTURE.zh-CN.md）：
 * - GET  /chat/token    无参，返回 { success, data: '<uuid>.<sig>' }，匿名会话 token
 * - GET  /chat/history  带 X-Token 头，返回 { success, data: { role, content, created_at }[] }
 * - POST /chat          带 X-Token 头 + { message, author_name?, author_email? }，返回 SSE 流
 *   SSE 事件（每行 `data: <json>`）：
 *     { type: 'text', content }      助手文本增量
 *     { type: 'tool_start', id, name } 工具调用开始
 *     { type: 'tool_end', id }         工具调用结束
 *     { type: 'done' }                 本轮结束
 *     { type: 'error', message }       服务端错误
 *
 * 所有网络逻辑仅在客户端执行（token 存 localStorage、fetch 流式读取），不参与 SSR。
 */

const TOKEN_STORAGE_KEY = 'ai_chat_token'

/** 服务端单条消息上限（surmon.me.ai CONFIG.CHAT_AGENT_USER_MESSAGE_MAX_LENGTH） */
export const AI_MESSAGE_MAX_LENGTH = 300

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

interface HistoryMessage {
  role: 'user' | 'assistant'
  content: string
  created_at: number
}

export interface ChatMessage {
  /** 客户端本地 id，用于列表 key 与流式增量定位 */
  localId: string
  role: 'user' | 'assistant'
  content: string
  /** 仅 assistant：当前是否仍在流式接收 */
  pending?: boolean
}

type StreamEvent =
  | { type: 'text'; content: string }
  | { type: 'tool_start'; id: string; name: string }
  | { type: 'tool_end'; id: string }
  | { type: 'done' }
  | { type: 'error'; message: string }

const randomId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`

export const useAiChat = () => {
  const { aiApiBase } = useRuntimeConfig().public
  const { guestProfile } = useIdentity()

  /** 服务是否已配置（base url 为空则视为未启用） */
  const enabled = computed(() => Boolean((aiApiBase as string)?.trim()))
  const baseURL = computed(() => (aiApiBase as string).replace(/\/+$/, ''))

  // 共享单例状态：浮窗开合不丢失对话
  const messages = useState<ChatMessage[]>('ai-chat-messages', () => [])
  const status = useState<'idle' | 'streaming'>('ai-chat-status', () => 'idle')
  const error = useState<string | null>('ai-chat-error', () => null)
  /** 当前正在调用的工具名（用于「正在检索…」提示） */
  const activeTool = useState<string | null>('ai-chat-active-tool', () => null)
  const historyLoaded = useState<boolean>('ai-chat-history-loaded', () => false)

  let abortController: AbortController | null = null

  const readToken = (): string | null => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY)
    } catch {
      return null
    }
  }

  /** 获取并缓存匿名会话 token；token 永不变动，复用即可 */
  const ensureToken = async (): Promise<string> => {
    const cached = readToken()
    if (cached) return cached
    const res = await $fetch<ApiEnvelope<string>>('/chat/token', { baseURL: baseURL.value })
    if (!res?.success || !res.data) throw new Error('AI 服务初始化失败')
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, res.data)
    } catch {
      // localStorage 不可用时仍可在本次会话内使用
    }
    return res.data
  }

  /** 拉取最近对话历史（首次打开浮窗时调用一次） */
  const loadHistory = async () => {
    if (!enabled.value || historyLoaded.value) return
    historyLoaded.value = true
    const token = readToken()
    if (!token) return
    try {
      const res = await $fetch<ApiEnvelope<HistoryMessage[]>>('/chat/history', {
        baseURL: baseURL.value,
        headers: { 'X-Token': token }
      })
      if (res?.success && Array.isArray(res.data)) {
        messages.value = res.data.map((m) => ({
          localId: randomId(),
          role: m.role,
          content: m.content
        }))
      }
    } catch {
      // 历史拉取失败不阻塞使用，忽略即可
    }
  }

  const friendlyError = (status: number, message?: string): string => {
    if (status === 429) return message || '请求过于频繁，请稍后再试'
    if (status === 403) return '会话已失效，请刷新页面后重试'
    if (status === 400) return message || '消息格式不正确'
    return message || 'AI 服务暂时不可用，请稍后再试'
  }

  const applyEvent = (assistant: ChatMessage, event: StreamEvent) => {
    switch (event.type) {
      case 'text':
        assistant.content += event.content
        break
      case 'tool_start':
        activeTool.value = event.name
        break
      case 'tool_end':
        activeTool.value = null
        break
      case 'error':
        error.value = event.message || 'AI 回复中断'
        break
      case 'done':
        break
    }
  }

  /** 发送一条消息并以 SSE 流式接收回复 */
  const send = async (raw: string) => {
    const text = raw.trim()
    if (!enabled.value || !text || status.value === 'streaming') return

    error.value = null
    messages.value = [...messages.value, { localId: randomId(), role: 'user', content: text }]

    const assistant: ChatMessage = { localId: randomId(), role: 'assistant', content: '', pending: true }
    messages.value = [...messages.value, assistant]
    status.value = 'streaming'
    activeTool.value = null
    abortController = new AbortController()

    try {
      const token = await ensureToken()
      const response = await fetch(`${baseURL.value}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Token': token },
        body: JSON.stringify({
          message: text,
          author_name: guestProfile.value.nickname || undefined,
          author_email: guestProfile.value.email || undefined
        }),
        signal: abortController.signal
      })

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => null)
        throw Object.assign(new Error(friendlyError(response.status, payload?.message)), { handled: true })
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        // SSE 事件以空行分隔；保留最后一段不完整数据待下次拼接
        const chunks = buffer.split('\n\n')
        buffer = chunks.pop() ?? ''
        for (const chunk of chunks) {
          const dataLine = chunk.split('\n').find((line) => line.startsWith('data:'))
          if (!dataLine) continue
          const json = dataLine.slice(5).trim()
          if (!json) continue
          try {
            applyEvent(assistant, JSON.parse(json) as StreamEvent)
            // 触发响应式更新（content 为对象内字符串，需重建引用）
            messages.value = [...messages.value]
          } catch {
            // 跳过无法解析的行
          }
        }
      }
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        // 用户主动中断，不视为错误
      } else if (!error.value) {
        error.value = e?.handled ? e.message : friendlyError(0)
      }
    } finally {
      assistant.pending = false
      // 助手无任何输出且发生错误时，移除空气泡
      if (!assistant.content && error.value) {
        messages.value = messages.value.filter((m) => m.localId !== assistant.localId)
      } else {
        messages.value = [...messages.value]
      }
      status.value = 'idle'
      activeTool.value = null
      abortController = null
    }
  }

  /** 中断当前流式回复 */
  const stop = () => abortController?.abort()

  return {
    enabled,
    messages,
    status,
    error,
    activeTool,
    loadHistory,
    send,
    stop
  }
}
