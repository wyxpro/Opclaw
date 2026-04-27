import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Video, Box, Image as ImageIcon } from 'lucide-react'
import type { CharacterStyle } from './types'
import type { Message } from './types'
import { BackgroundCustomizer } from './BackgroundCustomizer'

interface Character3DProps {
  style: CharacterStyle
  currentMessage?: Message
  background?: string
  onStyleChange?: (style: CharacterStyle) => void
  onBackgroundChange?: (background: string) => void
  isMobileVoiceUI?: boolean
  customAvatar?: { type: 'image' | 'video' | 'custom', url: string, style?: string } | null
}

export function Character3D({ 
  style, 
  currentMessage, 
  background, 
  onStyleChange, 
  onBackgroundChange,
  isMobileVoiceUI = false,
  customAvatar
}: Character3DProps) {
  const [customMedia, setCustomMedia] = useState<{ type: 'video' | 'model', url: string, name: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [expression, setExpression] = useState<'neutral' | 'happy' | 'thinking' | 'listening' | 'surprised'>('neutral')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [mouthOpenness, setMouthOpenness] = useState(0)
  const [eyeBlinkState, setEyeBlinkState] = useState(1)
  const [headRotation, setHeadRotation] = useState({ x: 0, y: 0 })
  const [bodyAnimation, setBodyAnimation] = useState({ breathing: true, gesturing: false })

  // 眨眼动画
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlinkState(0)
      setTimeout(() => setEyeBlinkState(1), 150)
    }, 3000 + Math.random() * 2000)
    
    return () => clearInterval(blinkInterval)
  }, [])

  // 呼吸动画
  useEffect(() => {
    if (bodyAnimation.breathing) {
      const breathingInterval = setInterval(() => {
        setBodyAnimation(prev => ({ ...prev, breathing: true }))
      }, 3000)
      return () => clearInterval(breathingInterval)
    }
  }, [bodyAnimation.breathing])

  // 根据消息内容更新表情和动作
  useEffect(() => {
    if (!currentMessage) return

    if (currentMessage.role === 'user') {
      setExpression('listening')
      setHeadRotation({ x: 5, y: 0 })
      setTimeout(() => {
        setExpression('thinking')
        setHeadRotation({ x: -3, y: 5 })
      }, 1000)
    } else if (currentMessage.role === 'assistant') {
      setExpression('happy')
      setIsSpeaking(true)
      setBodyAnimation(prev => ({ ...prev, gesturing: true }))
      setHeadRotation({ x: 0, y: 0 })
      
      const lipSyncInterval = setInterval(() => {
        setMouthOpenness(Math.random() * 0.8 + 0.2)
      }, 100)
      
      setTimeout(() => {
        clearInterval(lipSyncInterval)
        setIsSpeaking(false)
        setMouthOpenness(0)
        setExpression('neutral')
        setBodyAnimation(prev => ({ ...prev, gesturing: false }))
        setHeadRotation({ x: 0, y: 0 })
      }, Math.min(currentMessage.content.length * 100, 5000))
      
      return () => clearInterval(lipSyncInterval)
    }
  }, [currentMessage])

  const getExpressionAnimation = () => {
    switch (expression) {
      case 'happy':
        return { scale: 1.05, filter: 'brightness(1.1)' }
      case 'thinking':
        return { scale: 1, filter: 'brightness(0.95)' }
      case 'listening':
        return { scale: 1.02, filter: 'brightness(1)' }
      case 'surprised':
        return { scale: 1.08, filter: 'brightness(1.15)' }
      default:
        return { scale: 1, filter: 'brightness(1)' }
    }
  }

  const getBackgroundStyle = () => {
    if (customMedia?.type === 'video') return {}
    
    if (background && background.startsWith('http')) {
      return { 
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }
    
    switch (background) {
      case 'office':
        return { 
          backgroundImage: `url('${isMobileVoiceUI ? 'https://img2.baidu.com/it/u=2810055108,4136944177&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667' : 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      case 'living-room':
        return { 
          backgroundImage: `url('${isMobileVoiceUI ? 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=400' : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      case 'outdoor':
        return { 
          backgroundImage: `url('${isMobileVoiceUI ? 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400' : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1600'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      case 'studio':
        return { 
          backgroundImage: `url('${isMobileVoiceUI ? 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=400' : 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1600'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      case 'library':
        return { 
          backgroundImage: `url('${isMobileVoiceUI ? 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=400' : 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1600'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      case 'cafe':
        return { 
          backgroundImage: `url('${isMobileVoiceUI ? 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400' : 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1600'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      default:
        return { 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }
    }
  }

  const getCharacterStyle = () => {
    if (style === 'cartoon') {
      return {
        background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 50%, #fab1a0 100%)',
        border: '4px solid #fd79a8',
        boxShadow: '0 25px 50px rgba(253, 121, 168, 0.4)'
      }
    } else {
      return {
        background: 'linear-gradient(135deg, #dfe6e9 0%, #b2bec3 50%, #636e72 100%)',
        border: '4px solid #2d3436',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
      }
    }
  }

  return (
    <div className="h-full w-full relative overflow-hidden" style={getBackgroundStyle()}>
      {customMedia?.type === 'video' && (
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            src={customMedia.url}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      )}

      {!customMedia && style !== 'hidden' && (
        <div className={`absolute inset-0 flex items-center justify-center p-4 ${isMobileVoiceUI ? '-top-38 h-full' : ''}`}>
          {style === 'realistic' ? (
            <motion.div
              className="relative w-40 h-60 md:w-60 md:h-[22rem] lg:w-64 lg:h-[26rem] rounded-[40px] md:rounded-[48px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-4 border-white/10 md:-mt-30 lg:-mt-34"
              animate={{
                y: bodyAnimation.breathing ? [0, -10, 0] : 0,
                ...getExpressionAnimation()
              }}
              transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
            >
              {customAvatar?.type === 'video' ? (
                <video 
                  src={customAvatar.url} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover select-none" 
                />
              ) : (
                <img 
                  src={customAvatar?.url || "/vibe_images/person/g1.jpg"} 
                  alt="AI Character" 
                  className="w-full h-full object-cover select-none"
                />
              )}
              {isSpeaking && (
                <motion.div 
                  className="absolute top-[35%] left-1/2 -translate-x-1/2 w-8 bg-white/20 blur-md rounded-full pointer-events-none"
                  animate={{ height: [2, 10, 2], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 0.15, repeat: Infinity }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none" />
            </motion.div>
          ) : (
            <motion.div
              className="relative w-36 h-52 md:w-48 md:h-72 lg:w-56 lg:h-84 rounded-3xl md:-mt-30 lg:-mt-34"
              style={getCharacterStyle()}
              animate={{
                y: bodyAnimation.breathing ? [0, -8, 0] : 0,
                rotateX: headRotation.x,
                rotateY: headRotation.y,
                ...getExpressionAnimation()
              }}
              transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
            >
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-white border-4 border-white shadow-xl" />
              <div className="absolute top-40 left-1/2 -translate-x-1/2 w-28 h-36 rounded-3xl bg-blue-500" />
            </motion.div>
          )}
        </div>
      )}

      {/* 状态指示器 - 移动到历史记录按钮下面 */}
      <AnimatePresence>
        <div className="absolute top-16 right-4 flex flex-col gap-2 items-end z-20">
          {expression !== 'neutral' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white shadow-lg text-gray-800"
            >
              {expression === 'happy' && '😊 开心'}
              {expression === 'thinking' && '🤔 思考中'}
              {expression === 'listening' && '👂 倾听中'}
              {expression === 'surprised' && '😲 惊讶'}
            </motion.div>
          )}
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-500 text-white shadow-lg"
            >
              🗣️ 语音播放中
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </div>
  )
}