import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'
import type { ThemeConfig } from '../../lib/themes'
import type { Message } from './AIAssistant'

interface ChatMessageListProps {
  messages: Message[]
  themeConfig: ThemeConfig
  parentRef?: React.RefObject<HTMLDivElement | null>
}

export function ChatMessageList({ messages, themeConfig, parentRef }: ChatMessageListProps) {
  // Lightweight virtualization for long lists
  if (messages.length > 100 && parentRef?.current) {
    const container = parentRef.current
    // Internal caches stored on the DOM element to persist across renders without extra state
    // @ts-expect-error attach caches to element for virtualization
    container.__heights ||= new Map<number, number>()
    // @ts-expect-error attach caches to element for virtualization
    container.__avgHeight ||= 80
    // @ts-expect-error accessing dynamic property
    const heights: Map<number, number> = container.__heights
    // @ts-expect-error accessing dynamic property
    let avg = container.__avgHeight as number

    const total = messages.length
    let start = Math.max(Math.floor(container.scrollTop / avg) - 10, 0)
    let viewportCount = Math.ceil(container.clientHeight / avg) + 20
    let end = Math.min(start + viewportCount, total)

    // Recalculate average height dynamically
    if (heights.size > 0) {
      let sum = 0
      heights.forEach(v => (sum += v))
      avg = Math.max(50, Math.min(140, sum / heights.size))
      // @ts-expect-error updating dynamic property
      container.__avgHeight = avg
      start = Math.max(Math.floor(container.scrollTop / avg) - 10, 0)
      viewportCount = Math.ceil(container.clientHeight / avg) + 20
      end = Math.min(start + viewportCount, total)
    }

    const measureRef = (index: number) => (el: HTMLDivElement | null) => {
      if (el) {
        const h = el.getBoundingClientRect().height
        if (h && heights.get(index) !== h) {
          heights.set(index, h)
        }
      }
    }

    const sumHeights = (from: number, to: number) => {
      let s = 0
      for (let i = from; i < to; i++) {
        s += heights.get(i) ?? avg
      }
      return s
    }

    const topPad = sumHeights(0, start)
    const bottomPad = sumHeights(end, total)

    return (
      <div className="space-y-4">
        <div style={{ height: topPad }} />
        {messages.slice(start, end).map((message, i) => {
          const realIndex = start + i
          return (
            <div key={message.id} ref={measureRef(realIndex)}>
              <MessageItem message={message} themeConfig={themeConfig} />
            </div>
          )
        })}
        <div style={{ height: bottomPad }} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <MessageItem key={message.id} message={message} themeConfig={themeConfig} index={index} />
      ))}
    </div>
  )
}

function MessageItem({ message, themeConfig, index }: { message: Message; themeConfig: ThemeConfig; index?: number }) {
  // Simple markdown-like formatting
  const formatContent = (content: string) => {
    // Split by newlines and format
    const lines = content.split('\n')
    return lines.map((line, index) => {
      // Bold text **text**
      const formattedLine = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/• (.+)/g, '<li class="ml-4">$1</li>')
      
      // Check if it's a list item
      if (line.startsWith('• ')) {
        return (
          <li 
            key={index} 
            className="ml-4"
            dangerouslySetInnerHTML={{ __html: formattedLine.replace('<li class="ml-4">', '').replace('</li>', '') }}
          />
        )
      }
      
      // Empty line
      if (!line.trim()) {
        return <br key={index} />
      }
      
      return (
        <p 
          key={index} 
          className="mb-1"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      )
    })
  }

  if (index === 0 && !message) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-8">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: themeConfig.colors.primaryMuted }}
        >
          <Bot size={32} style={{ color: themeConfig.colors.primary }} />
        </div>
        <p style={{ color: themeConfig.colors.textMuted }}>
          开始和AI助手对话吧
        </p>
        <p className="text-sm mt-1" style={{ color: themeConfig.colors.textDim }}>
          可以询问关于当前文章的任何问题
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index ?? 0) * 0.05 }}
      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div 
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
        style={{ 
          background: message.role === 'user' 
            ? themeConfig.colors.primary 
            : themeConfig.colors.primaryMuted
        }}
      >
        {message.role === 'user' ? (
          <User size={14} className="text-white sm:w-4 sm:h-4" />
        ) : (
          <Bot size={14} style={{ color: themeConfig.colors.primary }} className="sm:w-4 sm:h-4" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 min-w-0 ${message.role === 'user' ? 'text-right' : ''}`}>
        {/* Sender & Time */}
        <div className={`flex items-center gap-1.5 sm:gap-2 mb-1 ${message.role === 'user' ? 'justify-end' : ''}`}>
          <span 
            className="text-[10px] sm:text-xs font-medium"
            style={{ color: themeConfig.colors.textMuted }}
          >
            {message.role === 'user' ? '我' : 'AI助手'}
          </span>
          <span 
            className="text-[10px] sm:text-xs"
            style={{ color: themeConfig.colors.textDim }}
          >
            {new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Message Bubble */}
        <div 
          className="inline-block text-left px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl max-w-[85%] sm:max-w-full break-words"
          style={{
            background: message.role === 'user'
              ? themeConfig.colors.primary
              : themeConfig.colors.surface,
            color: message.role === 'user' ? '#fff' : themeConfig.colors.text,
            border: message.role === 'user' 
              ? 'none' 
              : `1px solid ${themeConfig.colors.border}`,
            borderRadius: message.role === 'user' 
              ? '16px 16px 4px 16px' 
              : '16px 16px 16px 4px',
            fontSize: '13px',
            lineHeight: '1.5'
          }}
        >
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {message.attachments.map((att, i) => (
                <div key={i}>
                  {att.type === 'image' ? (
                    <img 
                      src={att.url} 
                      alt={att.name}
                      className="max-w-[150px] max-h-[150px] rounded-lg object-cover"
                    />
                  ) : (
                    <div 
                      className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
                      style={{ 
                        background: message.role === 'user' 
                          ? 'rgba(255,255,255,0.2)' 
                          : themeConfig.colors.bg
                      }}
                    >
                      <span>📎</span>
                      <span className="truncate max-w-[120px]">{att.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Text Content */}
          <div className="leading-relaxed whitespace-pre-wrap text-[13px] sm:text-sm">
            {formatContent(message.content)}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessageList
