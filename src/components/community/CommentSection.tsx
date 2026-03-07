import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Send, Loader2, Bot } from 'lucide-react'
import type { ThemeConfig } from '../../lib/themes'
import type { Comment } from './types'

interface CommentSectionProps {
  comments: Comment[]
  themeConfig: ThemeConfig
  onAddComment: (content: string) => void
  onLikeComment: (commentId: string) => void
}

// 格式化相对时间
function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

// 单个评论项组件
function CommentItem({
  comment,
  themeConfig,
  onLike,
}: {
  comment: Comment
  themeConfig: ThemeConfig
  onLike: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3"
    >
      <div className="relative flex-shrink-0">
        <img
          src={comment.author.avatar}
          alt={comment.author.name}
          className="w-8 h-8 rounded-full object-cover"
          style={{ border: `1.5px solid ${themeConfig.colors.primary}30` }}
        />
        {comment.author.isAI && (
          <div 
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
            style={{ background: themeConfig.colors.primary }}
          >
            <Bot size={7} className="text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div 
          className="rounded-2xl rounded-tl-sm px-3 py-2 inline-block max-w-full"
          style={{ background: themeConfig.colors.surfaceAlt }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="font-semibold text-xs"
              style={{ color: themeConfig.colors.text }}
            >
              {comment.author.name}
            </span>
            {comment.author.isAI && (
              <span 
                className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                style={{ 
                  background: `${themeConfig.colors.primary}20`,
                  color: themeConfig.colors.primary,
                }}
              >
                AI
              </span>
            )}
          </div>
          <p 
            className="text-sm leading-relaxed"
            style={{ color: themeConfig.colors.textSecondary }}
          >
            {comment.content}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-1 ml-1">
          <span className="text-xs" style={{ color: themeConfig.colors.textMuted }}>
            {formatRelativeTime(comment.timestamp)}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onLike}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: comment.isLiked ? themeConfig.colors.rose : themeConfig.colors.textMuted }}
          >
            <Heart 
              size={12} 
              fill={comment.isLiked ? themeConfig.colors.rose : 'transparent'}
            />
            {comment.likes > 0 && <span>{comment.likes}</span>}
          </motion.button>
          <button 
            className="text-xs transition-colors hover:underline"
            style={{ color: themeConfig.colors.textMuted }}
          >
            回复
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function CommentSection({
  comments,
  themeConfig,
  onAddComment,
  onLikeComment,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!newComment.trim()) return
    
    setIsSubmitting(true)
    try {
      await onAddComment(newComment.trim())
      setNewComment('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="p-4">
      {/* Comments List */}
      <AnimatePresence>
        {comments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6"
          >
            <p className="text-sm" style={{ color: themeConfig.colors.textMuted }}>
              暂无评论，来说点什么吧～
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4 mb-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                themeConfig={themeConfig}
                onLike={() => onLikeComment(comment.id)}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div 
        className="flex items-end gap-2 p-3 rounded-xl"
        style={{ background: themeConfig.colors.surfaceAlt }}
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="写下你的评论..."
          className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed max-h-24"
          style={{ color: themeConfig.colors.text }}
          rows={1}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={isSubmitting || !newComment.trim()}
          className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: newComment.trim() ? themeConfig.colors.primary : themeConfig.colors.border,
            color: newComment.trim() ? '#ffffff' : themeConfig.colors.textMuted,
          }}
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </motion.button>
      </div>
    </div>
  )
}
