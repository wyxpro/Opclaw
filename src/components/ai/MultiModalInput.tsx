import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Send, 
  Image, 
  Mic, 
  Smile
} from 'lucide-react'
import type { ThemeConfig } from '../../lib/themes'
import type { Message } from './types'

interface MultiModalInputProps {
  onSend: (content: string, attachments?: Message['attachments']) => void
  themeConfig: ThemeConfig
  disabled?: boolean
}

export function MultiModalInput({ onSend, themeConfig, disabled }: MultiModalInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [attachments, setAttachments] = useState<Message['attachments']>([])
  const [isRecording, setIsRecording] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 表情符号选项 - 丰富的预设表情
  const emojis = [
    '😊', '😂', '🤣', '😍', '🥰', '😘', '😭', '😢', '🤔', '👍',
    '🎉', '🌟', '❤️', '🔥', '✨', '🙏', '👏', '🤗', '😴', '🤯',
    '🥳', '🤩', '😎', '🤓', '😇', '🥺', '😅', '😆', '😉', '😌',
    '👀', '💪', '🙌', '👋', '🤝', '💯', '💥', '💫', '💦', '🌈',
    '🌸', '🌺', '🌻', '🌷', '🍀', '🌿', '🍎', '🍊', '🍋', '🍌'
  ]

  const handleSend = () => {
    if (inputValue.trim() || (attachments && attachments.length > 0)) {
      onSend(inputValue.trim(), (attachments && attachments.length > 0) ? attachments : undefined)
      setInputValue('')
      setAttachments([])
      setShowEmojiPicker(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newAttachments: NonNullable<Message['attachments']> = []
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            newAttachments.push({
              type: 'image',
              url: e.target?.result as string,
              name: file.name
            })
            if (newAttachments.length === files.length) {
              setAttachments(prev => [...(prev || []), ...newAttachments])
            }
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.lang = 'zh-CN'
      recognition.continuous = false
      recognition.interimResults = false
      
      recognition.onstart = () => setIsRecording(true)
      recognition.onend = () => setIsRecording(false)
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputValue(prev => prev + transcript)
      }
      
      recognition.start()
    } else {
      alert('您的浏览器不支持语音识别功能')
    }
  }

  const addEmoji = (emoji: string) => {
    setInputValue(prev => prev + emoji)
    setShowEmojiPicker(false)
    textareaRef.current?.focus()
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => (prev || []).filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3 relative">
      {/* 附件预览 */}
      {attachments && attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment, index) => (
            <div 
              key={index}
              className="relative group"
            >
              {attachment.type === 'image' && (
                <div className="relative">
                  <img 
                    src={attachment.url} 
                    alt={attachment.name}
                    className="w-16 h-16 rounded-lg object-cover border"
                    style={{ borderColor: themeConfig.colors.border }}
                  />
                  <button
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: themeConfig.colors.rose,
                      color: 'white'
                    }}
                  >
                    <span className="text-xs">×</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 输入区域 */}
      <div 
        className="relative rounded-lg md:rounded-xl transition-all z-20"
        style={{
          background: themeConfig.colors.surface,
          border: `1px solid ${themeConfig.colors.border}`,
          boxShadow: themeConfig.shadows.card
        }}
      >
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          disabled={disabled}
          rows={2}
          className="w-full px-3 py-2 resize-none focus:outline-none bg-transparent text-sm"
          style={{ 
            color: themeConfig.colors.text,
            minHeight: '40px',
            maxHeight: '80px'
          }}
        />
        
        {/* 功能按钮 */}
        <div className="flex items-center justify-between px-2 md:px-3 py-1.5 border-t"
             style={{ borderColor: themeConfig.colors.border }}>
          <div className="flex items-center gap-1 md:gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="p-1.5 rounded-lg transition-colors hover:opacity-70"
              style={{ color: themeConfig.colors.textMuted }}
              title="上传图片"
            >
              <Image size={16} className="w-4 h-4 md:w-4 md:h-4" />
            </button>
            
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={disabled}
              className="p-1.5 rounded-lg transition-colors hover:opacity-70"
              style={{ color: themeConfig.colors.textMuted }}
              title="表情符号"
            >
              <Smile size={16} className="w-4 h-4 md:w-4 md:h-4" />
            </button>
            
            <button
              onClick={handleVoiceInput}
              disabled={disabled || isRecording}
              className={`p-1.5 rounded-lg transition-all ${
                isRecording ? 'animate-pulse' : 'hover:opacity-70'
              }`}
              style={{ 
                color: isRecording ? themeConfig.colors.primary : themeConfig.colors.textMuted 
              }}
              title={isRecording ? "正在录音..." : "语音输入"}
            >
              <Mic size={16} className="w-4 h-4 md:w-4 md:h-4" />
            </button>
          </div>
          
          <motion.button
            onClick={handleSend}
            disabled={disabled || (!inputValue.trim() && (!attachments || attachments.length === 0))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all text-xs md:text-sm"
            style={{
              background: (!inputValue.trim() && (!attachments || attachments.length === 0)) || disabled
                ? themeConfig.colors.border
                : `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.primaryGlow})`,
              color: 'white',
              opacity: (!inputValue.trim() && (!attachments || attachments.length === 0)) || disabled ? 0.5 : 1
            }}
          >
            <Send size={14} className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span className="hidden sm:inline">发送</span>
          </motion.button>
        </div>
      </div>

      {/* 表情符号选择器 */}
      {showEmojiPicker && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute bottom-full left-0 right-0 mb-2 p-3 rounded-xl z-50"
          style={{
            background: themeConfig.colors.surface,
            border: `1px solid ${themeConfig.colors.border}`,
            boxShadow: themeConfig.shadows.float,
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          <div className="grid grid-cols-6 md:grid-cols-8 gap-1">
            {emojis.map((emoji, index) => (
              <motion.button
                key={index}
                onClick={() => addEmoji(emoji)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-xl md:text-2xl p-1.5 md:p-2 rounded-lg hover:bg-primary/10 transition-colors"
                style={{ color: themeConfig.colors.text }}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}