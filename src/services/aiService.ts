import { getSupabaseClient } from '../lib/supabase'
import type { ArticleWithMeta } from '../components/learning/types'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const AI_AVATAR_URL = 'https://img0.baidu.com/it/u=234561400,973736250&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500'

/**
 * AI Service to handle RAG and Chat logic
 */
export const aiService = {
  getAvatar: () => AI_AVATAR_URL,

  /**
   * Find relevant context for RAG
   */
  findRelevantContext: (query: string, articles: ArticleWithMeta[], currentArticle: ArticleWithMeta | null) => {
    let context = ''
    
    // 1. If there's a current article, prioritize it
    if (currentArticle) {
       context += `当前文章标题：${currentArticle.title}\n内容详情：${currentArticle.content}\n\n`
    }

    // 2. Simple keyword matching with other articles to provide broader context
    const queryKeywords = query.toLowerCase().split(/\s+/)
    const relatedArticles = articles
      .filter(a => a.id !== currentArticle?.id)
      .filter(a => {
        const text = (a.title + a.excerpt + a.tags.join(' ')).toLowerCase()
        return queryKeywords.some(kw => kw.length > 1 && text.includes(kw))
      })
      .slice(0, 2) // Limit to 2 additional relevant articles

    if (relatedArticles.length > 0) {
      context += '相关背景资料：\n'
      relatedArticles.forEach(a => {
        context += `- 《${a.title}》: ${a.excerpt}\n`
      })
    }

    return context
  },

  /**
   * Generate system prompt with empathy and formatting rules
   */
  getSystemPrompt: (context: string) => {
    return `你是一个专业的AI学习助手，集成在学习空间中。
你的目标是帮助用户学习和理解文档内容。

核心任务：
1. 基于以下提供的背景知识（RAG）回答用户问题：
${context || '（目前没有特定背景资料，请根据通用知识库回答）'}

对话要求：
- 保持自然、友好、专业且充满共情的语调。
- 对用户的学习进度和困惑表示理解和鼓励。
- 回复内容必须准确、简洁、有条理。

格式要求：
- **每一条回复的开头必须包含一个适当的表情符号（如 🤖, ✨, 📚等）**。
- **回复的结尾绝对不能添加任何表情符号**。
- 使用 Markdown 格式美化你的回答。

如果你不知道答案，请诚实告知，不要胡编乱造。`
  },

  /**
   * Call the AI API via Supabase Edge Function (Streaming)
   */
  async streamChat(messages: ChatMessage[], onChunk: (chunk: string) => void) {
    const supabase = getSupabaseClient()
    
    try {
      // In a real production environment, you'd use:
      // const { data, error } = await supabase.functions.invoke('chat', { body: { messages } })
      
      // For this implementation, since we need to handle streaming and the user might not have 
      // Supabase Edge Functions set up locally, we'll implement a direct fetch to ModelScope 
      // but instruct the user to use the Edge Function for security in production.
      
      // Check if we have an API key in the environment
      const apiKey = import.meta.env.VITE_MODEL_SCOPE_API_KEY
      
      if (!apiKey) {
        // Fallback for demo if no key is provided
        await this.simulateStreaming('⚠️ 抱歉，我检测到 API Key 尚未配置。请在 .env 文件中设置 VITE_MODEL_SCOPE_API_KEY 以开启真实的 AI 对话功能。\n\n当前我正处于模拟模式运行。', onChunk)
        return
      }

      const response = await fetch('https://api-inference.modelscope.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'MiniMax/MiniMax-M2.5',
          messages: messages,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
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
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6)
            if (jsonStr === '[DONE]') continue
            try {
              const data = JSON.parse(jsonStr)
              const content = data.choices[0]?.delta?.content || ''
              if (content) onChunk(content)
            } catch (e) {
              console.error('Error parsing JSON chunk', e)
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Chat Error:', error)
      onChunk(`❌ 对不起，连接 AI 服务时出现错误: ${error.message}`)
    }
  },

  /**
   * Mock streaming for demo/fallback
   */
  async simulateStreaming(text: string, onChunk: (chunk: string) => void) {
    const chars = Array.from(text)
    for (let i = 0; i < chars.length; i++) {
      onChunk(chars[i])
      await new Promise(resolve => setTimeout(resolve, 30))
    }
  }
}
