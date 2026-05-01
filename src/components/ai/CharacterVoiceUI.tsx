import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Phone, Music2, Gift, Send, MoreHorizontal, Volume2, X, Upload, Sparkles, Bot, Keyboard, Smile, Image as ImageIcon, PhoneCall } from 'lucide-react'
import { Character3D } from './Character3D'
import { VoiceWaveAnimation } from './VoiceWaveAnimation'
import { StreamingText } from './StreamingText'
import { BackgroundCustomizer } from './BackgroundCustomizer'
import { AvatarSelectionDialog } from './AvatarSelectionDialog'
import type { Message, CharacterStyle, AvatarModel } from './types'
import { aiService } from '../../services/aiService'
import { sttService } from '../../services/sttService'
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
  customAvatar?: { type: 'image' | 'video' | 'custom', url: string, style?: string } | null
  onAvatarChange?: (avatar: { type: 'image' | 'video' | 'custom', url: string, style?: string }) => void
  myAvatar?: AvatarModel | null
  onGoToClone?: () => void
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
  onOpenHistory,
  customAvatar,
  onAvatarChange,
  myAvatar,
  onGoToClone
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { themeConfig } = useTheme()
  const [isListening, setIsListening] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [showStreamingContent, setShowStreamingContent] = useState(false)
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)
  const [chatMode, setChatMode] = useState<'text' | 'call'>('text')
  const [inputMode, setInputMode] = useState<'keyboard' | 'voice'>('keyboard')
  const [isPressing, setIsPressing] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // 播放 UI 音效
  const playUISound = (type: 'start' | 'end' | 'toggle' | 'pop') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)

      const now = audioCtx.currentTime

      if (type === 'start') {
        // 呼叫开始：清脆的上升双音阶
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(523.25, now) // C5
        oscillator.frequency.exponentialRampToValueAtTime(783.99, now + 0.1) // G5
        gainNode.gain.setValueAtTime(0, now)
        gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
        oscillator.start(now)
        oscillator.stop(now + 0.4)
      } else if (type === 'end') {
        // 挂断：低沉的下降音
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(392.00, now) // G4
        oscillator.frequency.exponentialRampToValueAtTime(196.00, now + 0.15) // G3
        gainNode.gain.setValueAtTime(0.15, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
        oscillator.start(now)
        oscillator.stop(now + 0.4)
      } else if (type === 'toggle') {
        // 切换/点击：极短的清脆点按声
        oscillator.type = 'triangle'
        oscillator.frequency.setValueAtTime(800, now)
        gainNode.gain.setValueAtTime(0.08, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
        oscillator.start(now)
        oscillator.stop(now + 0.1)
      } else if (type === 'pop') {
        // 气泡破裂声
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(1000, now)
        oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1)
        gainNode.gain.setValueAtTime(0.1, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
        oscillator.start(now)
        oscillator.stop(now + 0.1)
      }
    } catch (e) {
      console.warn('Audio context failed', e)
    }
  }

  const emojis = [
    '😊', '😂', '😍', '🤔', '😎', '🙌', '🔥', '✨', '❤️', '👍', '🎉', '🌟', 
    '🤖', '💡', '🎵', '📸', '🎨', '🚀', '☕', '🌈', '🍦', '🎮', '📱', '📚',
    '🍕', '🍔', '🍿', '⚽', '🎸', '🚲', '✈️', '🏠', '🐶', '🐱', '🌸', '🌓',
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

  const handleMicToggleInCall = async () => {
    playUISound('toggle')
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
            customAvatar={customAvatar}
          />
        </div>

      {/* 文件上传 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.gltf,.glb,.obj,.fbx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file && onBackgroundChange) {
            const url = URL.createObjectURL(file)
            onBackgroundChange(url)
          }
        }}
      />

      {/* 2. 顶部工具栏 - 移动到步骤文字下方 */}
      <div className="relative z-20 px-6 pt-20 pb-4">
        <div className="flex items-center justify-start gap-3">
          <motion.button
            onClick={() => setIsAvatarDialogOpen(true)}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all text-white shadow-lg shadow-black/10"
          >
            <Bot size={13} className="text-indigo-400" />
            <span>形象选择</span>
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
              onClick={() => onStyleChange(style === 'realistic' ? 'cartoon' : style === 'cartoon' ? 'hidden' : 'realistic')}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all backdrop-blur-md"
              style={{
                background: `linear-gradient(135deg, rgba(255, 234, 167, 0.2) 0%, rgba(253, 203, 110, 0.2) 50%)`,
                border: `1px solid rgba(255, 255, 255, 0.2)`,
                color: 'white'
              }}
            >
              <span>{style === 'cartoon' ? '🎨 卡通' : style === 'hidden' ? '🚫 隐藏' : '👤 真实'}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* 4. 对话区域 - 加载全部消息 */}
      <div 
        ref={scrollRef}
        className={`absolute ${style === 'hidden' ? 'bottom-[120px] top-32' : 'bottom-64 top-[50vh]'} left-0 right-0 z-20 px-6 overflow-y-auto no-scrollbar flex flex-col gap-3 py-4 transition-all`}
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx, arr) => {
            const opacity = 1;
            
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: opacity, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3 px-1 transition-opacity duration-500`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-400/30 bg-white/10 flex-shrink-0 flex items-center justify-center shadow-lg overflow-hidden">
                    <img 
                      src={customAvatar?.url || aiService.getAvatar('digital')} 
                      alt="AI" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                
                <div className={`max-w-[80%] backdrop-blur-md rounded-2xl px-3 py-2 shadow-lg border ${
                  msg.role === 'user' 
                    ? 'bg-blue-500/60 border-white/20 rounded-tr-none' 
                    : 'bg-pink-400/60 border-white/20 rounded-tl-none'
                }`}>
                  <div className={`text-[12px] leading-relaxed font-medium text-white/95`}>
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
                  <div className="w-8 h-8 rounded-full border-2 border-white/20 overflow-hidden flex-shrink-0 shadow-lg ring-1 ring-white/5">
                    <img src="https://tse2.mm.bing.net/th/id/OIP.JXixrtqu6-SGuc8H2zyFogHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" alt="User" className="w-full h-full object-cover" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* 5. 底部控制区 */}
      <div className="absolute bottom-24 left-0 right-0 z-30 px-6">
        <AnimatePresence mode="wait">
          {chatMode === 'text' ? (
            <motion.div 
              key="text-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col gap-3"
            >
                {/* Toolbar now only has Emoji and Image */}
                <div className="flex items-center gap-5 px-1 relative">
                  {/* 表情按钮 */}
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`hover:scale-110 transition-all duration-300 ${showEmojiPicker ? 'text-purple-600' : 'text-purple-500'}`}
                  >
                    <Smile size={30} strokeWidth={2.5} />
                  </button>
  
                  {/* 图片按钮 */}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-indigo-500 hover:text-indigo-600 hover:scale-110 transition-all duration-300 ml-1"
                  >
                    <ImageIcon size={30} strokeWidth={2.5} />
                  </button>
  
                  {/* 表情面板 */}
                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-14 left-0 z-50 p-4 bg-white border-2 border-gray-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden w-[280px]"
                    >
                      <div className="max-h-[180px] overflow-y-auto no-scrollbar grid grid-cols-6 gap-2 pr-1">
                        {emojis.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setUserInput(prev => prev + emoji)
                              setShowEmojiPicker(false)
                            }}
                            className="text-2xl hover:scale-125 transition-transform p-2 bg-gray-50 hover:bg-gray-100 rounded-xl"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

                {/* 输入框区域 - 语音通话按钮移至此处 */}
                <div className="flex items-center gap-3">
                  {/* 语音通话按钮 (Emerald Color) */}
                  <button 
                    onClick={() => {
                      playUISound('start')
                      setChatMode('call')
                    }}
                    className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl transition-all active:scale-90 hover:bg-emerald-600 border-2 border-emerald-400/20 shrink-0"
                  >
                    <PhoneCall size={24} strokeWidth={2.5} />
                  </button>
  
                  {/* 主输入框 */}
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="想聊点什么..."
                        className="w-full bg-white border-2 border-gray-100 rounded-full px-6 py-3.5 text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-lg font-medium"
                      />
                    </div>
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
                  <Send size={24} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="call-mode"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, y: 72 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-10 pb-8"
            >
              <div className="flex items-center justify-center gap-20 w-full">
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
                    <div className="absolute inset-0">
                      {[0, 0.5, 1].map((delay, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 1, opacity: 0.8 }}
                          animate={{ scale: 2.2, opacity: 0 }}
                          transition={{ duration: 2, repeat: Infinity, delay, ease: "easeOut" }}
                          className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
                        />
                      ))}
                    </div>
                  )}
                  <Mic className="text-white relative z-10" size={32} />
                </motion.button>

                {/* 挂断按钮 */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    playUISound('end')
                    setChatMode('text')
                    if (onEndCall) onEndCall()
                  }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.4)] border-2 border-white/20"
                >
                  <Phone className="text-white rotate-[135deg]" size={32} />
                </motion.button>
              </div>

                {/* 语音输入的波浪动态显示代替原来的返回按钮 */}
                <div 
                  onClick={() => {
                    playUISound('end')
                    setChatMode('text')
                  }}
                  className="flex flex-col items-center gap-4 cursor-pointer group"
                >
                  <VoiceWaveAnimation isListening={isListening} />
                  <span className="text-white/40 text-[11px] font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    点击波纹返回文字模式
                  </span>
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar Selection Dialog */}
      <AvatarSelectionDialog 
        isOpen={isAvatarDialogOpen} 
        onClose={() => setIsAvatarDialogOpen(false)}
        onSelectAvatar={(avatar) => onAvatarChange && onAvatarChange(avatar)}
        myAvatar={myAvatar}
        currentAvatarUrl={customAvatar?.url}
        onGoToClone={onGoToClone}
      />
    </div>
  )
}
