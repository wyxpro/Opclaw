import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, X } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { ChatInput } from './ChatInput'
import { ChatMessageList } from './ChatMessageList'
import type { ArticleWithMeta, Message } from './types'
import { aiService, type ChatMessage } from '../../services/aiService'

// Interface moved to ./types

interface AIChatSidebarProps {
  currentArticle: ArticleWithMeta | null
  allArticles?: ArticleWithMeta[]
  isOpen: boolean
  onToggle: () => void
  width: number
  height?: number
}

const STORAGE_KEY = 'ai-chat-sidebar-messages'

export function AIChatSidebar({ currentArticle, allArticles = [], isOpen, onToggle, width, height }: AIChatSidebarProps) {
  const { themeConfig } = useTheme()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const scrollBottomRef = useRef<HTMLDivElement>(null)
  const hasInitializedRef = useRef(false)

  // Load saved messages
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsedMessages = JSON.parse(saved)
        setMessages(parsedMessages)
      } catch (_e) { void 0 }
    }
  }, [])

  // Save messages
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollBottomRef.current && isOpen) {
      scrollBottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages, isOpen])

  // Welcome message when first opened
  useEffect(() => {
    if (isOpen && !hasInitializedRef.current && messages.length === 0) {
      hasInitializedRef.current = true
      requestAnimationFrame(() => {
        const welcomeContent = currentArticle 
          ? `你好！我是你的AI学习助手 🤖✨

当前正在浏览《${currentArticle.title}》，你可以问我：
• 这篇文章的核心观点是什么？
• 帮我总结一下主要内容
• 解释一下文中的专业术语
• 还有其他相关问题

有什么我可以帮你的吗？😊`
          : `你好！我是你的AI学习助手 🤖✨

我可以帮你：
• 解答学习中的疑问
• 总结文章要点
• 解释专业概念
• 提供学习建议

开始和我对话吧！🚀`
        
        const welcomeMessage: Message = {
          id: `welcome-${+new Date()}`,
          role: 'assistant',
          content: welcomeContent,
          timestamp: +new Date()
        }
        setMessages([welcomeMessage])
      })
    }
  }, [isOpen, currentArticle, messages.length])

  // Update welcome message when article changes
  useEffect(() => {
    if (isOpen && currentArticle && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant' && lastMessage.content.includes('当前正在浏览')) {
        // Update the welcome message with new article info
        const updatedWelcome: Message = {
          id: `welcome-update-${+new Date()}`,
          role: 'assistant',
          content: `你好！我是你的AI学习助手 🤖✨

当前正在浏览《${currentArticle.title}》，你可以问我：
• 这篇文章的核心观点是什么？
• 帮我总结一下主要内容
• 解释一下文中的专业术语
• 还有其他相关问题

有什么我可以帮你的吗？😊`,
          timestamp: +new Date()
        }
        setMessages(prev => [...prev.slice(0, -1), updatedWelcome])
      }
    }
  }, [currentArticle?.id])

  const handleSendMessage = async (content: string, attachments?: Message['attachments']) => {
    const timestamp = +new Date()
    const userMessage: Message = {
      id: `user-${timestamp}-${content.slice(0, 5)}`,
      role: 'user',
      content,
      timestamp,
      attachments
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Prepare message for streaming
    const assistantMessageId = `assistant-${Date.now()}`
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, assistantMessage])

    // Find context for RAG
    const context = aiService.findRelevantContext(content, allArticles, currentArticle)
    
    // Prepare history for AI
    const apiMessages: ChatMessage[] = [
      { role: 'system', content: aiService.getSystemPrompt(context) },
      ...messages.slice(-6).map(m => ({ 
        role: m.role as 'user' | 'assistant', 
        content: m.content 
      })),
      { role: 'user', content }
    ]

    let fullResponse = ''
    
    await aiService.streamChat(apiMessages, (chunk) => {
      fullResponse += chunk
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: fullResponse }
          : msg
      ))
    })

    setIsLoading(false)
  }

  const clearMessages = () => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
    hasInitializedRef.current = false
  }

  if (!isOpen) return null

  return (
    <div 
      className="flex flex-col glass-card overflow-hidden"
      style={{ 
        width: width,
        height: height || '100%',
        maxHeight: '100%',
        background: themeConfig.glassEffect.background,
        backdropFilter: themeConfig.glassEffect.backdropBlur,
        WebkitBackdropFilter: themeConfig.glassEffect.backdropBlur,
        border: themeConfig.glassEffect.border,
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ 
          background: `linear-gradient(135deg, ${themeConfig.colors.primaryMuted}, transparent)`,
          borderBottom: `1px solid ${themeConfig.colors.border}`,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <h3 
              className="text-sm font-semibold"
              style={{ color: themeConfig.colors.text }}
            >
              AI学习助手
            </h3>
            <p 
              className="text-xs"
              style={{ color: themeConfig.colors.textMuted }}
            >
              {currentArticle ? '基于当前文章' : '随时为你解答'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={clearMessages}
            className="px-2 py-1 rounded-lg text-xs transition-colors hover:opacity-70"
            style={{ color: themeConfig.colors.textMuted }}
            title="清空对话"
          >
            清空
          </button>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg transition-colors hover:opacity-70"
            style={{ color: themeConfig.colors.textMuted }}
            title="关闭"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-rounded"
        ref={messagesEndRef}
        tabIndex={0}
        onKeyDown={(e) => {
          const el = e.currentTarget
          const step = 60
          if (e.key === 'ArrowDown') { 
            e.preventDefault()
            el.scrollBy({ top: step, behavior: 'smooth' }) 
          }
          if (e.key === 'ArrowUp') { 
            e.preventDefault()
            el.scrollBy({ top: -step, behavior: 'smooth' }) 
          }
          if (e.key === 'PageDown') { 
            e.preventDefault()
            el.scrollBy({ top: el.clientHeight, behavior: 'smooth' }) 
          }
          if (e.key === 'PageUp') { 
            e.preventDefault()
            el.scrollBy({ top: -el.clientHeight, behavior: 'smooth' }) 
          }
          if (e.key === 'Home') {
            e.preventDefault()
            el.scrollTo({ top: 0, behavior: 'smooth' })
          }
          if (e.key === 'End') {
            e.preventDefault()
            el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
          }
        }}
        style={{ 
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain'
        }}
      >
        <ChatMessageList 
          messages={messages}
          themeConfig={themeConfig}
          parentRef={messagesEndRef}
        />
        
        {/* ChatMessageList now handles dots when content is empty */}
        <div ref={scrollBottomRef} />
      </div>

      {/* Input Area */}
      <div 
        className="flex-shrink-0 px-3 py-3 border-t"
        style={{ 
          borderColor: themeConfig.colors.border,
          background: themeConfig.glassEffect.background
        }}
      >
        <ChatInput 
          onSend={handleSendMessage}
          themeConfig={themeConfig}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}

export default AIChatSidebar
