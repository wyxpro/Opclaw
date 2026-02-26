import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, Volume2 } from 'lucide-react'
import type { Message } from './types'
import type { ThemeConfig } from '../../lib/themes'

interface CharacterChatProps {
  messages: Message[]
  isLoading: boolean
  themeConfig: ThemeConfig
}

export function CharacterChat({ messages, isLoading, themeConfig }: CharacterChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 滚动到底部
  useEffect(() => {
    if (messagesEndRef.current && scrollContainerRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  // 文字转语音功能
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 1.0
      utterance.pitch = 1.0
      speechSynthesis.speak(utterance)
    }
  }

  // 格式化时间
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 解析消息中的表情符号和换行
  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="h-full overflow-y-auto p-4 space-y-4 scrollbar-thin"
      style={{ 
        scrollBehavior: 'smooth',
        overscrollBehavior: 'contain'
      }}
    >
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* 头像 */}
              <div 
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ 
                  background: message.role === 'user' 
                    ? themeConfig.colors.primaryMuted 
                    : themeConfig.colors.surface,
                  border: `2px solid ${themeConfig.colors.border}`
                }}
              >
                {message.role === 'user' ? (
                  <User size={18} style={{ color: themeConfig.colors.primary }} />
                ) : (
                  <Bot size={18} style={{ color: themeConfig.colors.accent }} />
                )}
              </div>

              {/* 消息内容 */}
              <div className="flex flex-col">
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user' 
                      ? 'rounded-br-md' 
                      : 'rounded-bl-md'
                  }`}
                  style={{
                    background: message.role === 'user'
                      ? `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.primaryGlow})`
                      : themeConfig.colors.surface,
                    color: message.role === 'user' ? 'white' : themeConfig.colors.text,
                    border: message.role === 'assistant' 
                      ? `1px solid ${themeConfig.colors.border}`
                      : 'none',
                    boxShadow: themeConfig.shadows.card
                  }}
                >
                  <div className="text-sm leading-relaxed">
                    {formatMessageContent(message.content)}
                  </div>

                  {/* 附件显示 */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="relative group">
                          {attachment.type === 'image' && (
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="max-w-32 max-h-32 rounded-lg object-cover border cursor-pointer hover:scale-105 transition-transform"
                              style={{ borderColor: themeConfig.colors.border }}
                              onClick={() => window.open(attachment.url, '_blank')}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 语音播放按钮 - 仅助手消息 */}
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => speakMessage(message.content)}
                      className="mt-2 flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
                      style={{ color: message.role === 'user' ? 'rgba(255,255,255,0.8)' : themeConfig.colors.textMuted }}
                    >
                      <Volume2 size={12} />
                      <span>播放语音</span>
                    </button>
                  )}
                </div>

                {/* 时间戳 */}
                <div 
                  className={`text-xs mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                  style={{ color: themeConfig.colors.textMuted }}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* 加载指示器 */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ 
                  background: themeConfig.colors.surface,
                  border: `2px solid ${themeConfig.colors.border}`
                }}
              >
                <Bot size={18} style={{ color: themeConfig.colors.accent }} />
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-bl-md"
                style={{
                  background: themeConfig.colors.surface,
                  border: `1px solid ${themeConfig.colors.border}`,
                  boxShadow: themeConfig.shadows.card
                }}
              >
                <div className="flex gap-1">
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    style={{ color: themeConfig.colors.textMuted }}
                  >
                    .
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    style={{ color: themeConfig.colors.textMuted }}
                  >
                    .
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    style={{ color: themeConfig.colors.textMuted }}
                  >
                    .
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 滚动锚点 */}
      <div ref={messagesEndRef} />
    </div>
  )
}