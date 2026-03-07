import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Sparkles, TrendingUp } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { useTheme } from '../hooks/useTheme'
import { useCommunity } from '../components/community/useCommunity'
import PostCreator from '../components/community/PostCreator'
import PostList from '../components/community/PostList'
import AvatarChat from '../components/community/AvatarChat'

// 社区统计卡片
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  themeConfig 
}: { 
  icon: typeof Users
  label: string
  value: string
  themeConfig: ReturnType<typeof useTheme>['themeConfig']
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="flex items-center gap-3 p-3 rounded-xl"
      style={{
        background: themeConfig.colors.surface,
        border: `1px solid ${themeConfig.colors.border}`,
      }}
    >
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: `${themeConfig.colors.primary}15` }}
      >
        <Icon size={20} style={{ color: themeConfig.colors.primary }} />
      </div>
      <div>
        <p className="text-lg font-bold" style={{ color: themeConfig.colors.text }}>
          {value}
        </p>
        <p className="text-xs" style={{ color: themeConfig.colors.textMuted }}>
          {label}
        </p>
      </div>
    </motion.div>
  )
}

// 热门话题标签
function TrendingTags({ themeConfig }: { themeConfig: ReturnType<typeof useTheme>['themeConfig'] }) {
  const tags = ['AI分身', '数字人', '技术分享', '创意灵感', '社区活动']
  
  return (
    <div 
      className="rounded-2xl p-4"
      style={{
        background: themeConfig.colors.surface,
        border: `1px solid ${themeConfig.colors.border}`,
        boxShadow: themeConfig.shadows.card,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={18} style={{ color: themeConfig.colors.primary }} />
        <h3 
          className="font-semibold text-sm"
          style={{ color: themeConfig.colors.text }}
        >
          热门话题
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <motion.button
            key={tag}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{
              background: index === 0 
                ? `${themeConfig.colors.primary}20`
                : themeConfig.colors.surfaceAlt,
              color: index === 0 
                ? themeConfig.colors.primary
                : themeConfig.colors.textSecondary,
              border: `1px solid ${index === 0 ? themeConfig.colors.primary : themeConfig.colors.border}`,
            }}
          >
            #{tag}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default function Community() {
  const { themeConfig } = useTheme()
  const {
    posts,
    comments,
    currentUser,
    isLoading,
    hasMore,
    avatarMessages,
    isAvatarTyping,
    loadMore,
    createPost,
    toggleLikePost,
    sharePost,
    loadComments,
    addComment,
    toggleLikeComment,
    sendMessageToAvatar,
    refreshCurrentUser,
  } = useCommunity()

  // 当AI分身更新时刷新用户信息
  useEffect(() => {
    const handleStorageChange = () => {
      refreshCurrentUser()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [refreshCurrentUser])

  return (
    <PageTransition>
      <div 
        className="min-h-screen pt-20 pb-24 md:pb-8"
        style={{ background: themeConfig.colors.bg }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.accent})`,
                  boxShadow: `0 8px 24px ${themeConfig.colors.primary}30`,
                }}
              >
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h1 
                  className="text-2xl font-bold"
                  style={{ color: themeConfig.colors.text }}
                >
                  AI分身社区
                </h1>
                <p style={{ color: themeConfig.colors.textMuted }}>
                  分享你的AI分身，与数字世界互动
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards - Desktop Only */}
          <div className="hidden md:grid grid-cols-3 gap-4 mb-6">
            <StatCard 
              icon={Users} 
              label="社区成员" 
              value="1,234" 
              themeConfig={themeConfig}
            />
            <StatCard 
              icon={Sparkles} 
              label="AI分身" 
              value="567" 
              themeConfig={themeConfig}
            />
            <StatCard 
              icon={TrendingUp} 
              label="今日动态" 
              value="89" 
              themeConfig={themeConfig}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Feed */}
            <div className="lg:col-span-2 space-y-4">
              {/* Post Creator */}
              <PostCreator
                currentUser={currentUser}
                themeConfig={themeConfig}
                onSubmit={createPost}
              />

              {/* Posts List */}
              <PostList
                posts={posts}
                comments={comments}
                isLoading={isLoading}
                hasMore={hasMore}
                themeConfig={themeConfig}
                onLoadMore={loadMore}
                onLikePost={toggleLikePost}
                onSharePost={sharePost}
                onLoadComments={loadComments}
                onAddComment={addComment}
                onLikeComment={toggleLikeComment}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="hidden lg:block space-y-4">
              {/* AI Avatar Chat */}
              <AvatarChat
                currentUser={currentUser}
                messages={avatarMessages}
                isTyping={isAvatarTyping}
                themeConfig={themeConfig}
                onSendMessage={sendMessageToAvatar}
              />

              {/* Trending Tags */}
              <TrendingTags themeConfig={themeConfig} />

              {/* Community Info */}
              <div 
                className="rounded-2xl p-4"
                style={{
                  background: themeConfig.colors.surface,
                  border: `1px solid ${themeConfig.colors.border}`,
                  boxShadow: themeConfig.shadows.card,
                }}
              >
                <h3 
                  className="font-semibold text-sm mb-3"
                  style={{ color: themeConfig.colors.text }}
                >
                  社区指南
                </h3>
                <ul className="space-y-2 text-xs" style={{ color: themeConfig.colors.textSecondary }}>
                  <li className="flex items-start gap-2">
                    <span style={{ color: themeConfig.colors.primary }}>•</span>
                    友善交流，尊重每一位社区成员
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: themeConfig.colors.primary }}>•</span>
                    分享你的AI分身使用心得
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: themeConfig.colors.primary }}>•</span>
                    与其他用户的AI分身互动
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: themeConfig.colors.primary }}>•</span>
                    发现更多AI分身的有趣玩法
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile AI Chat Floating Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="lg:hidden fixed bottom-24 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40"
          style={{
            background: themeConfig.colors.primary,
            boxShadow: `0 4px 20px ${themeConfig.colors.primary}50`,
          }}
          onClick={() => {
            // 移动端可以打开一个模态框或跳转到AI分身页面
            window.location.href = '/ai-character'
          }}
        >
          <Sparkles size={24} className="text-white" />
        </motion.button>
      </div>
    </PageTransition>
  )
}
