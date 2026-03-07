import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Bot, User, Loader2 } from 'lucide-react'
import type { ThemeConfig } from '../../lib/themes'
import type { CommunityUser, AvatarChatMessage } from './types'

interface AvatarChatProps {
  currentUser: CommunityUser
  messages: AvatarChatMessage[]
  isTyping: boolean
  themeConfig: ThemeConfig
  onSendMessage: (content: string) => void
}

// 格式化时间
function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AvatarChat({
  currentUser,
  messages,
  isTyping,
  themeConfig,
  onSendMessage,
}: AvatarChatProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSubmit = () => {
    if (!input.trim() || isTyping) return
    onSendMessage(input.trim())
    setInput('')
    // 重置输入框高度
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // 自动调整输入框高度
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const target = e.target
    target.style.height = 'auto'
    target.style.height = `${Math.min(target.scrollHeight, 100)}px`
  }

  const avatarUrl = currentUser.avatarModel?.url || currentUser.avatar

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl overflow-hidden flex flex-col h-full max-h-[600px]"
      style={{
        background: themeConfig.colors.surface,
        border: `1px solid ${themeConfig.colors.border}`,
        boxShadow: themeConfig.shadows.card,
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 border-b flex items-center gap-3"
        style={{ borderColor: themeConfig.colors.border }}
      >
        <div className="relative">
          <img
            src={avatarUrl}
            alt="AI分身"
            className="w-10 h-10 rounded-full object-cover"
            style={{ border: `2px solid ${themeConfig.colors.primary}` }}
          />
          <div 
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: themeConfig.colors.primary }}
          >
            <Bot size={10} className="text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 
            className="font-semibold text-sm"
            style={{ color: themeConfig.colors.text }}
          >
            我的AI分身
          </h3>
          <p className="text-xs flex items-center gap-1" style={{ color: themeConfig.colors.textMuted }}>
            <span 
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: themeConfig.colors.emerald }}
            />
            在线
          </p>
        </div>
        <div 
          className="p-2 rounded-lg"
          style={{ background: `${themeConfig.colors.primary}15` }}
        >
          <Sparkles size={18} style={{ color: themeConfig.colors.primary }} />
        </div>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ 
          background: themeConfig.colors.bg,
          maxHeight: '400px',
        }}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {message.role === 'assistant' ? (
                  <img
                    src={avatarUrl}
                    alt="AI分身"
                    className="w-8 h-8 rounded-full object-cover"
                    style={{ border: `1.5px solid ${themeConfig.colors.primary}` }}
                  />
                ) : (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: themeConfig.colors.surfaceAlt }}
                  >
                    <User size={16} style={{ color: themeConfig.colors.textMuted }} />
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex-1 max-w-[80%] ${
                message.role === 'user' ? 'text-right' : ''
              }`}>
                <div
                  className={`inline-block px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    message.role === 'user' 
                      ? 'rounded-tr-sm' 
                      : 'rounded-tl-sm'
                  }`}
                  style={{
                    background: message.role === 'user' 
                      ? themeConfig.colors.primary
                      : themeConfig.colors.surface,
                    color: message.role === 'user' 
                      ? '#ffffff'
                      : themeConfig.colors.text,
                    border: message.role === 'user' 
                      ? 'none'
                      : `1px solid ${themeConfig.colors.border}`,
                    textAlign: 'left',
                  }}
                >
                  {message.content}
                </div>
                <p 
                  className="text-[10px] mt-1"
                  style={{ color: themeConfig.colors.textMuted }}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <img
              src={avatarUrl}
              alt="AI分身"
              className="w-8 h-8 rounded-full object-cover"
              style={{ border: `1.5px solid ${themeConfig.colors.primary}` }}
            />
            <div 
              className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1"
              style={{ 
                background: themeConfig.colors.surface,
                border: `1px solid ${themeConfig.colors.border}`,
              }}
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full"
                style={{ background: themeConfig.colors.textMuted }}
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 rounded-full"
                style={{ background: themeConfig.colors.textMuted }}
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 rounded-full"
                style={{ background: themeConfig.colors.textMuted }}
              />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div 
        className="p-3 border-t"
        style={{ borderColor: themeConfig.colors.border }}
      >
        <div 
          className="flex items-end gap-2 p-2 rounded-xl"
          style={{ background: themeConfig.colors.surfaceAlt }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="和AI分身聊聊..."
            className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed max-h-[100px] min-h-[36px] py-2"
            style={{ color: themeConfig.colors.text }}
            rows={1}
            disabled={isTyping}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={isTyping || !input.trim()}
            className="p-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            style={{
              background: input.trim() ? themeConfig.colors.primary : themeConfig.colors.border,
              color: input.trim() ? '#ffffff' : themeConfig.colors.textMuted,
            }}
          >
            {isTyping ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </motion.button>
        </div>
        <p 
          className="text-[10px] mt-2 text-center"
          style={{ color: themeConfig.colors.textMuted }}
        >
          按 Enter 发送，Shift + Enter 换行
        </p>
      </div>
    </motion.div>
  )
}
