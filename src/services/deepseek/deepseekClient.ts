export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
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

  /**
   * Stream chat completions using DeepSeek-V4-Flash
   */
  async streamChat(messages: ChatMessage[], onChunk: (chunk: string) => void): Promise<void> {
    const apiKey = this.apiKey || import.meta.env.VITE_DEEPSEEK_V4_FLASH_API_KEY
    if (!apiKey) {
      throw new Error('DeepSeek API Key 尚未配置，请检查 .env 中的 VITE_DEEPSEEK_V4_FLASH_API_KEY')
    }

    const endpoint = `${this.baseUrl}/chat/completions`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.defaultModel,
        messages: messages,
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
            const jsonStr = trimmed.slice(6)
            const data = JSON.parse(jsonStr)
            const content = data.choices?.[0]?.delta?.content || ''
            if (content) {
              onChunk(content)
            }
          } catch (_e) {
            // Partial JSON chunk, ignore and continue
          }
        }
      }
    }

    // Process any remaining text in buffer if any
    if (buffer.trim().startsWith('data: ') && buffer.trim() !== 'data: [DONE]') {
      try {
        const jsonStr = buffer.trim().slice(6)
        const data = JSON.parse(jsonStr)
        const content = data.choices?.[0]?.delta?.content || ''
        if (content) {
          onChunk(content)
        }
      } catch (_e) {
        // Ignore
      }
    }
  }
}

export const deepseekClient = new DeepSeekClient()
