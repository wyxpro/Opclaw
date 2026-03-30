import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, X, Send, Sparkles, Loader2 } from 'lucide-react'
import type { ThemeConfig } from '../../lib/themes'
import type { PostFormData, PostAttachment, CommunityUser } from './types'
import { uploadPublicFile } from '../../lib/storage'

interface PostCreatorProps {
  currentUser: CommunityUser
  themeConfig: ThemeConfig
  onSubmit: (data: PostFormData) => Promise<void>
}

export default function PostCreator({ currentUser, themeConfig, onSubmit }: PostCreatorProps) {
  const [content, setContent] = useState('')
  const [attachments, setAttachments] = useState<PostAttachment[]>([])
  const [useAIAvatar, setUseAIAvatar] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        const res = await uploadPublicFile(file, 'community')
        if ('url' in res) {
          const newAttachment: PostAttachment = {
            type: 'image',
            url: res.url,
            name: file.name,
          }
          setAttachments(prev => [...prev, newAttachment])
        }
      }
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!content.trim() && attachments.length === 0) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        content: content.trim(),
        attachments,
        useAIAvatar,
      })
      // 清空表单
      setContent('')
      setAttachments([])
      setIsFocused(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const avatarUrl = useAIAvatar && currentUser.avatarModel 
    ? currentUser.avatarModel.url 
    : currentUser.avatar

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: themeConfig.colors.surface,
        border: `1px solid ${themeConfig.colors.border}`,
        boxShadow: themeConfig.shadows.card,
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: themeConfig.colors.border }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: `2px solid ${themeConfig.colors.primary}30` }}
            />
            {useAIAvatar && currentUser.avatarModel && (
              <div 
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: themeConfig.colors.primary }}
              >
                <Sparkles size={10} className="text-white" />
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: themeConfig.colors.text }}>
              {currentUser.name}
            </p>
            <p className="text-xs" style={{ color: themeConfig.colors.textMuted }}>
              发布到社区
            </p>
          </div>
        </div>
        
        {/* AI分身切换 */}
        {currentUser.avatarModel && (
          <button
            onClick={() => setUseAIAvatar(!useAIAvatar)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: useAIAvatar 
                ? `${themeConfig.colors.primary}20` 
                : themeConfig.colors.surfaceAlt,
              color: useAIAvatar ? themeConfig.colors.primary : themeConfig.colors.textMuted,
              border: `1px solid ${useAIAvatar ? themeConfig.colors.primary : themeConfig.colors.border}`,
            }}
          >
            <Sparkles size={12} />
            {useAIAvatar ? '使用AI分身' : '使用默认头像'}
          </button>
        )}
      </div>

      {/* Content Input */}
      <div className="p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="分享你的想法，或者@AI分身来互动..."
          className="w-full bg-transparent resize-none outline-none text-sm leading-relaxed"
          style={{ 
            color: themeConfig.colors.text,
            minHeight: isFocused ? '120px' : '60px',
          }}
          rows={isFocused ? 4 : 2}
        />

        {/* Image Previews */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 mt-3 flex-wrap"
            >
              {attachments.map((attachment, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative group"
                >
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: themeConfig.colors.rose }}
                  >
                    <X size={12} className="text-white" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div 
        className="px-4 py-3 border-t flex items-center justify-between"
        style={{ borderColor: themeConfig.colors.border }}
      >
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg transition-colors"
            style={{ 
              color: themeConfig.colors.textSecondary,
              background: themeConfig.colors.surfaceAlt,
            }}
            title="添加图片"
          >
            <Image size={18} />
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isSubmitting || (!content.trim() && attachments.length === 0)}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: themeConfig.colors.primary,
            color: '#ffffff',
            boxShadow: `0 4px 14px ${themeConfig.colors.primary}40`,
          }}
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          发布
        </motion.button>
      </div>
    </motion.div>
  )
}
