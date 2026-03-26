import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Video, Box, Image } from 'lucide-react'
import type { CharacterStyle } from './types'
import type { Message } from './types'
import { BackgroundCustomizer } from './BackgroundCustomizer'

interface Character3DProps {
  style: CharacterStyle
  currentMessage?: Message
  background?: string
  onStyleChange?: (style: CharacterStyle) => void
  onBackgroundChange?: (background: string) => void
}

export function Character3D({ style, currentMessage, background, onStyleChange, onBackgroundChange }: Character3DProps) {
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
      
      // 模拟口型同步
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

  // 表情对应的动画效果
  const getExpressionAnimation = () => {
    switch (expression) {
      case 'happy':
        return { scale: 1.05, brightness: 1.1, transition: { duration: 0.3 } }
      case 'thinking':
        return { scale: 1, brightness: 0.95, transition: { duration: 0.5 } }
      case 'listening':
        return { scale: 1.02, brightness: 1, transition: { duration: 0.3 } }
      case 'surprised':
        return { scale: 1.08, brightness: 1.15, transition: { duration: 0.2 } }
      default:
        return { scale: 1, brightness: 1, transition: { duration: 0.5 } }
    }
  }

  // 获取背景样式
  const getBackgroundStyle = () => {
    if (customMedia?.type === 'video') {
      return {}
    }
    
    // 支持自定义背景图片URL
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative' as const
        }
      case 'living-room':
        return { 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          position: 'relative' as const
        }
      case 'outdoor':
        return { 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          position: 'relative' as const
        }
      case 'studio':
        return { 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          position: 'relative' as const
        }
      default:
        return { 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative' as const
        }
    }
  }

  // 获取角色样式 - 更真实的渐变和阴影
  const getCharacterStyle = () => {
    if (style === 'cartoon') {
      return {
        background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 50%, #fab1a0 100%)',
        border: '4px solid #fd79a8',
        boxShadow: '0 25px 50px rgba(253, 121, 168, 0.4), inset 0 -5px 20px rgba(0,0,0,0.1)'
      }
    } else {
      return {
        background: 'linear-gradient(135deg, #dfe6e9 0%, #b2bec3 50%, #636e72 100%)',
        border: '4px solid #2d3436',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), inset 0 -5px 20px rgba(255,255,255,0.2)'
      }
    }
  }

  // 处理自定义媒体上传
  const handleCustomMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      if (file.type.startsWith('video/')) {
        setCustomMedia({ type: 'video', url, name: file.name })
      } else if (file.name.endsWith('.gltf') || file.name.endsWith('.glb') || file.name.endsWith('.obj') || file.name.endsWith('.fbx')) {
        setCustomMedia({ type: 'model', url, name: file.name })
        // 这里可以集成Three.js来渲染3D模型
        console.log('3D模型文件已上传:', file.name)
      }
    }
  }

  // 清除自定义媒体
  const clearCustomMedia = () => {
    if (customMedia?.url) {
      URL.revokeObjectURL(customMedia.url)
    }
    setCustomMedia(null)
  }

  return (
    <div className="h-full w-full relative overflow-hidden" style={getBackgroundStyle()}>
      {/* 自定义视频数字人 */}
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
            style={{ 
              filter: isSpeaking ? 'brightness(1.1)' : 'brightness(1)',
              transition: 'filter 0.3s'
            }}
          />
          {/* 视频遮罩效果 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      )}

      {/* 3D模型提示 */}
      {customMedia?.type === 'model' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8 rounded-2xl bg-white/90 backdrop-blur-sm shadow-2xl">
            <Box size={64} className="mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-bold mb-2">3D模型已加载</h3>
            <p className="text-sm text-gray-600 mb-4">{customMedia.name}</p>
            <p className="text-xs text-gray-500">
              需要集成Three.js或其他3D渲染库来显示模型
            </p>
          </div>
        </div>
      )}
      
      {/* 上传控制按钮 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,.gltf,.glb,.obj,.fbx"
        className="hidden"
        onChange={handleCustomMediaUpload}
      />
      
      <div className="absolute top-2 md:top-4 left-2 md:left-4 z-20 flex gap-2">
        <motion.button
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs font-medium bg-white/90 hover:bg-white transition-all shadow-lg backdrop-blur-sm"
          style={{ color: '#333' }}
        >
          <Upload size={12} className="md:w-3.5 md:h-3.5" />
          <span className="hidden sm:inline">上传数字人</span>
        </motion.button>
        
        {/* 场景切换和卡通切换按钮 - 仅电脑端显示 */}
        <div className="hidden md:flex items-center gap-2">
          {onBackgroundChange && (
            <BackgroundCustomizer 
              currentBackground={background || 'office'}
              onBackgroundChange={onBackgroundChange}
            />
          )}
          {onStyleChange && (
            <motion.button
              onClick={() => onStyleChange(style === 'cartoon' ? 'realistic' : 'cartoon')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: `linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 50%, #fab1a0 100%)`,
                border: `2px solid ${style === 'cartoon' ? '#fd79a8' : '#2d3436'}`,
                color: style === 'cartoon' ? '#fd79a8' : '#2d3436'
              }}
            >
              <span className="text-base">{style === 'cartoon' ? '🎨' : '👤'}</span>
              <span>{style === 'cartoon' ? '卡通' : '真实'}</span>
            </motion.button>
          )}
        </div>
        
        {customMedia && (
          <motion.button
            onClick={clearCustomMedia}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs font-medium bg-red-500/90 hover:bg-red-500 text-white transition-all shadow-lg backdrop-blur-sm"
          >
            清除
          </motion.button>
        )}
      </div>
      {/* 背景装饰 - 仅在非自定义媒体时显示 */}
      {!customMedia && (
        <>
          <div className="absolute inset-0 opacity-20">
            <motion.div 
              className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl"
              style={{ background: 'rgba(255, 255, 255, 0.3)' }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-10 right-10 w-40 h-40 rounded-full blur-3xl"
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
          </div>

          {/* 主要角色容器 */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              className="relative w-48 h-72 md:w-56 md:h-80 lg:w-64 lg:h-96 rounded-3xl"
              style={getCharacterStyle()}
              animate={{
                y: bodyAnimation.breathing ? [0, -8, 0] : 0,
                rotateX: headRotation.x,
                rotateY: headRotation.y,
                ...getExpressionAnimation()
              }}
              transition={{ 
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                rotateX: { duration: 0.5 },
                rotateY: { duration: 0.5 }
              }}
            >
              {/* 头部 */}
              <motion.div 
                className="absolute top-8 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-white via-gray-50 to-gray-100 border-4 border-white shadow-2xl"
                animate={{
                  rotateZ: expression === 'thinking' ? [-2, 2, -2] : 0
                }}
                transition={{ duration: 2, repeat: expression === 'thinking' ? Infinity : 0 }}
              >
                {/* 眼睛容器 */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 flex gap-5">
                  {/* 左眼 */}
                  <motion.div className="relative">
                    <motion.div 
                      className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-700 to-gray-900"
                      animate={{ 
                        scaleY: eyeBlinkState,
                        y: expression === 'surprised' ? -2 : 0
                      }}
                      transition={{ duration: 0.1 }}
                    />
                    {/* 眼睛高光 */}
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                  </motion.div>
                  
                  {/* 右眼 */}
                  <motion.div className="relative">
                    <motion.div 
                      className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-700 to-gray-900"
                      animate={{ 
                        scaleY: eyeBlinkState,
                        y: expression === 'surprised' ? -2 : 0
                      }}
                      transition={{ duration: 0.1 }}
                    />
                    {/* 眼睛高光 */}
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                  </motion.div>
                </div>
                
                {/* 眉毛 */}
                <div className="absolute top-9 left-1/2 transform -translate-x-1/2 flex gap-6">
                  <motion.div 
                    className="w-5 h-1 rounded-full bg-gray-700"
                    animate={{
                      rotateZ: expression === 'thinking' ? -10 : expression === 'surprised' ? -15 : 0,
                      y: expression === 'surprised' ? -2 : 0
                    }}
                  />
                  <motion.div 
                    className="w-5 h-1 rounded-full bg-gray-700"
                    animate={{
                      rotateZ: expression === 'thinking' ? 10 : expression === 'surprised' ? 15 : 0,
                      y: expression === 'surprised' ? -2 : 0
                    }}
                  />
                </div>
                
                {/* 嘴巴 - 改进的口型同步 */}
                <motion.div 
                  className="absolute top-20 left-1/2 transform -translate-x-1/2"
                  animate={{
                    scaleX: expression === 'happy' ? 1.2 : 1
                  }}
                >
                  <motion.div 
                    className="w-10 bg-gray-800 rounded-full"
                    animate={{ 
                      height: isSpeaking ? 2 + mouthOpenness * 10 : (expression === 'happy' ? 3 : 2),
                      borderRadius: isSpeaking || expression === 'happy' ? '50%' : '9999px',
                      scaleY: expression === 'surprised' ? 1.5 : 1
                    }}
                    transition={{ duration: 0.1 }}
                  />
                  {/* 舌头 - 说话时显示 */}
                  {isSpeaking && mouthOpenness > 0.5 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-red-300 rounded-full"
                    />
                  )}
                </motion.div>
                
                {/* 腮红 - 开心时显示 */}
                <AnimatePresence>
                  {expression === 'happy' && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.4, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute top-16 left-6 w-6 h-4 rounded-full bg-pink-400 blur-sm"
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.4, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute top-16 right-6 w-6 h-4 rounded-full bg-pink-400 blur-sm"
                      />
                    </>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* 身体 */}
              <motion.div 
                className="absolute top-40 left-1/2 transform -translate-x-1/2 w-28 h-36 rounded-3xl bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700 shadow-inner"
                animate={{
                  scaleY: bodyAnimation.breathing ? [1, 1.02, 1] : 1
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {/* 衣服细节 */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-white/40" />
                  <div className="w-2 h-2 rounded-full bg-white/40" />
                  <div className="w-2 h-2 rounded-full bg-white/40" />
                </div>
              </motion.div>

              {/* 左手臂 - 改进的手势动画 */}
              <motion.div 
                className="absolute top-44 left-2 w-9 h-20 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-lg"
                style={{ transformOrigin: 'top center' }}
                animate={{ 
                  rotate: bodyAnimation.gesturing ? [-15, 15, -15] : (isSpeaking ? [-5, 5, -5] : 0),
                  x: bodyAnimation.gesturing ? [0, -3, 0] : 0
                }}
                transition={{ 
                  duration: bodyAnimation.gesturing ? 1.2 : 2,
                  repeat: (bodyAnimation.gesturing || isSpeaking) ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                {/* 手掌 */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-blue-300 to-blue-500" />
              </motion.div>
              
              {/* 右手臂 */}
              <motion.div 
                className="absolute top-44 right-2 w-9 h-20 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-lg"
                style={{ transformOrigin: 'top center' }}
                animate={{ 
                  rotate: bodyAnimation.gesturing ? [15, -15, 15] : (isSpeaking ? [5, -5, 5] : 0),
                  x: bodyAnimation.gesturing ? [0, 3, 0] : 0
                }}
                transition={{ 
                  duration: bodyAnimation.gesturing ? 1.2 : 2,
                  repeat: (bodyAnimation.gesturing || isSpeaking) ? Infinity : 0,
                  ease: "easeInOut",
                  delay: 0.3
                }}
              >
                {/* 手掌 */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-blue-300 to-blue-500" />
              </motion.div>

              {/* 腿部 */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                <motion.div 
                  className="w-7 h-12 rounded-b-xl bg-gradient-to-b from-blue-600 to-blue-800 shadow-md"
                  animate={{
                    scaleY: bodyAnimation.breathing ? [1, 0.98, 1] : 1
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div 
                  className="w-7 h-12 rounded-b-xl bg-gradient-to-b from-blue-600 to-blue-800 shadow-md"
                  animate={{
                    scaleY: bodyAnimation.breathing ? [1, 0.98, 1] : 1
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.1 }}
                />
              </div>
              
              {/* 鞋子 */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-3">
                <div className="w-8 h-4 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 shadow-lg" />
                <div className="w-8 h-4 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 shadow-lg" />
              </div>
            </motion.div>
          </div>
        </>
      )}

      {/* 状态指示器 */}
      <AnimatePresence>
        <div className="absolute top-2 md:top-4 right-2 md:right-4 flex flex-col gap-1.5 md:gap-2 items-end z-20">
          {expression !== 'neutral' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="px-2 md:px-4 py-1 md:py-2 rounded-full text-xs font-medium backdrop-blur-md"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#333',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              {expression === 'happy' && '😊'}
              {expression === 'thinking' && '🤔'}
              {expression === 'listening' && '👂'}
              {expression === 'surprised' && '😲'}
              <span className="hidden sm:inline ml-1">
                {expression === 'happy' && '开心'}
                {expression === 'thinking' && '思考中'}
                {expression === 'listening' && '倾听中'}
                {expression === 'surprised' && '惊讶'}
              </span>
            </motion.div>
          )}
          
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="px-2 md:px-4 py-1 md:py-2 rounded-full text-xs font-medium backdrop-blur-md flex items-center gap-1 md:gap-2"
              style={{
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95), rgba(56, 142, 60, 0.95))',
                color: 'white',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)'
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🗣️
              </motion.div>
              <span className="hidden sm:inline">语音播放中</span>
            </motion.div>
          )}
          
          {bodyAnimation.gesturing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="px-2 md:px-4 py-1 md:py-2 rounded-full text-xs font-medium backdrop-blur-md"
              style={{
                background: 'rgba(33, 150, 243, 0.95)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)'
              }}
            >
              👋 <span className="hidden sm:inline">手势交互</span>
            </motion.div>
          )}
        </div>
      </AnimatePresence>

      {/* 交互提示 - 移动端隐藏 */}
      <motion.div 
        className="hidden md:block absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center z-20 px-6 py-3 rounded-2xl backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          background: customMedia ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <p className="text-sm font-semibold mb-1" style={{ color: customMedia ? 'white' : '#333' }}>
          {customMedia ? (
            <>
              <Video size={14} className="inline mr-1" />
              {customMedia.type === 'video' ? '视频数字人' : '3D模型数字人'}
            </>
          ) : (
            style === 'cartoon' ? '🎨 卡通风格数字人' : '👤 真实风格数字人'
          )}
        </p>
        <p className="text-xs opacity-70" style={{ color: customMedia ? 'rgba(255,255,255,0.8)' : '#666' }}>
          {customMedia ? customMedia.name : '智能表情 · 口型同步 · 自然动作'}
        </p>
      </motion.div>
    </div>
  )
}