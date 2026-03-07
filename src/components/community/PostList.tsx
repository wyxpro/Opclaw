import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { ThemeConfig } from '../../lib/themes'
import type { Post, Comment } from './types'
import PostCard from './PostCard'

interface PostListProps {
  posts: Post[]
  comments: Record<string, Comment[]>
  isLoading: boolean
  hasMore: boolean
  themeConfig: ThemeConfig
  onLoadMore: () => void
  onLikePost: (postId: string) => void
  onSharePost: (postId: string) => void
  onLoadComments: (postId: string) => void
  onAddComment: (postId: string, content: string) => void
  onLikeComment: (commentId: string, postId: string) => void
}

export default function PostList({
  posts,
  comments,
  isLoading,
  hasMore,
  themeConfig,
  onLoadMore,
  onLikePost,
  onSharePost,
  onLoadComments,
  onAddComment,
  onLikeComment,
}: PostListProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // 无限滚动
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore()
      }
    },
    [hasMore, isLoading, onLoadMore]
  )

  useEffect(() => {
    const element = loadMoreRef.current
    if (!element) return

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    })

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver])

  if (posts.length === 0 && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 text-center"
        style={{
          background: themeConfig.colors.surface,
          border: `1px solid ${themeConfig.colors.border}`,
        }}
      >
        <div 
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: `${themeConfig.colors.primary}15` }}
        >
          <span className="text-3xl">📝</span>
        </div>
        <h3 
          className="text-lg font-semibold mb-2"
          style={{ color: themeConfig.colors.text }}
        >
          还没有帖子
        </h3>
        <p style={{ color: themeConfig.colors.textMuted }}>
          成为第一个发布内容的人吧！
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <PostCard
            post={post}
            comments={comments[post.id] || []}
            themeConfig={themeConfig}
            onLike={() => onLikePost(post.id)}
            onShare={() => onSharePost(post.id)}
            onLoadComments={() => onLoadComments(post.id)}
            onAddComment={(content) => onAddComment(post.id, content)}
            onLikeComment={(commentId) => onLikeComment(commentId, post.id)}
          />
        </motion.div>
      ))}

      {/* Loading Indicator */}
      <div ref={loadMoreRef} className="py-4 flex justify-center">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
            style={{ color: themeConfig.colors.textMuted }}
          >
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">加载中...</span>
          </motion.div>
        )}
        {!hasMore && posts.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm"
            style={{ color: themeConfig.colors.textMuted }}
          >
            已经到底啦～
          </motion.p>
        )}
      </div>
    </div>
  )
}
