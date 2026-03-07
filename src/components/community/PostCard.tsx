import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Share2, Sparkles, Bot } from 'lucide-react'
import type { ThemeConfig } from '../../lib/themes'
import type { Post, Comment } from './types'
import CommentSection from './CommentSection'

interface PostCardProps {
  post: Post
  comments: Comment[]
  themeConfig: ThemeConfig
  onLike: () => void
  onShare: () => void
  onLoadComments: () => void
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

export default function PostCard({
  post,
  comments,
  themeConfig,
  onLike,
  onShare,
  onLoadComments,
  onAddComment,
  onLikeComment,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({})

  const handleToggleComments = () => {
    if (!showComments && comments.length === 0) {
      onLoadComments()
    }
    setShowComments(!showComments)
  }

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
      <div className="p-4 flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-11 h-11 rounded-full object-cover"
            style={{ border: `2px solid ${themeConfig.colors.primary}30` }}
          />
          {post.author.isAI && (
            <div 
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: themeConfig.colors.primary }}
            >
              <Bot size={10} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span 
              className="font-semibold text-sm truncate"
              style={{ color: themeConfig.colors.text }}
            >
              {post.author.name}
            </span>
            {post.author.isAI && (
              <span 
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ 
                  background: `${themeConfig.colors.primary}20`,
                  color: themeConfig.colors.primary,
                }}
              >
                AI分身
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5" style={{ color: themeConfig.colors.textMuted }}>
            {formatRelativeTime(post.timestamp)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p 
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: themeConfig.colors.text }}
        >
          {post.content}
        </p>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  background: `${themeConfig.colors.primary}15`,
                  color: themeConfig.colors.primary,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Attachments */}
      {post.attachments && post.attachments.length > 0 && (
        <div className="px-4 pb-3">
          <div className="grid gap-2" style={{ gridTemplateColumns: post.attachments.length === 1 ? '1fr' : 'repeat(2, 1fr)' }}>
            {post.attachments.map((attachment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded[index] ? 1 : 0 }}
                className="relative rounded-xl overflow-hidden"
                style={{ aspectRatio: post.attachments!.length === 1 ? '16/9' : '1' }}
              >
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="w-full h-full object-cover"
                  onLoad={() => setImageLoaded(prev => ({ ...prev, [index]: true }))}
                />
                {!imageLoaded[index] && (
                  <div 
                    className="absolute inset-0 animate-pulse"
                    style={{ background: themeConfig.colors.surfaceAlt }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div 
        className="px-4 py-3 border-t flex items-center justify-between"
        style={{ borderColor: themeConfig.colors.border }}
      >
        <div className="flex items-center gap-6">
          {/* Like Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onLike}
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: post.isLiked ? themeConfig.colors.rose : themeConfig.colors.textMuted }}
          >
            <motion.div
              animate={post.isLiked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart 
                size={18} 
                fill={post.isLiked ? themeConfig.colors.rose : 'transparent'}
              />
            </motion.div>
            <span>{post.likes || '点赞'}</span>
          </motion.button>

          {/* Comment Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleComments}
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: showComments ? themeConfig.colors.primary : themeConfig.colors.textMuted }}
          >
            <MessageCircle size={18} />
            <span>{post.comments || '评论'}</span>
          </motion.button>

          {/* Share Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onShare}
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: post.isShared ? themeConfig.colors.primary : themeConfig.colors.textMuted }}
          >
            <Share2 size={18} />
            <span>{post.shares || '分享'}</span>
          </motion.button>
        </div>

        {/* AI Badge */}
        {post.author.isAI && (
          <div 
            className="flex items-center gap-1 text-xs"
            style={{ color: themeConfig.colors.primary }}
          >
            <Sparkles size={12} />
            <span>AI生成</span>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ borderTop: `1px solid ${themeConfig.colors.border}` }}
          >
            <CommentSection
              comments={comments}
              themeConfig={themeConfig}
              onAddComment={onAddComment}
              onLikeComment={onLikeComment}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
