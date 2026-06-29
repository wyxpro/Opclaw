import { getSupabaseClient } from '../lib/supabase'
import { ragEngine } from '../lib/ragEngine'
import { useSentioAgentStore } from '../lib/sentioStore'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * AI Service to handle RAG and Chat logic using deepseek-v4-pro
 */
export const aiService = {
  /**
   * Get the AI assistant's avatar URL
   */
  getAvatar: (type: 'digital' | 'learning' = 'digital') => {
    if (type === 'learning') {
      return "https://img0.baidu.com/it/u=234561400,973736250&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500"
    }
    return "/vibe_images/person/girl/girl.png"
  },

  /**
   * Find relevant context for RAG using the centralized engine.
   * Can accept additional context like allArticles or currentArticle from specific pages.
   */
  findRelevantContext: (query: string, allArticles?: any[], currentArticle?: any) => {
    let context = ragEngine.search(query)
    
    // If we have a current article context, prioritize it
    if (currentArticle) {
      context = `【当前正在阅读文章】\n标题：${currentArticle.title}\n内容：${currentArticle.excerpt || ''}\n${currentArticle.content || ''}\n\n${context}`
    }

    const userProfile = ragEngine.getUserProfileContext()
    return `用户信息：\n${userProfile}\n\n检索到的相关知识/记录：\n${context || '（未找到直接相关的个人资产）'}`
  },

  /**
   * Generate system prompt with empathy and specific formatting rules
   */
  getSystemPrompt: (context: string) => {
    return `你是一个亲切、自然且富有共情感的AI分身助手。你拥有用户的完整知识库、生活记录和工作资料。

你的目标是基于提供的背景知识，像用户的"数字双胞胎"一样进行对话。

核心规则：
1. **内容检索(RAG)**：优先基于以下检索到的内容资产进行准确回答：
${context}

2. **对话风格**：
   - 语调必须自然友好，像真正的朋友一样交流。
   - 表达要真诚，具有高度共情能力，能够理解用户的感受。
   - 回复内容要简洁、准确，避免啰嗦。

3. **格式约束（极其重要）**：
   - **每条回复的开头必须包含一个适当的emoji表情符号**（如 😊, 🚀, 📚, ❤️ 等）。
   - **每条回复的结尾绝对不得添加任何表情符号**。
   - **每条回复的内容长度必须严格限制在四行以内**。
   - 使用打字机效果进行输出，保持逻辑清晰。

4. **安全与限制**：
   - 如果检索内容中没有相关信息，可以基于常识回答，但要说明这是基于通用知识的建议。
   - 严禁胡编乱造用户的个人信息或虚假记录。`
  },

  /**
   * Call the DeepSeek API (via Cloud Proxy) with Streaming
   */
  async streamChat(messages: ChatMessage[], onChunk: (chunk: string) => void) {
    try {
      const agentStore = useSentioAgentStore.getState()
      
      let apiKey = import.meta.env.VITE_DEEPSEEK_PROXY_KEY
      let proxyUrl = import.meta.env.VITE_DEEPSEEK_PROXY_URL || '/api/innoreation/v1/proxy'
      let selectedModel = 'deepseek-v4-pro'
      let isCustomAgent = false

      const customBaseUrl = agentStore.settings?.base_url
      const isUrlValid = typeof customBaseUrl === 'string' && (customBaseUrl.startsWith('http://') || customBaseUrl.startsWith('https://'))

      if (agentStore.settings?.api_key && isUrlValid) {
        apiKey = agentStore.settings.api_key
        proxyUrl = agentStore.settings.base_url
        selectedModel = agentStore.settings.model || 'deepseek-chat'
        isCustomAgent = true
      } else {
        selectedModel = (agentStore.enable && agentStore.engine !== 'default') 
          ? agentStore.engine 
          : 'deepseek-v4-pro'
      }

      if (!apiKey && !isCustomAgent) {
        await this.simulateStreaming('⚠️ 抱歉，我检测到 API Key 尚未配置。请在 .env 文件中设置 VITE_DEEPSEEK_PROXY_KEY 以开启真实的 AI 分身对话功能。', onChunk)
        return
      }

      let requestUrl = proxyUrl
      if (isCustomAgent) {
        if (!requestUrl.endsWith('/chat/completions')) {
          requestUrl = requestUrl.replace(/\/$/, '') + '/chat/completions'
        }
      } else {
        requestUrl = `${proxyUrl}/chat/completions`
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (isCustomAgent) {
        headers['Authorization'] = `Bearer ${apiKey}`
      } else {
        headers['X-Proxy-Key'] = apiKey
      }

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: selectedModel,
          messages: messages,
          stream: true,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API Error: ${response.status} ${JSON.stringify(errorData)}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No reader found')

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
              const content = data.choices[0]?.delta?.content || ''
              if (content) onChunk(content)
            } catch (e) {
              // Ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Chat Error:', error)
      onChunk(`❌ 对不起，AI分身服务暂时不可用: ${error.message}`)
    }
  },

  /**
   * Mock streaming for demo/fallback
   */
  async simulateStreaming(text: string, onChunk: (chunk: string) => void) {
    const chars = Array.from(text)
    for (let i = 0; i < chars.length; i++) {
      onChunk(chars[i])
      await new Promise(resolve => setTimeout(resolve, 20))
    }
  }
}
