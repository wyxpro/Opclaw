import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Phone, Music2, Gift, Send, MoreHorizontal, Volume2, X, Upload } from 'lucide-react'
import { Character3D } from './Character3D'
import { VoiceWaveAnimation } from './VoiceWaveAnimation'
import { StreamingText } from './StreamingText'
import { BackgroundCustomizer } from './BackgroundCustomizer'
import type { Message, CharacterStyle } from './types'
import { useTheme } from '../../hooks/useTheme'

interface CharacterVoiceUIProps {
  style: CharacterStyle
  messages: Message[]
  isLoading: boolean
  onSendMessage: (content: string) => void
  background?: string
  characterName?: string
  onStyleChange?: (style: CharacterStyle) => void
  onBackgroundChange?: (background: string) => void
  onEndCall?: () => void
  onOpenHistory?: () => void
}

export const CharacterVoiceUI: React.FC<CharacterVoiceUIProps> = ({
  style,
  messages,
  isLoading,
  onSendMessage,
  background = 'office',
  characterName = '小梦',
  onStyleChange,
  onBackgroundChange,
  onEndCall,
  onOpenHistory
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { themeConfig } = useTheme()
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
    <div className="relative w-full h-full overflow-hidden bg-black text-white font-sans">
        {/* 1. 数字人模型 */}
        <div className="absolute inset-0 z-0">
          <Character3D 
            style={style} 
            currentMessage={lastMessage} 
            background={background}
            onStyleChange={onStyleChange}
            onBackgroundChange={onBackgroundChange}
            isMobileVoiceUI={true}
          />
        </div>

      {/* 文件上传 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,.gltf,.glb,.obj,.fbx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file && onBackgroundChange) {
            const url = URL.createObjectURL(file)
            onBackgroundChange(url)
          }
        }}
      />

      {/* 2. 顶部工具栏 */}
      <div className="relative z-20 px-6 pt-24 pb-4">
        <div className="flex items-center justify-start gap-3">
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all text-white"
          >
            <Upload size={13} />
            <span>上传分身</span>
          </motion.button>

          {onBackgroundChange && (
            <div className="flex items-center bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
              <BackgroundCustomizer 
                currentBackground={background}
                onBackgroundChange={onBackgroundChange}
              />
            </div>
          )}

          {onStyleChange && (
            <motion.button
              onClick={() => onStyleChange(style === 'cartoon' ? 'realistic' : 'cartoon')}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all backdrop-blur-md"
              style={{
                background: `linear-gradient(135deg, rgba(255, 234, 167, 0.2) 0%, rgba(253, 203, 110, 0.2) 50%)`,
                border: `1px solid rgba(255, 255, 255, 0.2)`,
                color: 'white'
              }}
            >
              <span>{style === 'cartoon' ? '🎨 卡通' : '👤 真实'}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* 4. 对话区域 - 严限 2 条消息 */}
      <div 
        ref={scrollRef}
        className="absolute bottom-64 left-0 right-0 z-20 px-6 max-h-[45vh] overflow-y-auto no-scrollbar flex flex-col gap-5 py-4 transition-all"
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
                    <img src="https://ww4.sinaimg.cn/mw690/008x1n0Dly1ibb8e3gmcqj30j60j60uh.jpg" alt="AI" className="w-full h-full object-cover" />
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
      <div className="absolute bottom-28 left-0 right-0 z-30 px-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-24 w-full">
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
                      className="absolute inset-0 rounded-full"
                    />
                  ))}
                </>
              )}
              
              <div className="relative z-10">
                <Mic className="text-white" size={32} />
              </div>
            </motion.button>

            {/* 挂断按钮 */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onEndCall}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.4)] border-2 border-white/20"
            >
              <Phone className="text-white rotate-[135deg]" size={32} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
