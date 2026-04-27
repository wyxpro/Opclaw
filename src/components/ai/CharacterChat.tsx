import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Phone, Keyboard, Smile, Image as ImageIcon, PhoneCall, SendHorizontal, X } from 'lucide-react'
import { StreamingText } from './StreamingText'
import type { Message } from './types'
import { sttService } from '../../services/sttService'
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
  const [chatMode, setChatMode] = useState<'text' | 'call'>('text')
  const [inputMode, setInputMode] = useState<'keyboard' | 'voice'>('keyboard')
  const [isPressing, setIsPressing] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const emojis = [
    '😊', '😂', '😍', '🤔', '😎', '🙌', '🔥', '✨', '❤️', '👍', '🎉', '🌟', 
    '🤖', '💡', '🎵', '📸', '🎨', '🚀', '☕', '🌈', '🍦', '🎮', '📱', '📚',
    '🍕', '🍔', ' popcorn', '⚽', '🎸', '🚲', '✈️', '🏠', '🐶', '🐱', '🌸', '🌓',
    '🌍', '🍎', '🎁', '💎', '✉️', '🔨', '🔑', '⏰', '💪', '🍀', '🍬', '🥂'
  ]
  
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

  const handleSendMessage = () => {
    if (userInput.trim()) {
      onSendMessage(userInput)
      setUserInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleMicToggleInCall = async () => {
    if (isListening) {
      setIsListening(false)
      try {
        const text = await sttService.stopRecording()
        if (text.trim()) {
          onSendMessage(text)
        }
      } catch (error) {
        console.error('Transcription failed:', error)
      }
    } else {
      try {
        await sttService.startRecording()
        setIsListening(true)
      } catch (error) {
        console.error('Failed to start recording:', error)
      }
    }
  }

  const handlePressStart = async () => {
    try {
      setIsPressing(true)
      await sttService.startRecording()
    } catch (error) {
      console.error('Failed to start recording:', error)
      setIsPressing(false)
    }
  }

  const handlePressEnd = async () => {
    if (!isPressing) return
    setIsPressing(false)
    try {
      const text = await sttService.stopRecording()
      if (text.trim()) {
        onSendMessage(text)
      }
    } catch (error) {
      console.error('Transcription failed:', error)
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
                      <div className="flex items-center gap-1 mt-1">
                        {[0, 0.2, 0.4].map((delay) => (
                          <motion.div
                            key={delay}
                            animate={{ 
                              height: ["6px", "12px", "6px"],
                              opacity: [0.3, 1, 0.3]
                            }}
                            transition={{ 
                              duration: 0.8, 
                              repeat: Infinity, 
                              delay 
                            }}
                            className="w-0.5 rounded-full bg-cyan-400"
                          />
                        ))}
                      </div>
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
      <div className="pointer-events-auto px-8 lg:px-24 w-full">
        <AnimatePresence mode="wait">
          {chatMode === 'text' ? (
            <motion.div 
              key="text-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col gap-3"
            >
              {/* 工具栏 */}
              <div className="flex items-center gap-5 px-1 relative">
                {/* 语音通话按钮 (移动到表情左边紧靠) */}
                <button 
                  onClick={() => setChatMode('call')}
                  className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg transition-all active:scale-95 hover:bg-emerald-600"
                >
                  <PhoneCall size={20} strokeWidth={2.5} />
                </button>

                {/* 表情按钮 */}
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`hover:scale-110 transition-all duration-300 ${showEmojiPicker ? 'text-purple-600' : 'text-purple-500'}`}
                >
                  <Smile size={30} strokeWidth={2.5} />
                </button>

                {/* 图片按钮 */}
                <button className="text-indigo-500 hover:text-indigo-600 hover:scale-110 transition-all duration-300 ml-1">
                  <ImageIcon size={30} strokeWidth={2.5} />
                </button>

                {/* 表情面板 */}
                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-16 left-0 z-50 p-4 bg-white border-2 border-gray-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden w-[360px]"
                    >
                      <div className="max-h-[200px] overflow-y-auto no-scrollbar grid grid-cols-8 gap-2 pr-1">
                        {emojis.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setUserInput(prev => prev + emoji)
                              setShowEmojiPicker(false)
                            }}
                            className="text-2xl hover:scale-125 transition-transform p-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 输入框区域 */}
              <div className="flex items-center gap-3">
                {/* 模式切换按钮 */}
                <button 
                  onClick={() => setInputMode(inputMode === 'keyboard' ? 'voice' : 'keyboard')}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 shadow-xl border-2 ${
                    inputMode === 'voice' 
                      ? 'bg-amber-500 border-amber-600 text-white' 
                      : 'bg-white border-gray-100 text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  {inputMode === 'keyboard' ? <Mic size={24} /> : <Keyboard size={24} />}
                </button>

                {/* 主输入框/按住说话 */}
                <div className="flex-1 relative">
                  {inputMode === 'keyboard' ? (
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="想聊点什么..."
                      className="w-full bg-white border-2 border-gray-100 rounded-full px-7 py-3.5 text-[16px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-lg font-medium"
                    />
                  ) : (
                    <motion.button
                      onMouseDown={handlePressStart}
                      onMouseUp={handlePressEnd}
                      onMouseLeave={() => {
                        if (isPressing) handlePressEnd()
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full rounded-full py-3.5 text-[16px] font-bold transition-all shadow-xl border-2 ${
                        isPressing 
                          ? 'bg-blue-600 border-blue-700 text-white animate-pulse' 
                          : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {isPressing ? '聆听中...' : '按住 说话'}
                    </motion.button>
                  )}
                </div>

                {/* 发送按钮 (背景改为蓝色) */}
                <button 
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 border-2 shadow-xl ${
                    userInput.trim() 
                      ? 'bg-blue-600 border-blue-700 text-white' 
                      : 'bg-blue-50 border-blue-100 text-blue-300 cursor-not-allowed'
                  }`}
                >
                  <SendHorizontal size={24} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="call-mode"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-8 pb-4"
            >
              {/* 原有的语音通话 UI */}
              <div className="flex items-center justify-center gap-24 w-full">
                {/* 麦克风按钮 */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleMicToggleInCall}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all relative ${
                    isListening 
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_50px_rgba(34,211,238,0.8)] border-2 border-white/60' 
                      : 'bg-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.3)] border-2 border-white/20'
                  }`}
                >
                  {isListening && (
                    <>
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
                  onClick={() => {
                    setChatMode('text')
                    onEndCall()
                  }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.4)] border-2 border-white/20"
                >
                  <Phone className="text-white rotate-[135deg]" size={32} pointer-events-none />
                </motion.button>
              </div>

              {/* 切回文字聊天按钮 */}
              <button 
                onClick={() => setChatMode('text')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
              >
                <Keyboard size={16} />
                <span>文字对话模式</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}