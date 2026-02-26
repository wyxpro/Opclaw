import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { CharacterStyle } from './types'
import type { Message } from './types'

interface Character3DProps {
  style: CharacterStyle
  currentMessage?: Message
  background?: string
}

export function Character3D({ style, currentMessage, background }: Character3DProps) {
  const [customMedia, setCustomMedia] = useState<{ type: 'video' | 'model', url: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [expression, setExpression] = useState<'neutral' | 'happy' | 'thinking' | 'listening'>('neutral')
  const [isSpeaking, setIsSpeaking] = useState(false)

  // 根据消息内容更新表情
  useEffect(() => {
    if (!currentMessage) return

    if (currentMessage.role === 'user') {
      setExpression('listening')
      setTimeout(() => setExpression('thinking'), 1000)
    } else if (currentMessage.role === 'assistant') {
      setExpression('happy')
      setIsSpeaking(true)
      setTimeout(() => {
        setIsSpeaking(false)
        setExpression('neutral')
      }, 3000)
    }
  }, [currentMessage])

  // 表情对应的CSS类
  const getExpressionClasses = () => {
    switch (expression) {
      case 'happy':
        return 'scale-105 brightness-110'
      case 'thinking':
        return 'opacity-90'
      case 'listening':
        return 'scale-102'
      default:
        return ''
    }
  }

  // 获取背景样式
  const getBackgroundStyle = () => {
    if (customMedia?.type === 'video') {
      return {}
    }
    switch (background) {
      case 'office':
        return { background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)' }
      case 'living-room':
        return { background: 'linear-gradient(135deg, #faf7f2 0%, #f0e6dc 100%)' }
      case 'outdoor':
        return { background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' }
      default:
        return { background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)' }
    }
  }

  // 获取角色样式
  const getCharacterStyle = () => {
    if (style === 'cartoon') {
      return {
        background: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 50%, #ffd3b6 100%)',
        border: '4px solid #ff8b94',
        boxShadow: '0 20px 40px rgba(255, 139, 148, 0.3)'
      }
    } else {
      return {
        background: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%)',
        border: '4px solid #bdbdbd',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
      }
    }
  }

  // 处理自定义媒体上传
  const handleCustomMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      if (file.type.startsWith('video/')) {
        setCustomMedia({ type: 'video', url })
      } else if (file.name.endsWith('.gltf') || file.name.endsWith('.glb') || file.name.endsWith('.obj')) {
        setCustomMedia({ type: 'model', url })
      }
    }
  }

  return (
    <div className="h-full w-full relative overflow-hidden" style={getBackgroundStyle()}>
      {/* 自定义视频背景 */}
      {customMedia?.type === 'video' && (
        <video
          src={customMedia.url}
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* 上传按钮 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,.gltf,.glb,.obj"
        className="hidden"
        onChange={handleCustomMediaUpload}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/80 hover:bg-white transition-colors shadow-md"
        style={{ color: '#333' }}
      >
        上传模型/视频
      </button>
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-accent blur-xl"></div>
      </div>

      {/* 主要角色容器 */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          className={`relative w-48 h-72 md:w-56 md:h-80 lg:w-64 lg:h-96 rounded-3xl transition-all duration-500 ${getExpressionClasses()}`}
          style={getCharacterStyle()}
          animate={{
            y: isSpeaking ? [0, -10, 0] : 0,
            rotate: expression === 'thinking' ? [0, -2, 2, 0] : 0
          }}
          transition={{ 
            duration: isSpeaking ? 0.5 : 2,
            repeat: isSpeaking ? Infinity : 0 
          }}
        >
          {/* 头部 */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-100 border-4 border-white shadow-lg">
            {/* 眼睛 */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 flex gap-4">
              <motion.div 
                className="w-3 h-3 rounded-full bg-gray-800"
                animate={{ 
                  scaleY: isSpeaking ? [1, 0.3, 1] : 1 
                }}
                transition={{ 
                  duration: 0.3,
                  repeat: isSpeaking ? Infinity : 0 
                }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-gray-800"
                animate={{ 
                  scaleY: isSpeaking ? [1, 0.3, 1] : 1 
                }}
                transition={{ 
                  duration: 0.3,
                  repeat: isSpeaking ? Infinity : 0,
                  delay: 0.15
                }}
              />
            </div>
            
            {/* 嘴巴 */}
            <motion.div 
              className="absolute top-20 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gray-800 rounded-full"
              animate={{ 
                height: isSpeaking ? [2, 6, 2] : 2,
                borderRadius: isSpeaking ? '50%' : '9999px'
              }}
              transition={{ 
                duration: 0.3,
                repeat: isSpeaking ? Infinity : 0 
              }}
            />
          </div>

          {/* 身体 */}
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-24 h-32 rounded-b-3xl bg-gradient-to-b from-blue-400 to-blue-600"></div>

          {/* 手臂动画 */}
          <motion.div 
            className="absolute top-44 left-4 w-8 h-16 rounded-full bg-gradient-to-b from-blue-400 to-blue-600"
            animate={{ 
              rotate: isSpeaking ? [-10, 10, -10] : 0 
            }}
            transition={{ 
              duration: 0.8,
              repeat: isSpeaking ? Infinity : 0 
            }}
          />
          <motion.div 
            className="absolute top-44 right-4 w-8 h-16 rounded-full bg-gradient-to-b from-blue-400 to-blue-600"
            animate={{ 
              rotate: isSpeaking ? [10, -10, 10] : 0 
            }}
            transition={{ 
              duration: 0.8,
              repeat: isSpeaking ? Infinity : 0,
              delay: 0.4
            }}
          />

          {/* 脚部 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
            <div className="w-6 h-8 rounded-b-lg bg-gradient-to-b from-blue-600 to-blue-800"></div>
            <div className="w-6 h-8 rounded-b-lg bg-gradient-to-b from-blue-600 to-blue-800"></div>
          </div>
        </motion.div>
      </div>

      {/* 状态指示器 */}
      <div className="absolute top-4 right-4 flex gap-2">
        {expression !== 'neutral' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#333',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {expression === 'happy' && '😊 开心'}
            {expression === 'thinking' && '🤔 思考中'}
            {expression === 'listening' && '👂 倾听中'}
          </motion.div>
        )}
        
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(76, 175, 80, 0.9)',
              color: 'white',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
            }}
          >
            🗣️ 语音播放中
          </motion.div>
        )}
      </div>

      {/* 交互提示 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-20">
        <p className="text-sm opacity-70" style={{ color: customMedia ? 'white' : 'gray', textShadow: customMedia ? '0 1px 2px rgba(0,0,0,0.5)' : 'none' }}>
          {customMedia ? '自定义数字人' : (style === 'cartoon' ? '卡通风格数字人' : '真实风格数字人')}
        </p>
        <p className="text-xs opacity-50 mt-1" style={{ color: customMedia ? 'white' : 'gray', textShadow: customMedia ? '0 1px 2px rgba(0,0,0,0.5)' : 'none' }}>
          根据对话内容自动调整表情和动作
        </p>
      </div>
    </div>
  )
}