export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * 判定是否为可重试的瞬时错误（5xx / 429）
 */
function isTransientStatus(status: number): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504
}

/** 从错误信息中提取 HTTP 状态码 */
function extractStatus(message: string | undefined): number {
  if (!message) return 0
  const m = message.match(/\((\d{3})\)/)
  return m ? parseInt(m[1], 10) : 0
}

export class DeepSeekClient {
  private apiKey: string
  private baseUrl: string
  private defaultModel: string

  constructor() {
    this.apiKey = import.meta.env.VITE_DEEPSEEK_V4_FLASH_API_KEY || ''
    const rawUrl = (import.meta.env.VITE_DEEPSEEK_V4_FLASH_BASE_URL || 'https://ai.dxkp.com/v1').replace(/\/$/, '')
    // 如果在浏览器环境发起跨域请求，自动转为项目代理路径以绕过 CORS 限制
    if (typeof window !== 'undefined' && rawUrl.includes('ai.dxkp.com')) {
      this.baseUrl = '/api/dxkp/v1'
    } else {
      this.baseUrl = rawUrl
    }
    this.defaultModel = 'DeepSeek-V4-Flash'
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * 发起单次流式请求并解析 SSE
   * @returns 已输出的 chunk 数量（用于判断是否安全重试）
   */
  private async _doStreamRequest(
    endpoint: string,
    model: string,
    apiKey: string,
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
  ): Promise<number> {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`DeepSeek API 请求失败 (${response.status}): ${errorText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('未获取到 ReadableStream 响应流')
    }

    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let chunksEmitted = 0

    const emit = (data: any) => {
      const content = data.choices?.[0]?.delta?.content || ''
      if (content) {
        onChunk(content)
        chunksEmitted++
      }
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue

        if (trimmed.startsWith('data: ')) {
          try {
            emit(JSON.parse(trimmed.slice(6)))
          } catch (_e) {
            // Partial JSON chunk, ignore and continue
          }
        }
      }
    }

    // Process any remaining text in buffer if any
    const tail = buffer.trim()
    if (tail.startsWith('data: ') && tail !== 'data: [DONE]') {
      try {
        emit(JSON.parse(tail.slice(6)))
      } catch (_e) {
        // Ignore
      }
    }

    return chunksEmitted
  }

  /**
   * 当主 DeepSeek 服务不可用时，回退到 SiliconFlow 的 DeepSeek-V3
   * @returns true 表示回退成功
   */
  private async _trySiliconFlowFallback(
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
  ): Promise<boolean> {
    const sfApiKey =
      import.meta.env.VITE_SILICON_FLOW_API_KEY || import.meta.env.VITE_SILICONFLOW_API_KEY
    if (!sfApiKey) return false

    const sfEndpoint = 'https://api.siliconflow.cn/v1/chat/completions'
    const sfModel = 'deepseek-ai/DeepSeek-V3'

    try {
      console.warn('[DeepSeekClient] 主服务不可用，回退到 SiliconFlow DeepSeek-V3')
      await this._doStreamRequest(sfEndpoint, sfModel, sfApiKey, messages, onChunk)
      return true
    } catch (err) {
      console.warn('[DeepSeekClient] SiliconFlow 回退也失败:', err)
      return false
    }
  }

  /**
   * Stream chat completions using DeepSeek-V4-Flash
   *
   * 容错策略：
   * 1. 对瞬时错误（5xx / 429）自动重试最多 2 次（指数退避 500ms / 1000ms）
   * 2. 仅在尚未输出任何内容时重试，避免重复内容
   * 3. 重试用尽后自动回退到 SiliconFlow 的 DeepSeek-V3
   */
  async streamChat(messages: ChatMessage[], onChunk: (chunk: string) => void): Promise<void> {
    const apiKey = this.apiKey || import.meta.env.VITE_DEEPSEEK_V4_FLASH_API_KEY
    if (!apiKey) {
      throw new Error('DeepSeek API Key 尚未配置，请检查 .env 中的 VITE_DEEPSEEK_V4_FLASH_API_KEY')
    }

    const endpoint = `${this.baseUrl}/chat/completions`
    const maxRetries = 2
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      let chunksEmitted = 0
      try {
        chunksEmitted = await this._doStreamRequest(
          endpoint,
          this.defaultModel,
          apiKey,
          messages,
          onChunk,
        )
        return // 成功
      } catch (err: any) {
        lastError = err
        // 已开始输出内容则不再重试/回退，避免重复内容
        if (chunksEmitted > 0) throw err
        const status = extractStatus(err?.message)
        if (isTransientStatus(status) && attempt < maxRetries) {
          await this.sleep(500 * Math.pow(2, attempt))
          continue
        }
        break
      }
    }

    // 主服务持续失败，尝试 SiliconFlow 回退
    const fallbackUsed = await this._trySiliconFlowFallback(messages, onChunk)
    if (!fallbackUsed) {
      throw lastError || new Error('DeepSeek API 请求失败')
    }
  }
}

export const deepseekClient = new DeepSeekClient()
