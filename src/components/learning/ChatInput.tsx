import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Send, Mic, Image, Smile, X
} from 'lucide-react'
import type { ThemeConfig } from '../../lib/themes'

interface ChatInputProps {
  onSend: (content: string, attachments?: { type: 'image' | 'file'; url: string; name: string }[]) => void
  themeConfig: ThemeConfig
  disabled?: boolean
}

export function ChatInput({ onSend, themeConfig, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [attachments, setAttachments] = useState<{ type: 'image' | 'file'; url: string; name: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    if (!input.trim() && attachments.length === 0) return
    onSend(input.trim(), attachments.length > 0 ? attachments : undefined)
    setInput('')
    setAttachments([])
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [input, attachments, onSend])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  const handleMicClick = () => {
    setIsRecording(!isRecording)
    // Simulate voice input
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false)
        setInput(prev => prev + '（语音输入内容）')
      }, 2000)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachments(prev => [...prev, {
            type: file.type.startsWith('image/') ? 'image' : 'file',
            url: event.target!.result as string,
            name: file.name
          }])
        }
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    e.target.value = ''
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const emojis = [
    // 常用表情
    '😊', '😂', '🤔', '👍', '❤️', '🎉', '🔥', '👏', '😍', '🤗', '👌', '✨',
    // 情感表达
    '😄', '😅', '😆', '😉', '😋', '😎', '😏', '😐', '😒', '😔', '😕', '😖',
    '😫', '😩', '😢', '😭', '😤', '😠', '😡', '😳', '😱', '😨', '😰', '😥',
    // 手势动作
    '👋', '✋', '👊', '✊', '🙌', '👐', '🙏', '💪', '👆', '👇', '👈', '👉',
    // 爱心系列
    '💕', '💖', '💗', '💓', '💝', '💘', '💞', '💟', '💔', '❣️', '💌', '💋',
    // 学习工作
    '📚', '📖', '✏️', '📝', '💡', '🎯', '🏆', '🎓', '💼', '📊', '📈', '✅',
    // 自然天气
    '🌟', '⭐', '🌈', '☀️', '🌤️', '☁️', '🌧️', '⛈️', '❄️', '🔥', '💧', '🌊',
    // 动物植物
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮',
    '🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🌲', '🌳', '🌴', '🌵', '🍀', '🍁'
  ]

  const addEmoji = (emoji: string) => {
    setInput(prev => prev + emoji)
    setShowEmoji(false)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {attachments.map((att, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              {att.type === 'image' ? (
                <img 
                  src={att.url} 
                  alt={att.name}
                  className="w-14 h-14 object-cover rounded-lg"
                  style={{ border: `1px solid ${themeConfig.colors.border}` }}
                />
              ) : (
                <div 
                  className="w-14 h-14 rounded-lg flex items-center justify-center text-xs text-center p-1"
                  style={{ 
                    background: themeConfig.colors.surface,
                    border: `1px solid ${themeConfig.colors.border}`,
                    color: themeConfig.colors.textMuted
                  }}
                >
                  {att.name.slice(0, 8)}...
                </div>
              )}
              <button
                onClick={() => removeAttachment(index)}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ 
                  background: themeConfig.colors.rose,
                  color: '#fff'
                }}
              >
                <X size={10} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
  
      {/* Emoji Picker - Above toolbar */}
      {showEmoji && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2 rounded-lg max-h-32 overflow-y-auto scrollbar-thin"
          style={{ 
            background: themeConfig.colors.surface,
            border: `1px solid ${themeConfig.colors.border}`
          }}
        >
          <div className="flex flex-wrap gap-1">
            {emojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-primary/10 transition-colors text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </motion.div>
      )}
  
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-1">
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          disabled={disabled}
          className="p-1.5 rounded-lg transition-colors hover:opacity-70"
          style={{ color: themeConfig.colors.textMuted }}
          aria-label="表情"
        >
          <Smile size={18} />
        </button>
        <button
          onClick={handleImageClick}
          disabled={disabled}
          className="p-1.5 rounded-lg transition-colors hover:opacity-70"
          style={{ color: themeConfig.colors.textMuted }}
          aria-label="图片"
        >
          <Image size={18} />
        </button>
        <button
          onClick={handleMicClick}
          disabled={disabled}
          className={`p-1.5 rounded-lg transition-all ${isRecording ? 'animate-pulse' : ''}`}
          style={{ 
            color: isRecording ? themeConfig.colors.rose : themeConfig.colors.textMuted
          }}
          aria-label="语音"
        >
          <Mic size={18} />
        </button>
      </div>
  
      {/* Input Area - Fixed at bottom */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="说点什么吧..."
            disabled={disabled}
            rows={1}
            className="w-full px-3 py-2.5 rounded-xl resize-none outline-none transition-all text-sm"
            style={{
              background: themeConfig.colors.surface,
              border: `1px solid ${themeConfig.colors.border}`,
              color: themeConfig.colors.text,
              minHeight: '40px',
              maxHeight: '100px'
            }}
          />
        </div>
  
        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSend}
          disabled={disabled || (!input.trim() && attachments.length === 0)}
          className="px-4 py-2.5 rounded-xl flex items-center gap-1.5 font-medium transition-all disabled:opacity-50 whitespace-nowrap"
          style={{
            background: themeConfig.colors.primary,
            color: '#fff'
          }}
        >
          <span className="text-sm">发送</span>
          <Send size={14} />
        </motion.button>
      </div>
  
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
  
      {/* Recording Indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 py-1"
          style={{ color: themeConfig.colors.rose }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: themeConfig.colors.rose }}></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: themeConfig.colors.rose }}></span>
          </span>
          <span className="text-xs">正在录音...</span>
        </motion.div>
      )}
    </div>
  )
}
