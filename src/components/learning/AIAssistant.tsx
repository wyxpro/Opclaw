import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Minimize2, Maximize2, 
  GripVertical, Sparkles, Bot
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { ChatInput } from './ChatInput'
import { ChatMessageList } from './ChatMessageList'
import type { ArticleWithMeta, Message } from './types'
import { aiService, type ChatMessage } from '../../services/aiService'

// Interface moved to ./types

interface AIAssistantProps {
  currentArticle: ArticleWithMeta | null
  allArticles?: ArticleWithMeta[]
  isOpen: boolean
  onToggle: () => void
}

const STORAGE_KEY = 'ai-assistant-state'

export function AIAssistant({ currentArticle, allArticles = [], isOpen, onToggle }: AIAssistantProps) {
  const { themeConfig } = useTheme()
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  // Responsive initial size
  const getInitialSize = () => {
    const isMobile = window.innerWidth < 640
    return {
      width: isMobile ? Math.min(320, window.innerWidth - 32) : 384,
      height: isMobile ? Math.min(480, window.innerHeight - 120) : 450
    }
  }
  const [size, setSize] = useState<{ width: number; height: number }>(getInitialSize())
  const [isResizing, setIsResizing] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null)
  const resizeRef = useRef<{ type: 'right' | 'bottom' | 'corner'; startX: number; startY: number; startW: number; startH: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollBottomRef = useRef<HTMLDivElement>(null)

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const state = JSON.parse(saved)
        requestAnimationFrame(() => {
          // Only restore position if it's valid and within current viewport
          if (state.position && state.position.x > 0 && state.position.y > 0) {
            const maxX = window.innerWidth - 320
            const maxY = window.innerHeight - 400
            setPosition({
              x: Math.min(state.position.x, maxX),
              y: Math.min(state.position.y, maxY)
            })
          }
          if (state.messages) setMessages(state.messages)
          if (state.isMinimized !== undefined) setIsMinimized(state.isMinimized)
          if (state.size && state.size.width && state.size.height) {
            const maxW = Math.max(300, window.innerWidth - 32)
            const maxH = Math.max(360, window.innerHeight - 140)
            setSize({
              width: Math.min(state.size.width, maxW),
              height: Math.min(state.size.height, maxH),
            })
          } else {
            const isMobile = window.innerWidth < 1024
            setSize({ width: isMobile ? 320 : 384, height: 500 })
          }
        })
      } catch (_e) { void 0 }
    }
  }, [])

  // Save state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      position,
      messages,
      isMinimized,
      size
    }))
  }, [position, messages, isMinimized, size])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollBottomRef.current && isOpen && !isMinimized) {
      scrollBottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages, isOpen, isMinimized])

  useEffect(() => {
    const onResize = () => {
      const maxW = Math.max(300, window.innerWidth - 32)
      const maxH = Math.max(360, window.innerHeight - 140)
      setSize(prev => ({ width: Math.min(prev.width, maxW), height: Math.min(prev.height, maxH) }))
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - size.width),
        y: Math.min(prev.y, window.innerHeight - size.height),
      }))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [size.width, size.height])

  // Welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
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
  }, [isOpen, currentArticle?.id])

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return
    if ('preventDefault' in e) e.preventDefault()
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: position.x,
      initialY: position.y
    }
    setIsDragging(true)
  }, [position])

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragRef.current || !containerRef.current) return
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const deltaX = clientX - dragRef.current.startX
    const deltaY = clientY - dragRef.current.startY
    
    const newX = dragRef.current.initialX + deltaX
    const newY = dragRef.current.initialY + deltaY
    
    // Boundary checks
    const rect = containerRef.current.getBoundingClientRect()
    const maxX = window.innerWidth - rect.width
    const maxY = window.innerHeight - rect.height
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
  }, [])

  const handleDragEnd = useCallback(() => {
    dragRef.current = null
    setIsDragging(false)
  }, [])

  const handleResizeStart = useCallback((type: 'right' | 'bottom' | 'corner') => (e: React.MouseEvent) => {
    if ('preventDefault' in e) e.preventDefault()
    resizeRef.current = {
      type,
      startX: e.clientX,
      startY: e.clientY,
      startW: size.width,
      startH: size.height
    }
    setIsResizing(true)
  }, [size])

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizeRef.current) return
    const dx = e.clientX - resizeRef.current.startX
    const dy = e.clientY - resizeRef.current.startY
    let newW = resizeRef.current.startW
    let newH = resizeRef.current.startH
    if (resizeRef.current.type === 'right' || resizeRef.current.type === 'corner') {
      newW = resizeRef.current.startW + dx
    }
    if (resizeRef.current.type === 'bottom' || resizeRef.current.type === 'corner') {
      newH = resizeRef.current.startH + dy
    }
    const minW = 300
    const minH = 360
    const maxW = window.innerWidth - 32
    const maxH = window.innerHeight - 140
    newW = Math.max(minW, Math.min(newW, maxW))
    newH = Math.max(minH, Math.min(newH, maxH))
    setSize({ width: newW, height: newH })
    setPosition(prev => ({
      x: Math.min(prev.x, window.innerWidth - newW),
      y: Math.min(prev.y, window.innerHeight - newH),
    }))
  }, [])

  const handleResizeEnd = useCallback(() => {
    resizeRef.current = null
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchmove', handleDragMove)
      window.addEventListener('touchend', handleDragEnd)
      
      return () => {
        window.removeEventListener('mousemove', handleDragMove)
        window.removeEventListener('mouseup', handleDragEnd)
        window.removeEventListener('touchmove', handleDragMove)
        window.removeEventListener('touchend', handleDragEnd)
      }
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove)
      window.addEventListener('mouseup', handleResizeEnd)
      return () => {
        window.removeEventListener('mousemove', handleResizeMove)
        window.removeEventListener('mouseup', handleResizeEnd)
      }
    }
  }, [isResizing, handleResizeMove, handleResizeEnd])

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



  // Calculate default position (right side of screen)
  const getDefaultPosition = () => {
    if (typeof window === 'undefined') return { x: 100, y: 100 }
    const isMobile = window.innerWidth < 1024
    const width = isMobile ? 320 : 384
    const height = 500
    return {
      x: Math.max(16, window.innerWidth - width - 16),
      y: Math.max(16, window.innerHeight - height - 100)
    }
  }

  const currentPosition = position.x === 0 && position.y === 0 
    ? getDefaultPosition() 
    : position

  return (
    <>
      {/* Toggle Button - Always visible */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        className="fixed bottom-20 md:bottom-6 right-6 z-[120] w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.primaryGlow})`,
          boxShadow: `0 4px 20px ${themeConfig.colors.primaryMuted}`,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        <Sparkles className="w-6 h-6 text-white" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: isMinimized ? 0.95 : 1,
              x: currentPosition.x,
              y: currentPosition.y
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-[120] rounded-2xl overflow-hidden`}
            style={{
              left: 0,
              top: 0,
              background: themeConfig.glassEffect.background,
              backdropFilter: themeConfig.glassEffect.backdropBlur,
              WebkitBackdropFilter: themeConfig.glassEffect.backdropBlur,
              border: themeConfig.glassEffect.border,
              boxShadow: themeConfig.shadows.float,
              cursor: isDragging ? 'grabbing' : 'default',
              maxHeight: '80vh',
              width: size.width,
              height: isMinimized ? 'auto' : size.height
            }}
          >
            <div
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              className="flex items-center justify-between px-4 py-3 cursor-grab active:cursor-grabbing"
              style={{ 
                background: `linear-gradient(135deg, ${themeConfig.colors.primaryMuted}, transparent)`,
                borderBottom: `1px solid ${themeConfig.colors.border}`,
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
            >
              <div className="flex items-center gap-2">
                <GripVertical 
                  size={16} 
                  style={{ color: themeConfig.colors.textMuted }}
                  className="opacity-50"
                />
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
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                  style={{ color: themeConfig.colors.textMuted }}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggle()
                  }}
                  className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                  style={{ color: themeConfig.colors.textMuted }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content Area - Fixed Layout */}
            {!isMinimized && (
              <div
                className="flex flex-col"
                style={{ height: `calc(${size.height}px - 56px)` }}
              >
                {/* Messages Area - Scrollable */}
                <div 
                  className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-rounded"
                  ref={messagesEndRef as unknown as React.RefObject<HTMLDivElement>}
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
                    parentRef={messagesEndRef as unknown as React.RefObject<HTMLDivElement>}
                  />
                  {/* ChatMessageList now handles dots when content is empty */}
                  <div ref={scrollBottomRef} />
                </div>

                {/* Input Area - Fixed at Bottom */}
                <div 
                  className="flex-shrink-0 px-3 py-2 border-t bg-opacity-90"
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
            )}

            {/* Resize Handles - Right Edge */}
            <div 
              className="absolute right-0 top-12 bottom-0 w-3 cursor-ew-resize hover:bg-primary/10 transition-colors z-10"
              onMouseDown={handleResizeStart('right')}
              style={{ userSelect: 'none' }}
              title="拖动调整宽度"
            />
            {/* Resize Handles - Bottom Edge */}
            <div 
              className="absolute left-0 right-0 bottom-0 h-3 cursor-ns-resize hover:bg-primary/10 transition-colors z-10"
              onMouseDown={handleResizeStart('bottom')}
              style={{ userSelect: 'none' }}
              title="拖动调整高度"
            />
            {/* Resize Handles - Corner */}
            <div 
              className="absolute right-0 bottom-0 w-5 h-5 cursor-nwse-resize hover:bg-primary/20 transition-colors z-10 flex items-center justify-center"
              onMouseDown={handleResizeStart('corner')}
              style={{ userSelect: 'none' }}
              title="拖动调整大小"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-50">
                <path d="M1 9L9 1M5 9L9 5M9 9L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
