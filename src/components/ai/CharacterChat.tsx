import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Phone } from 'lucide-react'
import { StreamingText } from './StreamingText'
import type { Message } from './types'
import type { ThemeConfig } from '../../lib/themes'

interface CharacterChatProps {
  messages: Message[]
  isLoading: boolean
  themeConfig: ThemeConfig
  customAvatar?: { type: 'image' | 'video' | 'custom', url: string, style?: string } | null
  onSendMessage: (content: string) => void
  onEndCall: () => void
}

export function CharacterChat({ messages, isLoading, themeConfig, customAvatar, onSendMessage, onEndCall }: CharacterChatProps) {
  const [isListening, setIsListening] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [showStreamingContent, setShowStreamingContent] = useState(false)
  const lastMessage = messages[messages.length - 1]
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (lastMessage?.role === 'assistant') {
      setShowStreamingContent(true)
    } else {
      setShowStreamingContent(false)
    }
  }, [lastMessage])

  // 自动滚动到最新消息
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages, isLoading])

  const handleMicToggle = () => {
    if (isListening) {
      if (userInput.trim()) {
        onSendMessage(userInput)
        setUserInput('')
      } else {
        onSendMessage("你觉得今天开心吗？有没有什么开心的事情分享一下？")
      }
      setIsListening(false)
    } else {
      setIsListening(true)
      setTimeout(() => setUserInput("今天开心啊，和新认识的朋友喝咖啡聊了很久。"), 1000)
    }
  }

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-end pb-12">
      {/* 4. 对话区域 - 严限 2 条消息 */}
      <div 
        ref={scrollRef}
        className="pointer-events-auto max-h-[45vh] overflow-y-auto no-scrollbar flex flex-col gap-5 py-4 transition-all px-12 lg:px-24 mb-6"
      >
        <AnimatePresence initial={false}>
          {messages.slice(-2).map((msg, idx, arr) => {
            // 计算渐影透明度：上一条 50%，最新一条 100%
            const opacity = idx === 0 && arr.length === 2 ? 0.5 : 1;
            
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: opacity, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3 px-1 transition-opacity duration-500`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-full border-2 border-indigo-400/30 bg-white/10 flex-shrink-0 flex items-center justify-center shadow-lg overflow-hidden">
                    <img 
                      src={customAvatar?.url || "https://img0.baidu.com/it/u=1387904049,367428306&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500"} 
                      alt="AI" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                
                <div className={`max-w-[85%] backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-lg border ${
                  msg.role === 'user' 
                    ? 'bg-white/5 border-white/10 rounded-tr-none' 
                    : 'bg-white/5 border-cyan-400/10 rounded-tl-none'
                }`}>
                  <div className="text-[14px] text-white/90 leading-relaxed font-medium">
                    {msg.role === 'assistant' && idx === arr.length - 1 && showStreamingContent ? (
                      <StreamingText 
                        text={msg.content} 
                        onComplete={() => setShowStreamingContent(false)}
                      />
                    ) : (
                      msg.content
                    )}
                    {msg.role === 'assistant' && isLoading && idx === arr.length - 1 && (
                      <motion.span 
                        animate={{ opacity: [0.1, 1, 0.1] }} 
                        transition={{ duration: 1, repeat: Infinity }}
                        className="inline-block w-1 h-3 bg-cyan-400 ml-1 rounded-full align-middle"
                      />
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden flex-shrink-0 shadow-lg ring-1 ring-white/5">
                    <img src="https://tse2.mm.bing.net/th/id/OIP.JXixrtqu6-SGuc8H2zyFogHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" alt="User" className="w-full h-full object-cover" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* 5. 底部控制区 */}
      <div className="pointer-events-auto flex items-center justify-center gap-24 w-full px-8 pb-6">
        {/* 麦克风按钮 */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleMicToggle}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all relative ${
            isListening 
              ? 'bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_50px_rgba(34,211,238,0.8)] border-2 border-white/60' 
              : 'bg-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.3)] border-2 border-white/20'
          }`}
        >
          {isListening && (
            <>
              {/* 彩色层级波纹脉冲 */}
              {[
                { color: 'rgba(34, 211, 238, 0.4)', delay: 0 },
                { color: 'rgba(99, 102, 241, 0.3)', delay: 0.5 },
                { color: 'rgba(139, 92, 246, 0.2)', delay: 1.0 }
              ].map((config, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: config.delay,
                    ease: "easeOut"
                  }}
                  style={{ border: `2px solid ${config.color}` }}
                  className="absolute inset-0 rounded-full pointer-events-none"
                />
              ))}
            </>
          )}
          
          <div className="relative z-10 pointer-events-none">
            <Mic className="text-white" size={32} />
          </div>
        </motion.button>

        {/* 挂断按钮 */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onEndCall}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.4)] border-2 border-white/20"
        >
          <Phone className="text-white rotate-[135deg]" size={32} pointer-events-none />
        </motion.button>
      </div>
    </div>
  )
}